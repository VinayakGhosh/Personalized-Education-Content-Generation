from fastapi import APIRouter, HTTPException, Header
from core.database import users_collection
from utils.jwt_utils import verify_token

user_router = APIRouter()

@user_router.get("/user/me")
def get_user_data(authorization: str = Header(...)):
    """Returns user data for the currently logged-in user."""
    token = authorization.split(" ")[1] if " " in authorization else authorization
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = users_collection.find_one({"email": payload["email"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
