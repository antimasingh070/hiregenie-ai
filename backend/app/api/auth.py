from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.db.session import SessionLocal
from app.schemas.user import *
from app.services.auth_service import *
from app.core.security import *
from app.core.rate_limiter import rate_limit
from app.core.mail import send_reset_email

router = APIRouter(prefix="/auth", tags=["Auth"])

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= SIGNUP =================
@router.post("/signup", response_model=MessageResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    register_user(db, user)
    return {"message": "Signup successful"}

# ================= LOGIN =================
@router.post("/login", response_model=TokenResponse)
def login(request: Request, user: UserLogin, db: Session = Depends(get_db)):
    rate_limit(request)

    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access, refresh = generate_tokens(db_user)

    db_user.refresh_token = hash_token(refresh)
    db.commit()

    return {
        "access_token": access,
        "refresh_token": refresh
    }

# ================= REFRESH =================
@router.post("/refresh", response_model=TokenResponse)
def refresh(refresh_token: str, db: Session = Depends(get_db)):
    hashed = hash_token(refresh_token)

    user = db.query(User).filter(User.refresh_token == hashed).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    access, new_refresh = generate_tokens(user)

    user.refresh_token = hash_token(new_refresh)
    db.commit()

    return {
        "access_token": access,
        "refresh_token": new_refresh
    }

# ================= FORGOT PASSWORD =================
@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(data: ForgotPassword, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        return {"message": "If email exists, reset link sent"}

    raw, hashed = generate_secure_token()

    user.reset_token = hashed
    user.reset_token_expires = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    background_tasks.add_task(send_reset_email, user.email, raw)

    return {"message": "Reset email sent"}

# ================= RESET PASSWORD =================
@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    hashed = hash_token(data.token)

    user = db.query(User).filter(
        User.reset_token == hashed,
        User.reset_token_expires > datetime.utcnow()
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user.hashed_password = hash_password(data.new_password)
    user.reset_token = None
    user.reset_token_expires = None

    db.commit()

    return {"message": "Password updated"}