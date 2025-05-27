from fastapi import APIRouter, HTTPException
from core.database import users_collection
from models.user import UserSignup, UserLogin
from utils.auth_utils import hash_password, verify_password
from utils.jwt_utils import create_access_token

auth_router = APIRouter()

@auth_router.post("/signup")
def user_signup(user: UserSignup):
    """API to register a new user."""
    # Check if the user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered.")

    hashed_password = hash_password(user.password)
    user_entry = {
        "email": user.email,
        "password": hashed_password,
        "full_name": user.full_name,
        "profile_complete": False,  # New users start with incomplete profile
    }
    users_collection.insert_one(user_entry)
    return {"message": "User registered successfully!",
    "email": user.email,
    "full_name": user.full_name,
    }

@auth_router.post("/login")
def user_login(user_data: UserLogin):
    user = users_collection.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    token = create_access_token({"email": user["email"]})  # Generate JWT token
    return {
        "message": "Login successful!",
        "token": token,
        "user_id": str(user["_id"]),  # Send user_id in the response
        "profile_complete": user.get("profile_complete", False),  # Return profile status
        "name": user.get("full_name", ""),
    }
    