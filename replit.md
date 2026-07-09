# Candor — Anonymous Q&A App

Anonymous messaging app where users share a link, friends send anonymous messages, and users reply publicly as shareable cards.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Python (Flask) REST API — serves both the API and the built React app
- **Database**: MySQL hosted on Aiven (free tier)

## How to run

The workflow `Start application` runs `cd backend && python app.py`, which serves the full app (API + built React frontend) on port 5000.

**After any frontend changes**, rebuild before restarting:
```bash
npm run build
```
Then restart the `Start application` workflow so Flask picks up the new `dist/` files.

## Project structure

```
candor_project/
├── src/                    # React frontend
│   ├── App.tsx             # Routing + top-level state
│   ├── api.ts              # All backend API calls
│   └── screens/            # Onboarding, Signup, Inbox, Reply, Share,
│                           #   Insights, Settings, SendMessage
├── backend/
│   ├── app.py              # Flask API + static file serving
│   ├── schema.sql          # MySQL table definitions (run once on a new DB)
│   └── requirements.txt
├── package.json
└── vite.config.ts
```

## Environment secrets (set in Replit Secrets)

| Secret      | Description                          |
|-------------|--------------------------------------|
| `DB_HOST`   | Aiven MySQL host                     |
| `DB_PORT`   | Aiven MySQL port                     |
| `DB_USER`   | Aiven MySQL user                     |
| `DB_PASSWORD` | Aiven MySQL password               |
| `DB_NAME`   | Aiven MySQL database name            |
| `PORT`      | Server port (set to 5000 for Replit) |

## Notes

- Flask's `static_folder` is set to `"../dist"` (relative to `backend/`) so it picks up Vite's build output at the project root.
- The app uses localStorage-based sessions (no server-side auth) — intentional MVP scope cut.
- `/<username>` is a public page with zero login friction — deliberate for virality.

## User preferences

(none yet)
