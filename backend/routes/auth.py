from fastapi import APIRouter

auth_router = APIRouter()

@auth_router.get("/signup")
def signup():
    return {"message": "Signup Route"}
