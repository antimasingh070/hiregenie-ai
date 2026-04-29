from fastapi import FastAPI
from backend.app.db.session import Base, engine
from backend.app.models.user import User
from backend.app.api.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireGenie AI")

app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "HireGenie AI Running"}