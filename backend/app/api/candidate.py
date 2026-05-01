from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import SessionLocal
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.api.deps import get_current_user, require_role

router = APIRouter(prefix="/candidate", tags=["Candidate"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def candidate_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    total_applications = (
        db.query(Application)
        .filter(Application.user_id == current_user.id)
        .count()
    )

    interviews = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id,
            Application.status == "interview"
        )
        .count()
    )

    shortlisted = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id,
            Application.status == "shortlisted"
        )
        .count()
    )

    return {
        "applications": total_applications,
        "interviews": interviews,
        "shortlisted": shortlisted,
        "ats_score": 78
    }


@router.get("/jobs")
def browse_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    jobs = db.query(Job).all()

    applied_job_ids = {
        app.job_id
        for app in db.query(Application)
        .filter(Application.user_id == current_user.id)
        .all()
    }

    return [
        {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "skills": job.skills,
            "description": job.description,
            "already_applied": job.id in applied_job_ids
        }
        for job in jobs
    ]


@router.post("/jobs/{job_id}/apply")
def apply_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = (
        db.query(Application)
        .filter(
            Application.user_id == current_user.id,
            Application.job_id == job_id
        )
        .first()
    )

    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    application = Application(
        user_id=current_user.id,
        job_id=job_id,
        status="applied"
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {"message": "Applied successfully", "application_id": application.id}


@router.get("/applications")
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    data = (
        db.query(Application, Job)
        .join(Job, Application.job_id == Job.id)
        .filter(Application.user_id == current_user.id)
        .all()
    )

    return [
        {
            "id": app.id,
            "job_title": job.title,
            "company": job.company,
            "location": job.location,
            "skills": job.skills,
            "status": app.status
        }
        for app, job in data
    ]