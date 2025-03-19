from fastapi import APIRouter

auth_router = APIRouter()

@auth_router.get("/test")
def test_auth():
    return {"message": "Auth route is working"}
