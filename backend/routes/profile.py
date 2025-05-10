from fastapi import APIRouter, HTTPException, Depends, Body, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.user import Profile, ProgressUpdate
from core.database import profiles_collection, users_collection
from bson import ObjectId
from utils.jwt_utils import get_current_user, verify_token
from typing import List, Optional

profile_router = APIRouter()
security = HTTPBearer()

async def get_current_user_from_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Get current user from Bearer token"""
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

@profile_router.post("/profile/setup")
async def setup_profile(
    profile: Profile,
    current_user: dict = Depends(get_current_user_from_token)
):
    """Initial profile setup after signup."""
    # Verify the user is setting up their own profile
    if str(current_user["_id"]) != profile.user_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to set up this profile"
        )

    existing_profile = profiles_collection.find_one({"user_id": profile.user_id})
    
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists.")

    # Convert profile to dict and ensure all fields are included
    profile_data = profile.dict()
    profile_data.update({
        # "preferences": profile_data.get("preferences", []),
        "progress": {}  # Initialize empty progress tracking
    })

    new_profile = profiles_collection.insert_one(profile_data)
    
    if not new_profile.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create profile.")

    # Update profile_complete in users_collection
    users_collection.update_one(
        {"_id": ObjectId(profile.user_id)},
        {"$set": {"profile_complete": True}}
    )

    return {"message": "Profile setup successful!"}


@profile_router.get("/profile/me")
async def get_my_profile(current_user: dict = Depends(get_current_user_from_token)):
    """Fetch full user profile (after login)."""
    user_id = str(current_user["_id"])
    profile = profiles_collection.find_one({"user_id": user_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    return {
        "email": current_user["email"],
        "name": current_user.get("full_name", ""),
        "isProfileComplete": current_user.get("profile_complete", False),
        "age": profile.get("age", ""),
        "highest_education": profile.get("highest_education", ""),
        "available_time": profile.get("available_time", ""),
        "study_level": profile.get("study_level", ""),
        "study_goal": profile.get("study_goal", ""),
        "subjects": profile.get("subjects", []),
        "content_preferences": profile.get("content_preferences", []),
        "language_complexity": profile.get("language_complexity", ""),
        "preferred_tone": profile.get("preferred_tone", ""),
        "last_selected_subject": profile.get("last_selected_subject", None),
        "progress": profile.get("progress", {})
    }

@profile_router.patch("/profile/subject")
async def update_last_selected_subject(
    subject_data: dict = Body(...),
    current_user: dict = Depends(get_current_user_from_token)
):
    user_id = str(current_user["_id"])
    subject = subject_data.get("last_selected_subject")
    
    if not subject:
        raise HTTPException(status_code=400, detail="Missing subject.")

    result = profiles_collection.update_one(
        {"user_id": user_id},
        {"$set": {"last_selected_subject": subject}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found.")

    return {"message": "Subject updated successfully."}

@profile_router.patch("/subject/progress")
async def update_subject_progress(
    progress_data: ProgressUpdate,
    current_user: dict = Depends(get_current_user_from_token)
):
    user_id = str(current_user["_id"])

    result = profiles_collection.update_one(
        {"user_id": user_id},
        {"$set": {f"progress.{progress_data.subject}": progress_data.progress}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Progress update failed.")

    return {"message": "Subject progress updated successfully."}

@profile_router.get("/subject/progress")
async def get_subject_progress(current_user: dict = Depends(get_current_user_from_token)):
    user_id = str(current_user["_id"])
    profile = profiles_collection.find_one({"user_id": user_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    return {"progress": profile.get("progress", {})}

@profile_router.get("/debug/profile")
async def debug_profile(current_user: dict = Depends(get_current_user_from_token)):
    user_id = str(current_user["_id"])
    print("DEBUG user ID:", user_id)
    
    profile = profiles_collection.find_one({"user_id": user_id})
    print("DEBUG Profile:", profile)
    
    return {"user_id": user_id, "profile": profile}
