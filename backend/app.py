"""
Candor — Anonymous Q&A App backend
-----------------------------------
A small Flask API backed by MySQL. Read the comments — they explain what
each piece does so you can talk through this code confidently in interviews.

Run locally:
    pip install -r requirements.txt
    cp .env.example .env   # then fill in your Aiven MySQL credentials
    python app.py

The frontend (Vite/React) talks to this via fetch calls — see src/api.ts
in the frontend project.
"""

import os
from datetime import datetime, timedelta

import mysql.connector
from mysql.connector import pooling
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="dist", static_url_path="")
CORS(app)  # allow the frontend (different origin during local dev) to call this API

# ---------------------------------------------------------------------------
# Database connection pool
# ---------------------------------------------------------------------------
# A connection pool avoids opening a brand-new MySQL connection on every
# single request, which is slow and can exhaust Aiven's free-tier connection
# limit. We open a small pool once, and each request borrows a connection.

DB_CONFIG = {
    "host": os.environ.get("DB_HOST"),
    "port": int(os.environ.get("DB_PORT", 3306)),
    "user": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
    "database": os.environ.get("DB_NAME"),
    "ssl_disabled": False,
}

# Only attach a CA cert if one is actually present — Aiven works without
# strict verification too, which keeps local setup simple.
ssl_ca_path = os.environ.get("DB_SSL_CA")
if ssl_ca_path and os.path.exists(ssl_ca_path):
    DB_CONFIG["ssl_ca"] = ssl_ca_path
    DB_CONFIG["ssl_verify_cert"] = True

pool = pooling.MySQLConnectionPool(pool_name="candor_pool", pool_size=5, **DB_CONFIG)


def get_conn():
    return pool.get_connection()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def clean_username(raw: str) -> str:
    """Match the same rule the frontend Signup screen already enforces:
    lowercase letters, numbers, underscores only."""
    return "".join(c for c in raw.lower() if c.isalnum() or c == "_")


def row_to_message(row) -> dict:
    return {
        "id": str(row["message_id"]),
        "text": row["content"],
        "time": row["created_at"].isoformat(),
        "replied": bool(row["is_replied"]),
    }


# ---------------------------------------------------------------------------
# Routes — users
# ---------------------------------------------------------------------------

@app.route("/api/users/<username>", methods=["GET"])
def check_user(username):
    """Used by the public send-message page to confirm a link is valid,
    and by the app to check if a username is already taken during signup."""
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT user_id, username FROM users WHERE username = %s", (username,))
        row = cur.fetchone()
        return jsonify({"exists": row is not None})
    finally:
        conn.close()


@app.route("/api/users", methods=["POST"])
def create_user():
    """Creates a new user during signup. Returns 409 if the username is
    already taken, so the frontend can show a clear error."""
    data = request.get_json(force=True)
    username = clean_username(data.get("username", ""))

    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters."}), 400

    conn = get_conn()
    try:
        cur = conn.cursor()
        try:
            cur.execute("INSERT INTO users (username) VALUES (%s)", (username,))
            conn.commit()
        except mysql.connector.errors.IntegrityError:
            return jsonify({"error": "That username is already taken."}), 409
        return jsonify({"username": username}), 201
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Routes — messages (the anonymous Q&A core loop)
# ---------------------------------------------------------------------------

@app.route("/api/messages", methods=["POST"])
def send_message():
    """Called from the PUBLIC send-message page (no login) — anyone with
    the link can post an anonymous message to a recipient."""
    data = request.get_json(force=True)
    recipient_username = clean_username(data.get("recipient_username", ""))
    content = (data.get("content") or "").strip()

    if not content:
        return jsonify({"error": "Message can't be empty."}), 400
    if len(content) > 500:
        return jsonify({"error": "Message is too long."}), 400

    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT user_id FROM users WHERE username = %s", (recipient_username,))
        recipient = cur.fetchone()
        if not recipient:
            return jsonify({"error": "This link doesn't exist."}), 404

        cur.execute(
            "INSERT INTO messages (recipient_id, content) VALUES (%s, %s)",
            (recipient["user_id"], content),
        )
        conn.commit()
        return jsonify({"status": "sent"}), 201
    finally:
        conn.close()


