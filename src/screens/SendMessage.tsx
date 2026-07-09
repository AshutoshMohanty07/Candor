import { useEffect, useState } from "react";
import { api } from "../api";

// This is the PUBLIC page anyone lands on when they open candor.app/username.
// No login required — this is the entire growth loop of the product.

type Status = "checking" | "valid" | "not_found" | "sending" | "sent" | "error";

export default function SendMessage({ username }: { username: string }) {
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const maxLen = 500;

  useEffect(() => {
    api
      .checkUserExists(username)
      .then((res) => setStatus(res.exists ? "valid" : "not_found"))
      .catch(() => setStatus("not_found"));
  }, [username]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.sendMessage(username, message.trim());
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send.");
      setStatus("valid");
    }
  };

  if (status === "checking") {
    return <CenteredState text="Loading..." />;
  }

  if (status === "not_found") {
    return <CenteredState text={`candor.app/${username} doesn't exist.`} sub="Check the link and try again." />;
  }

  if (status === "sent") {
    return (
      <CenteredState
        emoji="🎉"
        text="Sent anonymously!"
        sub={`${username} will see your message in their inbox — they won't know it's you.`}
        cta
      />
    );
  }

  return (
    <div
      className="flex flex-col h-dvh relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 260px 260px at 50% 20%, rgba(168,85,247,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="flex flex-col px-6 pt-16 flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
          >
            C
          </div>
          <span className="font-extrabold" style={{ fontSize: 15, color: "var(--muted-foreground)" }}>
            candor.app/{username}
          </span>
        </div>

        <h1
          className="font-extrabold leading-tight mb-3"
          style={{ fontSize: 28, color: "var(--foreground)", letterSpacing: "-0.5px" }}
        >
          Send <span className="gradient-text">{username}</span> an anonymous message
        </h1>
        <p className="mb-6 font-medium" style={{ color: "var(--muted-foreground)", fontSize: 15 }}>
          👻 They won't know it's you. Be honest, be kind.
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, maxLen))}
          placeholder="Say something anonymously..."
          className="w-full rounded-2xl p-4 font-semibold resize-none outline-none transition-all duration-200"
          style={{
            background: "var(--card)",
            border: `1.5px solid ${message ? "rgba(168,85,247,0.3)" : "rgba(168,85,247,0.1)"}`,
            color: "var(--foreground)",
            fontSize: 16,
            lineHeight: 1.5,
            minHeight: 160,
          }}
          rows={6}
          autoFocus
        />
        <div className="flex justify-end mt-2">
          <span
            className="text-xs font-bold"
            style={{ color: message.length > maxLen * 0.85 ? "#f97316" : "var(--muted-foreground)" }}
          >
            {message.length}/{maxLen}
          </span>
        </div>

        {errorMsg && (
          <p className="text-sm font-semibold mt-3" style={{ color: "#f87171" }}>
            {errorMsg}
          </p>
        )}
      </div>

      <div className="px-6 pb-12 relative z-10">
        <button
          onClick={handleSend}
          disabled={!message.trim() || status === "sending"}
          className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-200 active:scale-95"
          style={{
            background: message.trim()
              ? "linear-gradient(135deg, #7c3aed, #ec4899)"
              : "rgba(168,85,247,0.15)",
            color: message.trim() ? "#fff" : "#7c6fa8",
            boxShadow: message.trim() ? "0 8px 24px rgba(168,85,247,0.35)" : "none",
            fontSize: 17,
          }}
        >
          {status === "sending" ? "Sending..." : "Send anonymously 👻"}
        </button>
      </div>
    </div>
  );
}

function CenteredState({
  emoji = "🔗",
  text,
  sub,
  cta,
}: {
  emoji?: string;
  text: string;
  sub?: string;
  cta?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center h-dvh px-8 text-center gap-3"
      style={{ background: "var(--background)" }}
    >
      <div style={{ fontSize: 40 }}>{emoji}</div>
      <p className="font-extrabold" style={{ fontSize: 20, color: "var(--foreground)" }}>
        {text}
      </p>
      {sub && (
        <p className="font-medium" style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
          {sub}
        </p>
      )}
      {cta && (
        <a
          href="/"
          className="mt-4 px-6 py-3 rounded-2xl font-bold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", fontSize: 15 }}
        >
          Get your own Candor link →
        </a>
      )}
    </div>
  );
}
