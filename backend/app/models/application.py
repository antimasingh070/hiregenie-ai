from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Float, JSON
from sqlalchemy.sql import func
from app.db.session import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))

    status = Column(String, default="applied")

    ats_score = Column(Integer, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_recommendation = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    experience_years = Column(Float)
    skills = Column(JSON)
    interview_score = Column(Float)
    communication_score = Column(Float)
    technical_score = Column(Float)