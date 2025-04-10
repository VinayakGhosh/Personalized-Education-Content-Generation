# backend/routes/chapters.py

from fastapi import APIRouter, HTTPException
from core.database import chapters_collection

chapter_router = APIRouter()

@chapter_router.get("/{subject}")
async def get_chapters(subject: str):
    subject_doc = chapters_collection.find_one({"subject": subject})

    if not subject_doc:
        raise HTTPException(status_code=404, detail="Subject not found.")

    return {"subject": subject, "chapters": subject_doc.get("chapters", [])}
