from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from datetime import datetime
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
import os

app = FastAPI(title="Shankar Kumar Portfolio API", version="1.0.0")

# ── Static files (profile photo + resume) ───────────────────────────────────
# Place your files in:   backend/static/profile.jpg   and   backend/static/resume.pdf
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ──────────────────────────────────────────────────────────────────

class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class Skill(BaseModel):
    name: str
    category: str
    level: int  # 1-100


class Project(BaseModel):
    id: int
    title: str
    description: str
    tech: List[str]
    highlights: List[str]
    category: str


class Experience(BaseModel):
    id: int
    company: str
    role: str
    period: str
    location: str
    bullets: List[str]
    current: bool


# ── Data ─────────────────────────────────────────────────────────────────────

PROFILE = {
    "name": "Shankar Kumar",
    "title": "Python Developer",
    "subtitle": "Django · Flask · REST API · AI Integration",
    "email": "shankarkm1707@gmail.com",
    "phone": "+91 9650360813",
    "location": "Greater Noida, Delhi NCR",
    "summary": (
        "Results-driven Python Developer with 2+ years of hands-on experience designing, "
        "developing, and optimizing scalable web applications using Django and Flask. "
        "Proven expertise in building AI-powered systems, automating workflows, and "
        "delivering government-grade software solutions."
    ),
    "github": "https://github.com/shankar-kumar",
    "linkedin": "https://linkedin.com/in/shankar-kumar",
}

SKILLS: List[Skill] = [
    Skill(name="Python", category="Languages", level=95),
    Skill(name="Django", category="Frameworks", level=90),
    Skill(name="Flask", category="Frameworks", level=88),
    Skill(name="Django REST Framework", category="Frameworks", level=87),
    Skill(name="SQL", category="Languages", level=82),
    Skill(name="JavaScript", category="Languages", level=70),
    Skill(name="PostgreSQL", category="Databases", level=80),
    Skill(name="MySQL", category="Databases", level=82),
    Skill(name="AWS (S3, EC2)", category="Cloud & DevOps", level=72),
    Skill(name="Docker", category="Cloud & DevOps", level=70),
    Skill(name="Celery", category="Cloud & DevOps", level=75),
    Skill(name="HuggingFace BART", category="AI/ML", level=80),
    Skill(name="GPT-4 Mini", category="AI/ML", level=78),
    Skill(name="Rasa NLP", category="AI/ML", level=76),
    Skill(name="BeautifulSoup", category="Tools", level=80),
    Skill(name="Git", category="Tools", level=85),
]

PROJECTS: List[Project] = [
    Project(
        id=1,
        title="Government Grievance Portal",
        description="Production-ready grievance automation platform processing incoming emails with intelligent NLP pipelines.",
        tech=["Python", "Flask", "SQL Server", "NLP", "HuggingFace BART", "IMAP"],
        highlights=[
            "HuggingFace BART summarization to transform unstructured emails into structured DB records",
            "IMAP-based email ingestion reducing manual processing effort by 80%",
            "Full record lifecycle management with file upload, validation and status tracking",
            "Parameterized queries and stored procedures for security and performance",
        ],
        category="Government",
    ),
    Project(
        id=2,
        title="AI Chatbot System",
        description="AI-powered chatbot with intelligent Q&A using Rasa and GPT-4 Mini, with dynamic knowledge base updates.",
        tech=["Rasa", "Flask", "GPT-4 Mini", "Python", "YAML"],
        highlights=[
            "Intelligent Q&A powered by Rasa + GPT-4 Mini integration",
            "Document upload module for dynamic knowledge base updates",
            "Automated Rasa YAML config generation and model retraining via Flask APIs",
            "Zero manual intervention for retraining pipeline",
        ],
        category="AI",
    ),
    Project(
        id=3,
        title="Government Data Collection App",
        description="Large-scale government data collection system integrating APIs from multiple ministries.",
        tech=["Python", "Django", "MySQL", "HTML", "CSS", "JavaScript"],
        highlights=[
            "API integration from multiple ministries with unified data model",
            "Data pipelines for decrypting, validating district-wise and state-wise datasets",
            "Training module for system users and administrators",
        ],
        category="Government",
    ),
    Project(
        id=4,
        title="Supply Chain Management System",
        description="End-to-end SCMS covering procurement, inventory, distribution and POS transactions.",
        tech=["Django", "PostgreSQL", "AWS", "Docker", "Celery"],
        highlights=[
            "Full workflows: procurement, inventory, distribution, POS",
            "Celery for async task processing, improving system response time significantly",
            "Deployed on AWS EC2 + S3 with Docker containerization",
        ],
        category="Enterprise",
    ),
    Project(
        id=5,
        title="Government Inventory Management System",
        description="Enhanced inventory system with automated monthly limits, budget validation, and multi-level approvals.",
        tech=["Python", "Django", "MySQL"],
        highlights=[
            "Automated monthly consumable limits and budget validation",
            "Multi-level approval workflows",
            "Financial checks ensuring requests stay within allocated budget",
        ],
        category="Government",
    ),
]

