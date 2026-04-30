from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔥 DB
from app.db.session import Base, engine

# 🔥 IMPORT ALL MODELS BEFORE create_all
from app.models.user import User
from app.models.job import Job
from app.models.application import Application

# 🔥 Routers
from app.api.auth import router as auth_router
from app.api.job import router as job_router
from app.api.admin import router as admin_router
from app.api.application import router as app_router

# 🚀 Create tables AFTER models import
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HireGenie AI")

# 🔥 Routers
app.include_router(auth_router)
app.include_router(job_router)
app.include_router(admin_router)
app.include_router(app_router)

# 🔥 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "HireGenie AI Running 🚀"}