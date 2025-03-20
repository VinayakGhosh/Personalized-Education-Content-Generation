from fastapi import APIRouter, HTTPException
from core.database import users_collection
from models.user import UserSignup, UserLogin
from utils.auth_utils import hash_password, verify_password
from utils.jwt_utils import create_access_token

auth_router = APIRouter()

@auth_router.post("/signup")
def signup(user: UserSignup):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    users_collection.insert_one({"email": user.email, "password": hashed_password})

    return {"message": "User registered successfully"}

@auth_router.post("/login")
def login(user: UserLogin):
    existing_user = users_collection.find_one({"email": user.email})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
