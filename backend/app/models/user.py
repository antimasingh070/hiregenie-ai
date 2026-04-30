from sqlalchemy import Column, String, Integer, DateTime, Boolean
from app.db.session import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, nullable=True)

    hashed_password = Column(String, nullable=False)

    role = Column(String, default="user")

    refresh_token = Column(String, nullable=True)

    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)