from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.models.job import Job
from app.models.interview import Interview, InterviewQuestion, InterviewAnswer
from app.schemas.interview import AnswerCreate
from app.api.deps import require_role
from app.services.llm_interview_service import LLMInterviewService
from app.services.interview_scoring import InterviewScoringService
from app.services.interview_llm_service import InterviewLLMService
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

    llm_service = InterviewLLMService()
    questions = llm_service.generate_questions(
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
    llm_service = LLMInterviewService()

    similarity_score = scoring_service.calculate_similarity_score(
        candidate_answer=answer.answer_text,
        ideal_answer=question.ideal_answer
    )

    llm_result = llm_service.evaluate_answer(
        question=question.question_text,
        ideal_answer=question.ideal_answer,
        candidate_answer=answer.answer_text
    )

    final_score = scoring_service.calculate_final_score(
        similarity_score=similarity_score,
        llm_score=float(llm_result.get("llm_score", 50))
    )
    llm_service = InterviewLLMService()

    llm_feedback = llm_service.evaluate_answer(
        question=question.question_text,
        ideal_answer=question.ideal_answer,
        candidate_answer=answer.answer_text,
        similarity_score=score
    )

    feedback = llm_feedback["feedback"]

    interview_answer = InterviewAnswer(
        interview_id=interview_id,
        question_id=answer.question_id,
        answer_text=answer.answer_text,
        score=score,
        feedback=feedback,
        correct_answer=llm_feedback["correct_answer"],
        topics_to_study=json.dumps(llm_feedback["topics_to_study"]),
        improvement_tips=json.dumps(llm_feedback["improvement_tips"])
    )

    db.add(interview_answer)
    db.commit()

    return {
        "message": "Answer submitted",
        "score": final_score,
        "similarity_score": similarity_score,
        "llm_score": llm_result.get("llm_score"),
        "feedback": llm_result.get("feedback"),
        "correct_answer": llm_result.get("correct_answer"),
        "improvement_tip": llm_result.get("improvement_tip"),
        "topics_to_study": llm_result.get("topics_to_study", [])
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
            "final_feedback": "No answers submitted yet.",
            "strengths": "",
            "weaknesses": "",
            "topics_to_study": [],
            "answers": []
        }

    scores = [answer.score for answer in answers]
    total_score = round(sum(scores) / len(scores), 2)

    questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.interview_id == interview_id
    ).all()

    question_map = {q.id: q for q in questions}

    answers_summary = ""
    answer_details = []

    for ans in answers:
        q = question_map.get(ans.question_id)

        answer_details.append({
            "question": q.question_text if q else "",
            "topic": q.topic if q else "General",
            "candidate_answer": ans.answer_text,
            "score": ans.score,
            "feedback": ans.feedback,
            "correct_answer": ans.correct_answer,
            "improvement_tip": ans.improvement_tip
        })

        answers_summary += f"""
Question: {q.question_text if q else ""}
Topic: {q.topic if q else "General"}
Candidate Answer: {ans.answer_text}
Score: {ans.score}
Feedback: {ans.feedback}
Correct Answer: {ans.correct_answer}
Improvement Tip: {ans.improvement_tip}
"""

    llm_service = LLMInterviewService()
    final_ai_report = llm_service.generate_final_report(answers_summary)

    interview.total_score = total_score
    interview.final_feedback = final_ai_report.get("final_feedback")
    interview.strengths = final_ai_report.get("strengths")
    interview.weaknesses = final_ai_report.get("weaknesses")
    interview.topics_to_study = ", ".join(final_ai_report.get("topics_to_study", []))
    interview.status = "completed"

    db.commit()

    return {
        "interview_id": interview_id,
        "total_score": total_score,
        "final_feedback": interview.final_feedback,
        "strengths": interview.strengths,
        "weaknesses": interview.weaknesses,
        "topics_to_study": final_ai_report.get("topics_to_study", []),
        "answers": answer_details
    }

@router.get("/portfolio/me")
def my_interview_portfolio(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    interviews = db.query(Interview).filter(
        Interview.candidate_id == current_user.id
    ).order_by(Interview.id.desc()).all()

    result = []

    for interview in interviews:
        result.append({
            "interview_id": interview.id,
            "job_id": interview.job_id,
            "status": interview.status,
            "total_score": interview.total_score,
            "final_feedback": interview.final_feedback,
            "strengths": interview.strengths,
            "weaknesses": interview.weaknesses,
            "topics_to_study": interview.topics_to_study.split(", ") if interview.topics_to_study else []
        })

    return result