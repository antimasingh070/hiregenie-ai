from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
import json
from app.db.session import SessionLocal
from app.models.user import User
from app.models.job import Job
from app.models.interview import Interview, InterviewQuestion, InterviewAnswer
from app.schemas.interview import AnswerCreate
from app.api.deps import require_role
from app.services.llm_interview_service import LLMInterviewService
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

    llm_service = LLMInterviewService()
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

    if isinstance(llm_result, list):
        llm_result = llm_result[0] if llm_result else {}
    llm_score = float(llm_result.get("llm_score", 50))

    final_score = scoring_service.calculate_final_score(
        similarity_score=similarity_score,
        llm_score=llm_score
    )

    interview_answer = InterviewAnswer(
        interview_id=interview_id,
        question_id=answer.question_id,
        answer_text=answer.answer_text,
        score=final_score,
        feedback=llm_result.get("feedback"),
        correct_answer=llm_result.get("correct_answer"),
        topics_to_study=json.dumps(llm_result.get("topics_to_study", [])),
        improvement_tips=json.dumps(llm_result.get("improvement_tips", []))
    )

    db.add(interview_answer)
    db.commit()
    db.refresh(interview_answer)

    return {
        "message": "Answer submitted",
        "score": final_score,
        "similarity_score": similarity_score,
        "llm_score": llm_score,
        "feedback": llm_result.get("feedback"),
        "correct_answer": llm_result.get("correct_answer"),
        "improvement_tips": llm_result.get("improvement_tips"),
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

    questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.interview_id == interview_id
    ).all()

    question_map = {q.id: q for q in questions}

    if not answers:
        return {
            "interview_id": interview.id,
            "job_id": interview.job_id,
            "status": interview.status,
            "total_score": 0,
            "final_feedback": "No answers submitted yet.",
            "strengths": "",
            "weaknesses": "",
            "topics_to_study": [],
            "answers": []
        }

    total_score = round(sum(float(a.score or 0) for a in answers) / len(answers), 2)

    answer_details = []
    answers_summary = ""

    for ans in answers:
        q = question_map.get(ans.question_id)

        try:
            topics = json.loads(ans.topics_to_study or "[]")
        except:
            topics = []

        try:
            tips = json.loads(ans.improvement_tips or "[]")
        except:
            tips = ans.improvement_tips if isinstance(ans.improvement_tips, list) else []

        answer_details.append({
            "question_id": ans.question_id,
            "question": q.question_text if q else "",
            "candidate_answer": ans.answer_text,
            "ideal_answer": q.ideal_answer if q else "",
            "score": ans.score or 0,
            "feedback": ans.feedback or "",
            "correct_answer": ans.correct_answer or "",
            "topics_to_study": topics,
            "improvement_tips": tips,
            "score_explanation": {
                "similarity_weight": "40%",
                "ai_evaluation_weight": "60%",
                "note": "Final score is based on answer similarity with ideal answer and AI evaluation."
            }
        })

        answers_summary += f"""
Question: {q.question_text if q else ""}
Candidate Answer: {ans.answer_text}
Score: {ans.score}
Feedback: {ans.feedback}
Correct Answer: {ans.correct_answer}
Topics: {topics}
Tips: {tips}
"""

    llm_service = LLMInterviewService()
    final_ai_report = llm_service.generate_final_report(answers_summary)

    if isinstance(final_ai_report, list):
        final_ai_report = final_ai_report[0] if final_ai_report else {}

    if isinstance(final_ai_report, str):
        try:
            final_ai_report = json.loads(final_ai_report)
        except:
            final_ai_report = {}

    if not isinstance(final_ai_report, dict):
        final_ai_report = {}

    interview.total_score = total_score
    interview.final_feedback = final_ai_report.get("final_feedback", "")
    interview.strengths = final_ai_report.get("strengths", "")
    interview.weaknesses = final_ai_report.get("weaknesses", "")
    interview.topics_to_study = ", ".join(final_ai_report.get("topics_to_study", []))
    interview.status = "completed"

    db.commit()
    db.refresh(interview)

    return {
        "interview_id": interview.id,
        "job_id": interview.job_id,
        "status": interview.status,
        "total_score": interview.total_score,
        "final_feedback": interview.final_feedback,
        "strengths": interview.strengths,
        "weaknesses": interview.weaknesses,
        "topics_to_study": final_ai_report.get("topics_to_study", []),
        "answers": answer_details,
        "score_formula": {
            "similarity_score": "40%",
            "llm_score": "60%",
            "final_score": "0.4 * similarity_score + 0.6 * llm_score"
        }
    }

