# Candor — Anonymous Q&A App

Share a link. Friends send you anonymous messages. You reply publicly as a
shareable card, or ignore/report. Built as a portfolio project to demonstrate
end-to-end product + technical execution: UI design (Figma), frontend (React),
backend (Flask), database design (MySQL), and deployment (Replit).

## How it's built

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS (UI generated in
  Figma Make, then wired up to a real backend)
- **Backend**: Python (Flask) REST API
- **Database**: MySQL (hosted on Aiven's free tier)
- **Routing**: `react-router-dom` — `/` is your own app (inbox, replies,
  insights, settings); `/<username>` is the *public* page anyone can visit
  to send you an anonymous message
- **Deployment**: Single Replit project — Flask serves both the API and the
  built React app, so the whole product lives at one URL

## Project structure

```
candor_project/
├── src/                    # React frontend
│   ├── App.tsx             # Routing + top-level state
│   ├── api.ts              # All backend API calls live here
│   └── screens/            # Onboarding, Signup, Inbox, Reply, Share,
│                           # Insights, Settings, SendMessage (public page)
├── backend/
│   ├── app.py              # Flask API + serves the built frontend
│   ├── schema.sql           # MySQL table definitions — run this first
│   ├── requirements.txt
│   └── .env.example         # Copy to backend/.env and fill in your values
├── package.json
└── vite.config.ts
```

## 1. Set up the database (Aiven MySQL, free tier)

1. Create a free MySQL service at aiven.io
2. From the service overview page, copy: host, port, user, password, database name
3. Connect to it (Aiven gives you a connection command, or use any MySQL
   client / the Aiven console's built-in query editor) and run everything
   in `backend/schema.sql` once to create the tables
4. Copy `backend/.env.example` to `backend/.env` and fill in the values from
   step 2

## 2. Run the backend locally (optional, for testing before deploying)

```bash
cd backend
pip install -r requirements.txt
python app.py
```
This starts the API at `http://localhost:8000`.

## 3. Run the frontend locally

```bash
npm install
npm run dev
```
This starts the dev server (usually `http://localhost:5173`). Since the
frontend and backend run on different ports locally, create a `.env` file
in the project root with:
```
VITE_API_URL=http://localhost:8000
```

## 4. Deploy on Replit (single live URL)

1. Import this repo into a new Replit project (Python template)
2. In the Replit Shell, build the frontend once:
   ```bash
   npm install
   npm run build
   ```
   This creates a `dist/` folder with the production frontend.
3. Set your environment variables in Replit's **Secrets** tab (same values
   as `backend/.env`) — do NOT commit your real `.env` file to GitHub.
4. Run the backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
   Flask will serve both the API (`/api/*`) and the built React app (`/`)
   from the same URL — that's your live product link.
5. Whenever you change the frontend, re-run `npm run build` so Flask picks
   up the new `dist/` files.

## What to say about this project in interviews

- **Product decisions**: why anonymous messaging needs a moderation flag
  (`is_reported`) baked into the schema from day one, not bolted on later
- **Growth loop**: the public `/<username>` page has zero friction (no
  login) — that's deliberate, since friction on the sending side is the
  #1 killer of virality in this app category
- **Schema design**: normalized 3-table structure (`users`, `messages`,
  `replies`) with foreign keys, rather than a single denormalized table
- **Scope cuts made deliberately for an MVP**: localStorage-based session
  instead of real auth, no rate limiting/spam protection yet, no push
  notifications — all good "what I'd build next" talking points
