from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.models.job import Job
from app.models.interview import Interview, InterviewQuestion, InterviewAnswer
from app.schemas.interview import AnswerCreate
from app.api.deps import require_role
from app.services.interview_question_service import InterviewQuestionService
from app.services.interview_scoring import InterviewScoringService

router = APIRouter(prefix="/interviews", tags=["AI Interviews"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/start/{job_id}")
def start_interview(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    interview = Interview(
        candidate_id=current_user.id,
        job_id=job_id,
        status="in_progress"
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    question_service = InterviewQuestionService()
    questions = question_service.generate_questions(
        job_title=job.title,
        skills=job.skills
    )

    for index, q in enumerate(questions, start=1):
        interview_question = InterviewQuestion(
            interview_id=interview.id,
            question_text=q["question_text"],
            ideal_answer=q["ideal_answer"],
            order_no=index
        )
        db.add(interview_question)

    db.commit()

    return {
        "message": "Interview started",
        "interview_id": interview.id
    }


@router.get("/{interview_id}/questions")
def get_questions(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.candidate_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.interview_id == interview_id
    ).order_by(InterviewQuestion.order_no).all()

    return questions


@router.post("/{interview_id}/answer")
def submit_answer(
    interview_id: int,
    answer: AnswerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.candidate_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    question = db.query(InterviewQuestion).filter(
        InterviewQuestion.id == answer.question_id,
        InterviewQuestion.interview_id == interview_id
    ).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    scoring_service = InterviewScoringService()

    score = scoring_service.calculate_similarity_score(
        candidate_answer=answer.answer_text,
        ideal_answer=question.ideal_answer
    )

    feedback = scoring_service.generate_feedback(score)

    interview_answer = InterviewAnswer(
        interview_id=interview_id,
        question_id=answer.question_id,
        answer_text=answer.answer_text,
        score=score,
        feedback=feedback
    )

    db.add(interview_answer)
    db.commit()

    return {
        "message": "Answer submitted",
        "score": score,
        "feedback": feedback
    }


@router.get("/{interview_id}/report")
def get_interview_report(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id,
        Interview.candidate_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    answers = db.query(InterviewAnswer).filter(
        InterviewAnswer.interview_id == interview_id
    ).all()

    if not answers:
        return {
            "interview_id": interview_id,
            "total_score": 0,
            "final_feedback": "No answers submitted yet."
        }

    scores = [answer.score for answer in answers]
    total_score = round(sum(scores) / len(scores), 2)

    if total_score >= 80:
        final_feedback = "Excellent interview performance."
    elif total_score >= 60:
        final_feedback = "Good performance. Needs improvement in depth."
    elif total_score >= 40:
        final_feedback = "Average performance. More preparation required."
    else:
        final_feedback = "Weak performance. Candidate should revise fundamentals."

    interview.total_score = total_score
    interview.final_feedback = final_feedback
    interview.status = "completed"

    db.commit()

    return {
        "interview_id": interview_id,
        "total_score": total_score,
        "final_feedback": final_feedback
    }