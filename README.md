# FitnessLab

FitnessLab is a BMI-based fitness planner with a FastAPI backend and a Next.js frontend. The app calculates a fitness category, returns a structured nutrition plan, and serves an 8-week workout plan.

## Project Structure

- `Backend/` - FastAPI API, auth helpers, BMI logic, workout planning, and nutrition/image services.
- `frontend/` - Next.js app that talks to the backend through `/api/proxy`.

## Requirements

- Python 3.14+ for the backend
- Node.js 20+ for the frontend

## Backend Setup

From `Backend/`:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Environment variables are loaded from `Backend/.env`.

Required backend variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Optional backend variables:

- `UNSPLASH_ACCESS_KEY`
- `CORS_ORIGINS`

Run the API:

```bash
uvicorn main:app --reload --port 8080
```

The backend will be available at `http://127.0.0.1:8080`.

## Frontend Setup

From `frontend/`:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

Optional frontend variable:

- `NEXT_PUBLIC_API_BASE_URL` - points the frontend proxy at a different backend URL.

## How The Apps Connect

The frontend sends API requests through `src/app/api/proxy/[...path]/route.ts`, which forwards requests to the backend. If `NEXT_PUBLIC_API_BASE_URL` is not set, the frontend uses `http://127.0.0.1:8080`.

## Useful Commands

Backend:

```bash
uvicorn main:app --reload --port 8080
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
```