# Shankar Kumar — Portfolio Website

A full-stack portfolio built with **FastAPI** (backend) + **React + Vite** (frontend).

---

## Project Structure

```
portfolio/
├── backend/
│   ├── main.py            ← FastAPI app (all routes & data)
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        └── App.jsx        ← Full React portfolio UI
```

---

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be live at: `http://localhost:8000`  
Auto-docs (Swagger UI): `http://localhost:8000/docs`

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Site will be live at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | /api/profile         | Personal info & summary  |
| GET    | /api/skills          | All skills with levels   |
| GET    | /api/projects        | All projects (filterable)|
| GET    | /api/projects/{id}   | Single project detail    |
| GET    | /api/experience      | Work experience          |
| GET    | /api/stats           | Key achievement stats    |
| POST   | /api/contact         | Contact form submission  |

Filter projects by category: `/api/projects?category=Government`

---

## Customization

All content lives in `backend/main.py` — edit the `PROFILE`, `SKILLS`, `PROJECTS`, and `EXPERIENCE` lists to update your portfolio data. The frontend fetches everything from the API automatically.

### To enable real email on contact form:
In `main.py`, replace the `print(...)` in `send_contact()` with SMTP or a service like SendGrid/Resend.

---

## Production Deployment

**Backend**: Deploy to Railway, Render, or AWS EC2  
**Frontend**: `npm run build` → deploy `dist/` to Vercel, Netlify, or S3 static hosting  
**CORS**: Update `allow_origins` in `main.py` to your frontend domain

---

## Tech Stack

- **Backend**: Python, FastAPI, Pydantic, Uvicorn
- **Frontend**: React 18, Vite, CSS-in-JS
- **Fonts**: Syne (headings), DM Sans (body)
