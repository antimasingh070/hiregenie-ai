from fastapi import FastAPI
from app.db.session import Base, engine
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.models.job import Job
Base.metadata.create_all(bind=engine)
from app.api.job import router as job_router


app = FastAPI(title="HireGenie AI")

# Routers
app.include_router(auth_router)
app.include_router(job_router)
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "HireGenie AI Running 🚀"}
