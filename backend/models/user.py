from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict

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
    highest_education: str  # e.g., "School", "College"
    available_time: str
    # stream: Optional[str] = None  # e.g., "Science", "Commerce", "Arts"
    subjects: List[str]  # e.g., ["Maths", "Physics"]
    study_level: str
    study_goal: str
    preferred_tone: str
    content_preferences: List[str] = []  # e.g., ["Tests", "Quizzes"]
    language_complexity: str
    progress: Optional[Dict[str, int]] = {}  # {"Maths": 60, "Physics": 80}

class ProgressUpdate(BaseModel):
    subject: str
    progress: int