EXPERIENCE: List[Experience] = [
    Experience(
        id=1,
        company="Cyfuture India Pvt. Ltd.",
        role="Python Developer",
        period="Oct 2024 – Present",
        location="Greater Noida",
        current=True,
        bullets=[
            "Designed and developed scalable Python applications independently, reducing delivery time by 20%",
            "Automated repetitive business workflows using Python scripts, improving team efficiency by 30%",
            "Optimized Python codebase using best practices, resulting in measurable performance improvements",
            "Integrated AI/ML models into production systems for intelligent data processing and automation",
        ],
    ),
    Experience(
        id=2,
        company="Chetu Inc.",
        role="Software Engineer",
        period="Dec 2021 – Sep 2022",
        location="Noida",
        current=False,
        bullets=[
            "Built reusable, modular components that reduced development effort by 25% across multiple projects",
            "Developed scalable and maintainable code ensuring long-term system stability",
            "Integrated new technologies into existing systems, enhancing overall platform capabilities",
            "Collaborated with cross-functional teams to deliver features on schedule",
        ],
    ),
]


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Shankar Kumar Portfolio API", "status": "running"}


@app.get("/api/profile")
def get_profile():
    return PROFILE


@app.get("/api/skills", response_model=List[Skill])
def get_skills():
    return SKILLS


@app.get("/api/projects", response_model=List[Project])
def get_projects(category: str = None):
    if category:
        return [p for p in PROJECTS if p.category.lower() == category.lower()]
    return PROJECTS


@app.get("/api/projects/{project_id}", response_model=Project)
def get_project(project_id: int):
    proj = next((p for p in PROJECTS if p.id == project_id), None)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj


@app.get("/api/experience", response_model=List[Experience])
def get_experience():
    return EXPERIENCE

@app.post("/api/contact")
def send_contact(msg: ContactMessage):
    print(f"Contact from {msg.name} <{msg.email}>: {msg.subject}")
    return {
        "success": True,
        "message": f"Thanks {msg.name}! Your message has been received. I'll get back to you soon.",
    }
# @app.post("/api/contact")
# def send_contact(msg: ContactMessage):
#     try:
#         # Email config
#         GMAIL_USER = os.environ.get("GMAIL_USER")
#         GMAIL_PASS = os.environ.get("GMAIL_PASS")

#         # Email content
#         email = MIMEMultipart("alternative")
#         email["Subject"] = f"Portfolio Contact: {msg.subject}"
#         email["From"] = GMAIL_USER
#         email["To"] = GMAIL_USER  # apne aap ko email aayegi

#         body = f"""
#         New message from your portfolio!
        
#         Name:    {msg.name}
#         Email:   {msg.email}
#         Subject: {msg.subject}
        
#         Message:
#         {msg.message}
#         """

#         email.attach(MIMEText(body, "plain"))

#         # Send karo
#         with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
#             server.login(GMAIL_USER, GMAIL_PASS)
#             server.sendmail(GMAIL_USER, GMAIL_USER, email.as_string())

#         print(f"Email sent for contact from {msg.name}")

#     except Exception as e:
#         print(f"Email error: {e}")
#         # Email fail ho bhi jaye to user ko success dikhao
    
#     return {
#         "success": True,
#         "message": f"Thanks {msg.name}! Your message has been received. I'll get back to you soon.",
#     }


@app.get("/api/stats")
def get_stats():
    return {
        "years_experience": 2,
        "projects_delivered": len(PROJECTS),
        "efficiency_improvement": "30%",
        "delivery_time_reduction": "20%",
    }
