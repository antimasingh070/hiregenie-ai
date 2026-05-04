from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.db.session import SessionLocal
from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.api.deps import require_role

router = APIRouter(prefix="/applications", tags=["Applications"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/{job_id}")
def apply_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("candidate"))
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.job_id == job_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already applied")

    application = Application(
        user_id=current_user.id,
        job_id=job_id,
        status="applied",
        ats_score=None,
        ai_summary=None,
        ai_recommendation=None
    )

    db.add(application)
    db.commit()

    return {"message": "Applied successfully"}


@router.get("/")
def get_applications(
    job_id: int | None = None,
    status: str | None = None,
    min_score: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter"))
):
    query = (
        db.query(Application, Job, User)
        .join(Job, Application.job_id == Job.id)
        .join(User, Application.user_id == User.id)
    )

    if job_id:
        query = query.filter(Application.job_id == job_id)

    if status:
        query = query.filter(Application.status == status)

    if min_score:
        query = query.filter(Application.ats_score >= min_score)

    records = query.all()

    result = []

    for app, job, user in records:
        result.append({
            "id": app.id,
            "candidate_name": f"{user.first_name} {user.last_name}",
            "candidate_email": user.email,
            "job_id": job.id,
            "job_title": job.title,
            "company": job.company,
            "location": job.location,
            "required_skills": job.skills,
            "status": app.status,
            "ats_score": app.ats_score,
            "ai_summary": app.ai_summary,
            "ai_recommendation": app.ai_recommendation,
            "created_at": app.created_at
        })

    return result


@router.patch("/{application_id}/status")
def update_application_status(
    application_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter"))
):
    application = db.query(Application).filter(Application.id == application_id).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    application.status = status
    db.commit()

    return {"message": "Status updated successfully"}


@router.get("/{application_id}/ai-report")
def get_ai_report(
    application_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter"))
):
    record = (
        db.query(Application, Job, User)
        .join(Job, Application.job_id == Job.id)
        .join(User, Application.user_id == User.id)
        .filter(Application.id == application_id)
        .first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="Application not found")

    app, job, user = record

    return {
        "application_id": app.id,
        "candidate": {
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email
        },
        "job": {
            "title": job.title,
            "company": job.company,
            "skills": job.skills
        },
        "screening": {
            "ats_score": app.ats_score or 0,
            "status": app.status,
            "recommendation": app.ai_recommendation or "Pending AI screening",
            "summary": app.ai_summary or "AI report has not been generated yet.",
            "reason": get_score_reason(app.ats_score)
        }
    }


def get_score_reason(score):
    if score is None:
        return "Resume has not been screened yet."

    if score >= 85:
        return "Candidate strongly matches the job requirements."

    if score >= 70:
        return "Candidate has a good profile but may need manual review."

    if score >= 50:
        return "Candidate partially matches the role. Recruiter should verify experience and skills."

    return "Candidate has low match score for this job."