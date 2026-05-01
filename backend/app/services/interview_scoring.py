import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class InterviewScoringService:
    def calculate_similarity_score(self, candidate_answer: str, ideal_answer: str) -> float:
        if not candidate_answer or not ideal_answer:
            return 0.0

        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([candidate_answer, ideal_answer])

        similarity = cosine_similarity(vectors[0], vectors[1])[0][0]

        score = np.round(similarity * 100, 2)
        return float(score)

    def generate_feedback(self, score: float) -> str:
        if score >= 80:
            return "Strong answer. Good technical depth and relevance."
        elif score >= 60:
            return "Decent answer. Some important points are covered, but depth can improve."
        elif score >= 40:
            return "Average answer. Candidate needs better explanation and examples."
        else:
            return "Weak answer. Answer is not closely matching expected concepts."