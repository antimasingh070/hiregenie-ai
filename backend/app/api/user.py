from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter(prefix="/user", tags=["User"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ProfileUpdate(BaseModel):
    first_name: str
    last_name: str
    phone: str | None = None


@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "name": f"{current_user.first_name} {current_user.last_name}",
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "is_active": current_user.is_active,
    }


@router.put("/me")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()

    user.first_name = data.first_name
    user.last_name = data.last_name
    user.phone = data.phone

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
        },
    }