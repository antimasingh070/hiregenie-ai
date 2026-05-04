from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
from uuid import uuid4
from app.services.resume_parser import extract_features_from_resume
from app.services.ml_service import predict_candidate
from app.db.session import SessionLocal
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.api.deps import require_role

router = APIRouter(prefix="/candidate", tags=["Candidate"])

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


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
    total_applications = db.query(Application).filter(
        Application.user_id == current_user.id
    ).count()

    interviews = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.status == "interview"
    ).count()

    shortlisted = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.status == "shortlisted"
    ).count()

    latest_score = (
        db.query(Application.ats_score)
        .filter(
            Application.user_id == current_user.id,
            Application.ats_score.isnot(None)
        )
        .order_by(Application.id.desc())
        .first()
    )

    return {
        "applications": total_applications,
        "interviews": interviews,
        "shortlisted": shortlisted,
        "ats_score": latest_score[0] if latest_score else 0,
        "resume_uploaded": bool(current_user.resume_url),
        "resume_filename": current_user.resume_filename,
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
            "already_applied": job.id in applied_job_ids,
            "resume_uploaded": bool(current_user.resume_url),
        }
        for job in jobs
    ]


@router.post("/jobs/{job_id}/apply")
def apply_job(job_id: int, db: Session = Depends(get_db), current_user=Depends(require_role("candidate"))):

    # 1️⃣ Load resume file
    with open(current_user.resume_url, "r", encoding="utf-8", errors="ignore") as f:
        resume_text = f.read()

    # 2️⃣ Extract features
    features = extract_features_from_resume(resume_text)

    # 3️⃣ Create application
    application = Application(
        user_id=current_user.id,
        job_id=job_id,
        experience_years=features["experience_years"],
        skills=features["skills"],
        status="applied"
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return {
        "message": "Applied successfully",
        "features_extracted": features
    }


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
            "status": app.status,
            "ats_score": app.ats_score,
            "resume_filename": app.resume_filename,
        }
        for app, job in data
    ]


@router.post("/profile/resume")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    allowed_types = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC, or DOCX files are allowed"
        )

    extension = file.filename.split(".")[-1]
    safe_filename = f"user_{current_user.id}_{uuid4()}.{extension}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.resume_url = file_path
    current_user.resume_filename = file.filename

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Resume uploaded successfully",
        "resume_url": file_path,
        "resume_filename": current_user.resume_filename,
    }