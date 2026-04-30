from pydantic import BaseModel

class JobCreate(BaseModel):
    title: str
    description: str
    skills: str
    company: str
    location: str