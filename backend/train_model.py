import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


data = [
    [1, 30, 40, 45, 50, 0],
    [2, 45, 50, 55, 60, 0],
    [3, 65, 70, 70, 72, 1],
    [4, 80, 78, 82, 85, 1],
    [5, 90, 88, 90, 92, 1],
    [1, 25, 30, 35, 40, 0],
    [2, 55, 58, 60, 62, 0],
    [3, 70, 72, 75, 78, 1],
    [4, 85, 80, 84, 86, 1],
    [0, 20, 25, 30, 35, 0],
]

columns = [
    "experience_years",
    "skills_match_score",
    "interview_score",
    "technical_score",
    "communication_score",
    "selected",
]

df = pd.DataFrame(data, columns=columns)

X = df.drop("selected", axis=1)
y = df["selected"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

joblib.dump(model, "candidate_selection_model.pkl")

print("candidate_selection_model.pkl created successfully")