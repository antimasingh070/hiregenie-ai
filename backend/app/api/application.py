from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.application import Application
from app.api.deps import require_role

router = APIRouter(prefix="/applications", tags=["Applications"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔥 CANDIDATE ONLY
@router.post("/{job_id}")
def apply_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("candidate"))
):
    application = Application(
        user_id=current_user.id,
        job_id=job_id,
        status="applied"
    )

    db.add(application)
    db.commit()

    return {"message": "Applied successfully"}


# 🔥 RECRUITER ONLY
@router.get("/")
def get_applications(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter"))
):
    return db.query(Application).all()