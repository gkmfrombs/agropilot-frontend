# AgroPilot — Deployment Guide

## Backend → Render.com

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect the `agropilot-frontend` GitHub repo
3. Settings:
   - **Root Directory:** `.` (repo root, NOT `backend/`)
   - **Runtime:** Docker
   - **Dockerfile Path:** `./Dockerfile`
4. Add these Environment Variables in the Render dashboard:
   - `GROQ_API_KEY` → your Groq API key from console.groq.com
   - `JWT_SECRET` → any long random string (e.g. `openssl rand -hex 32`)
5. Deploy. First deploy takes ~5 min (installs sentence-transformers).
6. Copy the backend URL (e.g. `https://agropilot-backend.onrender.com`)

> **Note:** Free tier on Render spins down after inactivity. Use a paid instance or Railway for always-on.

---

## Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import `agropilot-frontend`
2. Settings:
   - **Root Directory:** `web`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add Environment Variable:
   - `VITE_API_URL` → the Render backend URL from step above (no trailing slash)
4. Deploy.

---

## Environment Variables Reference

### Backend (Render)
| Key | Required | Description |
|-----|----------|-------------|
| `GROQ_API_KEY` | YES | LLM inference — get from console.groq.com (free) |
| `JWT_SECRET` | YES | Any random secret string for auth tokens |
| `CSV_DIR` | auto-set | Already set to `./data/` by render.yaml |

### Frontend (Vercel)
| Key | Required | Description |
|-----|----------|-------------|
| `VITE_API_URL` | YES | Full URL of deployed backend, e.g. `https://agropilot-backend.onrender.com` |

---

## Optional: Neo4j Graph DB (AuraDB)

Leave these unset to use CSV-only mode (default, works fine):
- `NEO4J_URI`
- `NEO4J_USER`
- `NEO4J_PASS`

To enable graph features: create a free AuraDB instance at neo4j.com/cloud/aura and add the credentials.
