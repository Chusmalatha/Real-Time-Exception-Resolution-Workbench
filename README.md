# Real-Time Exception Resolution Workbench

## Purpose
This project is an enterprise-style AI-powered transaction exception management system. It provides a foundation for human reviewers to investigate flagged transactions, ask an AI for explanations/resolutions, and auto-resolve items based on confidence thresholds.

This is **Part 1** of the implementation, which focuses purely on the project architecture, frontend-backend connection, and foundational setup.

## Tech Stack
**Frontend:** React, Vite, Tailwind CSS, React Router, Axios  
**Backend:** Python, FastAPI, Pydantic, Motor (MongoDB)

## Folder Structure
```
Real-Time-Exception-Resolution-Workbench/
├── frontend/             # React application
└── backend/              # FastAPI application
```

## Setup & Running

### Frontend Setup
1. Navigate to `frontend/`
2. Configure your `.env` (already done out of the box: `VITE_API_BASE_URL=http://localhost:8000`)
3. Install dependencies: `npm install`
4. Start the frontend: `npm run dev`

### Backend Setup
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Configure `.env` if necessary (defaults to local MongoDB).
6. Start the backend: `uvicorn app.main:app --reload --port 8000`

### Verification
Once both servers are running, the frontend Dashboard page will make a request to the backend `/api/health` endpoint and display `Backend Status: Connected` if successful.
