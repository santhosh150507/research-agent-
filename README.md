# AI Research Literature Discovery Agent

An agentic research assistant built with FastAPI, PostgreSQL/pgvector, and Next.js.

## Setup
```cmd
python -m venv venv
venv\Scripts\activate
pip install -r backend\requirements.txt
```

## Environment Variables
Copy `.env.example` to `.env`. Do NOT commit real API keys.
Format for Neon DB: `DATABASE_URL=postgresql+psycopg2://user:password@host/dbname?sslmode=require`
Set `DEMO_MODE=true` to use rule-based fallback without keys.

## Database & Run
```cmd
cd backend
alembic upgrade head
python -m pytest
uvicorn app.main:app
```

## Demo Instructions
1. Upload a PDF using `/upload`.
2. Understand query using `/query/understand`.
3. Search via `/search`.
4. Chat via `/conversations/{id}/messages`.
5. Generate a review via `/literature-review`.

## Deployment
Use Docker-compose for local deployment. For Render/Railway, configure `CORS_ORIGINS`.
