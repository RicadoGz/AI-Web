# Personal Website Starter

This repository now contains a minimal personal website starter with:

- `frontend/`: Vite + React + TypeScript + Tailwind single-page cinematic hero
- `backend/`: FastAPI app with chat and analytics endpoints

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` by default.

## Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Endpoints

- `GET /health`
- `POST /track/page-view`
- `POST /track/event`
- `POST /chat/message`
- `GET /admin/analytics/overview`
