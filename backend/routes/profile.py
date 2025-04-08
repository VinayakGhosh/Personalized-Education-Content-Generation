from fastapi import APIRouter, HTTPException, Depends
from models.user import Profile
from core.database import profiles_collection
from core.database import users_collection
from bson import ObjectId

profile_router = APIRouter()

@profile_router.post("/profile/setup")
async def setup_profile(profile: Profile):
    # Check if user already has a profile
    existing_profile = profiles_collection.find_one({"user_id": profile.user_id})
    
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists.")

    # Insert profile data into the database
    new_profile = profiles_collection.insert_one(profile.dict())
    
    if not new_profile.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to create profile.")


     # ✅ Update profile_complete in users_collection
    users_collection.update_one(
        {"_id": ObjectId(profile.user_id)},
        {"$set": {"profile_complete": True}}
    )

    return {"message": "Profile setup successful!"}