def safe_topics(value):
    if not value:
        return []

    if isinstance(value, list):
        result = []
        for item in value:
            if isinstance(item, str):
                result.append(item)
            elif isinstance(item, dict):
                result.append(item.get("topic") or item.get("name") or str(item))
            else:
                result.append(str(item))
        return result

    if isinstance(value, str):
        return [v.strip() for v in value.split(",") if v.strip()]

    return []
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

@router.get("/my-reports")
def get_my_interview_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    interviews = db.query(Interview).filter(
        Interview.candidate_id == current_user.id
    ).order_by(Interview.id.desc()).all()

    result = []

    for interview in interviews:
        total_questions = db.query(InterviewQuestion).filter(
            InterviewQuestion.interview_id == interview.id
        ).count()

        total_answers = db.query(InterviewAnswer).filter(
            InterviewAnswer.interview_id == interview.id
        ).count()

        result.append({
            "interview_id": interview.id,
            "job_id": interview.job_id,
            "status": interview.status,
            "total_score": interview.total_score or 0,
            "final_feedback": interview.final_feedback or "Report not generated yet.",
            "total_questions": total_questions,
            "answered_questions": total_answers
        })

    return result

@router.get("/{interview_id}/details")
def get_interview_details(
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

    result = []

    for answer in answers:
        question = db.query(InterviewQuestion).filter(
            InterviewQuestion.id == answer.question_id
        ).first()

        result.append({
            "question": question.question_text if question else "",
            "candidate_answer": answer.answer_text,
            "score": answer.score,
            "feedback": answer.feedback,
            "correct_answer": answer.correct_answer,
            "topics_to_study": json.loads(answer.topics_to_study or "[]"),
            "improvement_tips": json.loads(answer.improvement_tips or "[]")
        })

    return {
        "interview_id": interview.id,
        "job_id": interview.job_id,
        "status": interview.status,
        "total_score": interview.total_score,
        "final_feedback": interview.final_feedback,
        "answers": result
    }

@router.get("/my-analytics")
def get_my_interview_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("candidate"))
):
    interviews = db.query(Interview).filter(
        Interview.candidate_id == current_user.id
    ).all()

    rows = []

    for interview in interviews:
        answers = db.query(InterviewAnswer).filter(
            InterviewAnswer.interview_id == interview.id
        ).all()

        for answer in answers:
            topics = json.loads(answer.topics_to_study or "[]")

            rows.append({
                "interview_id": interview.id,
                "score": answer.score or 0,
                "topics": topics,
                "feedback": answer.feedback
            })

    if not rows:
        return {
            "total_interviews": 0,
            "average_score": 0,
            "best_score": 0,
            "weak_topics": [],
            "strong_topics": [],
            "readiness": 0,
            "message": "No analytics available yet."
        }

    df = pd.DataFrame(rows)

    average_score = float(np.round(df["score"].mean(), 2))
    best_score = float(np.round(df["score"].max(), 2))
    readiness = float(np.round(min(average_score + 10, 100), 2))

    all_topics = []
    for topic_list in df["topics"]:
        all_topics.extend(topic_list)

    weak_topics = list(set(all_topics))[:5]

    strong_topics = []
    if average_score >= 70:
        strong_topics = ["Communication", "Technical Explanation", "Problem Solving"]

    return {
        "total_interviews": len(set(df["interview_id"])),
        "average_score": average_score,
        "best_score": best_score,
        "weak_topics": weak_topics,
        "strong_topics": strong_topics,
        "readiness": readiness,
        "message": "Analytics generated successfully using Pandas and NumPy."
    }