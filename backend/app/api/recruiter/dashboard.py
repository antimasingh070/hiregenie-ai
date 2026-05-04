from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import SessionLocal
from app.api.deps import require_role
from app.models.job import Job
from app.models.application import Application
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_recruiter_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter"))
):
    total_jobs = db.query(Job).count()

    total_applications = db.query(Application).count()

    shortlisted = (
        db.query(Application)
        .filter(Application.status == "shortlisted")
        .count()
    )

    avg_ats_score = (
        db.query(func.avg(Application.ats_score))
        .filter(Application.ats_score.isnot(None))
        .scalar()
    )

    avg_ats_score = round(avg_ats_score or 0)

    pipeline_rows = (
        db.query(Application.status, func.count(Application.id))
        .group_by(Application.status)
        .all()
    )

    pipeline = {
        "applied": 0,
        "shortlisted": 0,
        "interview": 0,
        "rejected": 0,
    }

    for status, count in pipeline_rows:
        pipeline[status] = count

    recent_rows = (
        db.query(Application, Job, User)
        .join(Job, Application.job_id == Job.id)
        .join(User, Application.user_id == User.id)
        .order_by(Application.created_at.desc())
        .limit(5)
        .all()
    )

    recent_activity = []

    for app, job, user in recent_rows:
        recent_activity.append({
            "application_id": app.id,
            "candidate_name": f"{user.first_name} {user.last_name}",
            "job_title": job.title,
            "status": app.status,
            "ats_score": app.ats_score,
            "created_at": app.created_at,
            "message": build_activity_message(f"{user.first_name} {user.last_name}", job.title, app.status, app.ats_score)
        })

    high_fit_candidates = (
        db.query(Application)
        .filter(Application.ats_score >= 85)
        .count()
    )

    manual_review = (
        db.query(Application)
        .filter(Application.ats_score < 70)
        .count()
    )

    ai_insights = [
        {
            "title": "High-fit candidates",
            "value": high_fit_candidates,
            "description": "Candidates with ATS score 85% or above."
        },
        {
            "title": "Manual review needed",
            "value": manual_review,
            "description": "Candidates below 70% score need human review."
        },
        {
            "title": "Average ATS score",
            "value": avg_ats_score,
            "description": "Overall candidate-job match quality."
        }
    ]

    return {
        "stats": {
            "total_jobs": total_jobs,
            "total_applications": total_applications,
            "shortlisted": shortlisted,
            "avg_ats_score": avg_ats_score
        },
        "pipeline": pipeline,
        "recent_activity": recent_activity,
        "ai_insights": ai_insights
    }


def build_activity_message(name, job_title, status, score):
    if score and score >= 85:
        return f"{name} scored {score}% for {job_title}"

    if status == "shortlisted":
        return f"{name} was shortlisted for {job_title}"

    if status == "interview":
        return f"{name} moved to interview for {job_title}"

    if status == "rejected":
        return f"{name} was rejected for {job_title}"

    return f"{name} applied for {job_title}"