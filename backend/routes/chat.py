from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
from dotenv import load_dotenv
from models.chat import ChatHistory, ChatMessage
from core.database import chats_collection
from utils.jwt_utils import get_current_user
from bson import ObjectId
from datetime import datetime
import os

# Load environment variables
load_dotenv()

chat_router = APIRouter()

# Load Ollama model
model_name = os.getenv("OLLAMA_MODEL", "mistral")  # Default model if not set
llm = OllamaLLM(model=model_name)

class ChatRequest(BaseModel):
    prompt: str
    mode: str  # New field to determine type of response


@chat_router.post("/generate")
def generate_content(request: ChatRequest):
    try:
        # Modify the prompt based on the selected mode
        if request.mode == "Explain":
            final_prompt = f"Explain in two lines {request.prompt}"
        elif request.mode == "Quiz":
            final_prompt = f"Generate a quiz question with multiple options related to: {request.prompt}, the multiple options should be in different lines and also give the correct answer out of the given options in the next line"
        elif request.mode == "Test":
            final_prompt = f"From the given prompt: {request.prompt}, identify the topic which is asked in the {request.prompt}, specify the subject or topic that this prompt belong to, then give two questions related to the {request.prompt}, after that give the answers of those question in the end. Mark the topic's name as bold, give number to each questions and generate the answer in italics."
        else:
            final_prompt = request.prompt  # Default behavior

        response = llm.invoke(final_prompt)  
        return {"generated_text": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.get("/chat/history/{subject}")
async def get_chat_history(subject: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    chat_doc = chats_collection.find_one({"user_id": user_id, "subject": subject})

    if not chat_doc:
        return {"messages": []}

    return {"messages": chat_doc.get("messages", [])}

@chat_router.post("/chat/save")
async def save_chat_message(chat: ChatHistory, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    existing_chat = chats_collection.find_one({"user_id": user_id, "subject": chat.subject})

    if existing_chat:
        # Append to existing
        chats_collection.update_one(
            {"user_id": user_id, "subject": chat.subject},
            {"$push": {"messages": {"$each": chat.messages}}, "$set": {"updated_at": datetime.utcnow()}}
        )
    else:
        # New chat document
        chats_collection.insert_one({
            "user_id": user_id,
            "subject": chat.subject,
            "messages": chat.messages,
            "updated_at": datetime.utcnow()
        })

    return {"message": "Chat saved successfully."}