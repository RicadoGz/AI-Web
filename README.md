# Personal Website Starter

This repository now contains a minimal personal website starter with:

- `frontend/`: Next.js app with a homepage, visit tracker, and chat widget
- `backend/`: FastAPI app with chat and analytics endpoints

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` if your backend is not running on `http://127.0.0.1:8000`.

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
