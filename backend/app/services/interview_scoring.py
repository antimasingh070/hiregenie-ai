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

        return float(np.round(similarity * 100, 2))

    def calculate_final_score(self, similarity_score: float, llm_score: float) -> float:
        final_score = (0.4 * similarity_score) + (0.6 * llm_score)
        return float(np.round(final_score, 2))