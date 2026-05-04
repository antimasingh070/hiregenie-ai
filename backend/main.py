from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

# 🔥 DB
from app.db.session import Base, engine

# 🔥 IMPORT ALL MODELS BEFORE create_all
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.interview import Interview, InterviewQuestion, InterviewAnswer

# 🔥 Routers
from app.api.auth import router as auth_router
from app.api.job import router as job_router
from app.api.admin import router as admin_router
from app.api.application import router as app_router
from app.api.user import router as user_router
from app.api.candidate import router as candidate_router
from app.api.interview import router as interview_router
from app.api.recruiter.dashboard import router as dashboard_router
from app.api.recruiter.reports import router as reports_router


# 🚀 Create tables AFTER models import
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireGenie AI")


@app.middleware("http")
async def log_request_time(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    process_time = time.time() - start_time

    print(f"[PERF] {request.method} {request.url.path} took {process_time:.3f} sec")

    return response


# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🔥 Routers
app.include_router(auth_router)
app.include_router(job_router)
app.include_router(admin_router)
app.include_router(app_router)
app.include_router(user_router)
app.include_router(candidate_router)
app.include_router(interview_router)
app.include_router(dashboard_router)
app.include_router(reports_router)


@app.get("/")
def home():
    return {"message": "HireGenie AI Running 🚀"}