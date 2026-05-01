class InterviewQuestionService:
    def generate_questions(self, job_title: str, skills: str):
        return [
            {
                "question_text": f"Explain your experience with {skills}.",
                "ideal_answer": f"The candidate should explain practical experience, projects, challenges, and tools used in {skills}."
            },
            {
                "question_text": "Explain the difference between REST API and GraphQL.",
                "ideal_answer": "REST exposes multiple endpoints and returns fixed responses, while GraphQL uses a single endpoint where clients request exact data."
            },
            {
                "question_text": "How do you design a scalable backend system?",
                "ideal_answer": "A scalable backend uses load balancing, caching, database indexing, queues, horizontal scaling, monitoring, and fault tolerance."
            },
            {
                "question_text": "What is authentication and authorization?",
                "ideal_answer": "Authentication verifies user identity, while authorization checks what resources or actions the user is allowed to access."
            },
            {
                "question_text": "Tell me about a challenging project you worked on.",
                "ideal_answer": "The candidate should describe problem, role, technical approach, tradeoffs, result, and learning."
            }
        ]