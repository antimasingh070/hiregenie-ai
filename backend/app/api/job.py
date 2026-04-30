from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.job import Job
from app.schemas.job import JobCreate

router = APIRouter(prefix="/jobs", tags=["Jobs"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = Job(**job.dict(), created_by=1)  # temp user

    db.add(new_job)
    db.commit()

    return {"message": "Job created"}

@router.get("/")
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()