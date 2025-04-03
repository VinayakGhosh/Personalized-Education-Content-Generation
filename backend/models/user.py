from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Profile(BaseModel):
    user_id: str  # Store the user ID from the `users` collection
    age: int
    study_level: str  # e.g., "School", "College"
    stream: Optional[str] = None  # e.g., "Science", "Commerce", "Arts"
    subjects: List[str]  # e.g., ["Maths", "Physics"]