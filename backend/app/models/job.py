from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.db.session import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(Text)
    skills = Column(String)

    company = Column(String)
    location = Column(String)

    created_by = Column(Integer, ForeignKey("users.id"))