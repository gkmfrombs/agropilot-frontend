# AgroPilot — Syngenta IITM Hackathon 2026

AI-guided field force intelligence platform for agricultural sales reps and managers.

## 📁 Repo Structure

```text
agropilot-frontend/
├── frontend/     # Web app (React + Vite + TypeScript)
├── backend/      # API server (FastAPI + Python)
├── data/         # Dataset CSVs (Shared data)
└── designs/      # HTML/JSX design prototypes
```

---

## 🚀 Running the Backend

**Requirements:** Python 3.10+

```bash
cd backend

# Create and activate virtual environment
python -m venv .agri_env

# Windows:
.agri_env\Scripts\activate
# Mac/Linux:
source .agri_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start server
python -m uvicorn main:app --reload
```

- **API runs at:** `http://localhost:8000`
- **Interactive docs:** `http://localhost:8000/docs`

---

## 💻 Running the Web Frontend

**Requirements:** Node.js 18+

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

- **App runs at:** `http://localhost:5173`

> **Note:** By default, the frontend connects to `http://localhost:8000`. 
> To override this, set `VITE_API_URL` in a `.env` file inside `frontend/`.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | **Yes** | Groq API key for LLM features (Chat, Scanner, Graph) |
| `JWT_SECRET` | No | JWT signing secret (default: dev value) |
| `CSV_DIR` | No | Path to data folder (default: `../data/`) |
| `FRONTEND_URL` | No | CORS origin (default: `http://localhost:5173`) |

### Web Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend URL (default: `http://localhost:8000`) |

---

## 🔑 Demo Credentials

Use any `rep_id` from `backend/data/reps_territory.csv` as the username.  
**Password:** `password123` (dev mode)
