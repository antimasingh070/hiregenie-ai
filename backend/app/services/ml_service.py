import joblib
import pandas as pd

model = joblib.load("candidate_selection_model.pkl")


def predict_candidate(application):
    df = pd.DataFrame([{
        "experience": application.experience_years,
        "interview_score": application.interview_score,
        "communication_score": application.communication_score,
        "technical_score": application.technical_score
    }])

    pred = model.predict(df)[0]
    prob = model.predict_proba(df)[0].max()

    return {
        "selected": int(pred),
        "confidence": float(prob)
    }