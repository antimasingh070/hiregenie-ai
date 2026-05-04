def calculate_scores(answers: list):
    total = 0

    for ans in answers:
        total += ans.score  # assume each answer has score

    avg_score = total / len(answers) if answers else 0

    return {
        "interview_score": avg_score,
        "technical_score": avg_score * 0.7,
        "communication_score": avg_score * 0.3
    }