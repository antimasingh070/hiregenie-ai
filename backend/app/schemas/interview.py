from pydantic import BaseModel


class AnswerCreate(BaseModel):
    question_id: int
    answer_text: str


class InterviewReportResponse(BaseModel):
    interview_id: int
    total_score: float
    final_feedback: str