from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.api.deps import require_role
from sqlalchemy import func

router = APIRouter(prefix="/admin", tags=["Admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    return {
        "total_users": db.query(User).count(),
        "recruiters": db.query(User).filter(User.role == "recruiter").count(),
        "candidates": db.query(User).filter(User.role == "candidate").count(),
        "admins": db.query(User).filter(User.role == "admin").count(),
        "jobs": db.query(Job).count(),
        "applications": db.query(Application).count(),
    }

@router.get("/jobs")
def admin_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    data = (
        db.query(
            Job.id,
            Job.title,
            Job.company,
            Job.location,
            Job.skills,
            User.first_name,
            User.last_name,
            func.count(Application.id).label("total_applications")
        )
        .join(User, Job.created_by == User.id)
        .outerjoin(Application, Application.job_id == Job.id)
        .group_by(Job.id, User.first_name, User.last_name)
        .all()
    )

    return [
        {
            "id": d.id,
            "title": d.title,
            "company": d.company,
            "location": d.location,
            "skills": d.skills,
            "created_by": f"{d.first_name} {d.last_name}",
            "total_applications": d.total_applications
        }
        for d in data
    ]

@router.get("/applications")
def admin_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    applications = db.query(Application).all()

    result = []

    for app in applications:
        user = db.query(User).filter(User.id == app.user_id).first()
        job = db.query(Job).filter(Job.id == app.job_id).first()

        result.append({
            "id": app.id,
            "candidate_name": f"{user.first_name} {user.last_name}" if user else "Unknown",
            "job_title": job.title if job else "Unknown",
            "company": job.company if job else "Unknown",
            "status": app.status
        })

    return result


@router.get("/ai-interviews")
def admin_ai_interviews(
    current_user: User = Depends(require_role("admin"))
):
    return {
        "interviews_conducted": 0,
        "avg_score": 0,
        "active_sessions": 0,
        "logs": [
            "AI interview module not connected yet",
            "Future: question generation logs",
            "Future: candidate evaluation logs",
        ],
    }

@router.get("/users")
def admin_users(
    role: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    query = db.query(User)

    if role:
        query = query.filter(User.role == role)

    users = query.order_by(User.id.desc()).all()

    return [
        {
            "id": user.id,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "is_active": user.is_active,
        }
        for user in users
    ]