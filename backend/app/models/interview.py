from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float
from app.db.session import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))

    status = Column(String, default="in_progress")
    total_score = Column(Float, default=0.0)
    final_feedback = Column(Text, nullable=True)


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))

    question_text = Column(Text, nullable=False)
    ideal_answer = Column(Text, nullable=True)
    order_no = Column(Integer)


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    question_id = Column(Integer, ForeignKey("interview_questions.id"))

    answer_text = Column(Text, nullable=False)
    score = Column(Float, default=0.0)
    feedback = Column(Text, nullable=True)