from fastapi import FastAPI
from backend.app.db.session import Base, engine
from backend.app.models.user import User

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireGenie AI")

@app.get("/")
def home():
    return {"message": "HireGenie AI Backend Running"}