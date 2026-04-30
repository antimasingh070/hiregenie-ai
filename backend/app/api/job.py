from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.job import Job
from app.schemas.job import JobCreate
from app.api.deps import require_role

router = APIRouter(prefix="/jobs", tags=["Jobs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("recruiter"))
):
    new_job = Job(
        **job.dict(),
        created_by=current_user.id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return {"message": "Job created", "job_id": new_job.id}


@router.get("/")
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()