@app.route("/api/messages/<username>", methods=["GET"])
def get_inbox(username):
    """Owner's inbox — used by the Inbox screen. Hides reported messages."""
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT user_id FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        if not user:
            return jsonify({"error": "User not found."}), 404

        cur.execute(
            """SELECT message_id, content, is_replied, is_reported, created_at
               FROM messages
               WHERE recipient_id = %s AND is_reported = FALSE
               ORDER BY created_at DESC""",
            (user["user_id"],),
        )
        messages = [row_to_message(r) for r in cur.fetchall()]
        return jsonify({"messages": messages})
    finally:
        conn.close()


@app.route("/api/messages/<int:message_id>/ignore", methods=["POST"])
def ignore_message(message_id):
    """Ignoring just deletes the message — matches the current frontend
    behavior (handleIgnore removes it from state entirely)."""
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM messages WHERE message_id = %s", (message_id,))
        conn.commit()
        return jsonify({"status": "ignored"})
    finally:
        conn.close()


@app.route("/api/messages/<int:message_id>/report", methods=["POST"])
def report_message(message_id):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("UPDATE messages SET is_reported = TRUE WHERE message_id = %s", (message_id,))
        conn.commit()
        return jsonify({"status": "reported"})
    finally:
        conn.close()


@app.route("/api/messages/<int:message_id>/reply", methods=["POST"])
def reply_to_message(message_id):
    data = request.get_json(force=True)
    reply_content = (data.get("reply_content") or "").strip()
    is_public = bool(data.get("is_public", True))

    if not reply_content:
        return jsonify({"error": "Reply can't be empty."}), 400

    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO replies (message_id, reply_content, is_public) VALUES (%s, %s, %s)",
            (message_id, reply_content, is_public),
        )
        cur.execute(
            "UPDATE messages SET is_replied = TRUE WHERE message_id = %s", (message_id,)
        )
        conn.commit()
        return jsonify({"status": "replied"}), 201
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Routes — insights (powers the Insights tab)
# ---------------------------------------------------------------------------

@app.route("/api/insights/<username>", methods=["GET"])
def get_insights(username):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT user_id FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        if not user:
            return jsonify({"error": "User not found."}), 404
        uid = user["user_id"]

        cur.execute("SELECT COUNT(*) AS total FROM messages WHERE recipient_id = %s", (uid,))
        total = cur.fetchone()["total"]

        cur.execute(
            "SELECT COUNT(*) AS replied FROM messages WHERE recipient_id = %s AND is_replied = TRUE",
            (uid,),
        )
        replied = cur.fetchone()["replied"]

        week_ago = datetime.utcnow() - timedelta(days=7)
        cur.execute(
            "SELECT COUNT(*) AS this_week FROM messages WHERE recipient_id = %s AND created_at >= %s",
            (uid, week_ago),
        )
        this_week = cur.fetchone()["this_week"]

        # Most active day of the week, by message volume (a nice, simple
        # SQL GROUP BY that's worth showing off in interviews)
        cur.execute(
            """SELECT DAYNAME(created_at) AS day, COUNT(*) AS cnt
               FROM messages WHERE recipient_id = %s
               GROUP BY day ORDER BY cnt DESC LIMIT 1""",
            (uid,),
        )
        top_day_row = cur.fetchone()
        most_active_day = top_day_row["day"] if top_day_row else None

        return jsonify({
            "total": total,
            "replied": replied,
            "reply_rate": round(replied / total, 2) if total else 0,
            "messages_this_week": this_week,
            "most_active_day": most_active_day,
        })
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Serve the built React app (production) — see README for how this is built
# ---------------------------------------------------------------------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """In production, `npm run build` outputs static files into dist/.
    This lets one Flask app + one Replit URL serve both the API and the
    React app, which keeps the whole project a single live link."""
    full_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
