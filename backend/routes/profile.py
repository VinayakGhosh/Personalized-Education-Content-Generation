from fastapi import APIRouter, HTTPException, Depends, Body
from models.user import Profile, ProgressUpdate
from core.database import profiles_collection, users_collection
from bson import ObjectId
from utils.jwt_utils import get_current_user

profile_router = APIRouter()


@profile_router.post("/profile/setup")
async def setup_profile(profile: Profile):
    """Initial profile setup after signup."""
    existing_profile = profiles_collection.find_one({"user_id": profile.user_id})
    
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists.")

    new_profile = profiles_collection.insert_one(profile.dict())
    
    if not new_profile.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create profile.")

    # ✅ Update profile_complete in users_collection
    users_collection.update_one(
        {"_id": ObjectId(profile.user_id)},
        {"$set": {"profile_complete": True}}
    )

    return {"message": "Profile setup successful!"}


@profile_router.get("/profile/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Fetch full user profile (after login)."""
    user_id = str(current_user["_id"])
    profile = profiles_collection.find_one({"user_id": user_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    return {
        "email": current_user["email"],
        "name": current_user.get("name", ""),
        "isProfileComplete": current_user.get("profile_complete", False),
        "age": profile.get("age", ""),
        "study_level": profile.get("study_level", ""),
        "stream": profile.get("stream", ""),
        "subjects": profile.get("subjects", []),
        "last_selected_subject": profile.get("last_selected_subject", None)
    }
print(get_current_user)


# Update profile subject
@profile_router.patch("/profile/subject")
async def update_last_selected_subject(
    subject_data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user["_id"])
    print("Extracted user_id from token:", user_id)

    subject = subject_data.get("last_selected_subject")
    if not subject:
        raise HTTPException(status_code=400, detail="Missing subject.")

    result = profiles_collection.update_one(
        {"user_id": user_id},
        {"$set": {"last_selected_subject": subject}}
    )

    print("Matched count:", result.matched_count)
    print("Modified count:", result.modified_count)

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found.")

    return {"message": "Subject updated successfully."}


# Update subject progress


@profile_router.get("/debug/profile")
async def debug_profile(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    print("DEBUG user ID:", user_id)
    
    profile = profiles_collection.find_one({"user_id": user_id})
    print("DEBUG Profile:", profile)
    
    return {"user_id": user_id, "profile": profile}
