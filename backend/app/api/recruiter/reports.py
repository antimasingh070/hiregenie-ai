from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.db.session import SessionLocal
from app.api.deps import require_role
from app.models.job import Job
from app.models.application import Application

router = APIRouter(prefix="/reports", tags=["Reports"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter"))
):
    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()

    shortlisted = db.query(Application).filter(
        Application.status == "shortlisted"
    ).count()

    interviewed = db.query(Application).filter(
        Application.status == "interview"
    ).count()

    rejected = db.query(Application).filter(
        Application.status == "rejected"
    ).count()

    avg_score = db.query(func.avg(Application.ats_score)).filter(
        Application.ats_score.isnot(None)
    ).scalar()

    avg_score = round(avg_score or 0)

    shortlist_rate = round((shortlisted / total_applications) * 100) if total_applications else 0
    rejection_rate = round((rejected / total_applications) * 100) if total_applications else 0
    interview_rate = round((interviewed / total_applications) * 100) if total_applications else 0

    job_rows = (
        db.query(
            Job.id,
            Job.title,
            Job.company,
            func.count(Application.id).label("applications"),
            func.avg(Application.ats_score).label("avg_score"),
            func.sum(
                case((Application.status == "shortlisted", 1), else_=0)
            ).label("shortlisted")
        )
        .outerjoin(Application, Application.job_id == Job.id)
        .group_by(Job.id, Job.title, Job.company)
        .all()
    )

    job_performance = []

    for row in job_rows:
        job_performance.append({
            "job_id": row.id,
            "title": row.title,
            "company": row.company,
            "applications": row.applications or 0,
            "avg_score": round(row.avg_score or 0),
            "shortlisted": row.shortlisted or 0
        })

    score_distribution = {
        "excellent": db.query(Application).filter(Application.ats_score >= 85).count(),
        "good": db.query(Application).filter(Application.ats_score >= 70, Application.ats_score < 85).count(),
        "partial": db.query(Application).filter(Application.ats_score >= 50, Application.ats_score < 70).count(),
        "low": db.query(Application).filter(Application.ats_score < 50).count(),
        "pending": db.query(Application).filter(Application.ats_score.is_(None)).count(),
    }

    return {
        "summary": {
            "total_jobs": total_jobs,
            "total_applications": total_applications,
            "avg_score": avg_score,
            "shortlist_rate": shortlist_rate,
            "interview_rate": interview_rate,
            "rejection_rate": rejection_rate
        },
        "score_distribution": score_distribution,
        "job_performance": job_performance,
        "recommendations": [
            "Jobs with low average ATS score may need clearer required skills.",
            "High pending screening means AI processing queue needs attention.",
            "High rejection rate may indicate poor job-candidate matching."
        ]
    }