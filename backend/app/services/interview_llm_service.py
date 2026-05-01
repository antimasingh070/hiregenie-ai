import json
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate


class InterviewLLMService:
    def __init__(self):
        self.llm = ChatOllama(
            model="llama3.2:1b",
            temperature=0.3
        )

    def generate_questions(self, job_title: str, skills: str):
        prompt = ChatPromptTemplate.from_template("""
        You are an AI technical interviewer.

        Generate 5 interview questions for this job.

        Job Title: {job_title}
        Skills: {skills}

        Return ONLY valid JSON array.
        Format:
        [
          {{
            "question_text": "...",
            "ideal_answer": "..."
          }}
        ]
        """)

        response = (prompt | self.llm).invoke({
            "job_title": job_title,
            "skills": skills
        })

        try:
            return json.loads(response.content)
        except Exception:
            return [
                {
                    "question_text": f"Explain your experience with {skills}.",
                    "ideal_answer": f"Candidate should explain practical experience, projects, tools, and challenges using {skills}."
                }
            ]

    def evaluate_answer(self, question: str, ideal_answer: str, candidate_answer: str, similarity_score: float):
        prompt = ChatPromptTemplate.from_template("""
        You are an AI interview evaluator and mentor.

        Question:
        {question}

        Ideal Answer:
        {ideal_answer}

        Candidate Answer:
        {candidate_answer}

        Similarity Score:
        {similarity_score}

        Return ONLY valid JSON:
        {{
          "feedback": "...",
          "correct_answer": "...",
          "topics_to_study": ["...", "..."],
          "improvement_tips": ["...", "..."]
        }}
        """)

        response = (prompt | self.llm).invoke({
            "question": question,
            "ideal_answer": ideal_answer,
            "candidate_answer": candidate_answer,
            "similarity_score": similarity_score
        })

        try:
            return json.loads(response.content)
        except Exception:
            return {
                "feedback": "Answer needs more clarity and technical depth.",
                "correct_answer": ideal_answer,
                "topics_to_study": ["Core concept revision", "Real-world examples"],
                "improvement_tips": ["Explain with examples", "Cover key technical points"]
            }