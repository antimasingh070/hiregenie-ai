import json
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate


class LLMInterviewService:
    def __init__(self):
        self.llm = ChatOllama(
            model="llama3.2:3b",
            temperature=0.2
        )

    def generate_questions(self, job_title: str, skills: str):
        prompt = ChatPromptTemplate.from_messages([
            ("system", """
You are a senior technical interviewer.

Generate exactly 5 interview questions for the given job.
Return ONLY valid JSON.
No markdown.
No explanation.

JSON format:
[
  {
    "question_text": "...",
    "ideal_answer": "...",
    "topic": "..."
  }
]
"""),
            ("human", """
Job title: {job_title}
Required skills: {skills}
Generate beginner-to-intermediate interview questions.
""")
        ])

        chain = prompt | self.llm
        response = chain.invoke({
            "job_title": job_title,
            "skills": skills
        })

        try:
            return json.loads(response.content)
        except Exception:
            return self._fallback_questions(skills)

    def evaluate_answer(self, question: str, ideal_answer: str, candidate_answer: str):
        prompt = ChatPromptTemplate.from_messages([
            ("system", """
You are an interview evaluator and mentor.

Evaluate the candidate answer.
Return ONLY valid JSON.
No markdown.
No extra text.

JSON format:
{
  "llm_score": 0,
  "feedback": "...",
  "correct_answer": "...",
  "improvement_tip": "...",
  "topics_to_study": ["...", "..."]
}

Scoring:
0-40 weak
41-60 average
61-80 good
81-100 excellent
"""),
            ("human", """
Question: {question}

Ideal Answer: {ideal_answer}

Candidate Answer: {candidate_answer}

Evaluate honestly but helpfully.
If the answer is weak or wrong, explain the correct answer clearly.
Suggest study topics.
""")
        ])

        chain = prompt | self.llm
        response = chain.invoke({
            "question": question,
            "ideal_answer": ideal_answer,
            "candidate_answer": candidate_answer
        })

        try:
            return json.loads(response.content)
        except Exception:
            return {
                "llm_score": 50,
                "feedback": "Answer submitted. AI feedback could not be generated.",
                "correct_answer": ideal_answer,
                "improvement_tip": "Revise the core concept and practice explaining with examples.",
                "topics_to_study": ["Core fundamentals"]
            }

    def generate_final_report(self, answers_summary: str):
        prompt = ChatPromptTemplate.from_messages([
            ("system", """
You are a career mentor.

Create a final interview performance report.
Return ONLY valid JSON.
No markdown.

JSON format:
{
  "final_feedback": "...",
  "strengths": "...",
  "weaknesses": "...",
  "topics_to_study": ["...", "...", "..."]
}
"""),
            ("human", """
Candidate interview answers and scores:

{answers_summary}

Generate learning-focused final report.
""")
        ])

        chain = prompt | self.llm
        response = chain.invoke({"answers_summary": answers_summary})

        try:
            return json.loads(response.content)
        except Exception:
            return {
                "final_feedback": "Interview completed. Keep practicing fundamentals and structured explanations.",
                "strengths": "Candidate attempted the questions.",
                "weaknesses": "Needs more depth and clearer examples.",
                "topics_to_study": ["Python basics", "Backend fundamentals", "System design basics"]
            }

    def _fallback_questions(self, skills: str):
        return [
            {
                "question_text": f"Explain your hands-on experience with {skills}.",
                "ideal_answer": f"Candidate should explain projects, tools, challenges, and practical usage of {skills}.",
                "topic": "Project Experience"
            },
            {
                "question_text": "What is authentication and authorization?",
                "ideal_answer": "Authentication verifies identity. Authorization checks allowed actions and permissions.",
                "topic": "Security"
            },
            {
                "question_text": "Explain REST API in simple terms.",
                "ideal_answer": "REST API allows clients and servers to communicate using HTTP methods like GET, POST, PUT, DELETE.",
                "topic": "Backend"
            },
            {
                "question_text": "How do you improve database performance?",
                "ideal_answer": "Use indexes, query optimization, pagination, caching, normalization/denormalization where needed.",
                "topic": "Database"
            },
            {
                "question_text": "How would you debug a production issue?",
                "ideal_answer": "Check logs, metrics, traces, reproduce issue, identify root cause, fix, test, and monitor.",
                "topic": "Debugging"
            }
        ]