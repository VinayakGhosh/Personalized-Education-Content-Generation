from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
from dotenv import load_dotenv
from models.chat import ChatHistory, ChatMessage
from core.database import chats_collection
from utils.jwt_utils import get_current_user
from bson import ObjectId
from datetime import datetime
import requests
import os

# Load environment variables
load_dotenv()

chat_router = APIRouter()

# Load Ollama model
model_name = os.getenv("OLLAMA_MODEL", "llama")  # Default model if not set
llm = OllamaLLM(model=model_name)
grog_api = os.getenv("GROG_API")

class ChatRequest(BaseModel):
    prompt: str
    mode: str  # New field to determine type of response


@chat_router.post("/generate")
def generate_content(request: ChatRequest):
    try:
        # Determine the modified prompt based on the selected mode
        if request.mode == "Explain":
            final_prompt = f"Explain in two lines: {request.prompt}"
        elif request.mode == "Quiz":
            final_prompt = (
                f"Generate a quiz question with multiple options related to: {request.prompt}. "
                f"List the options line by line, and provide the correct answer in the next line."
            )
        elif request.mode == "Test":
            final_prompt = (
                f"From this prompt: {request.prompt}, identify the topic. "
                f"Specify the subject or topic it belongs to. "
                f"Then generate two questions related to it. "
                f"Provide the answers at the end. Bold the topic name, number each question, and italicize the answers."
            )
        else:
            final_prompt = request.prompt  # Fallback to direct prompt

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {grog_api}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model_name,  # Typically something like "llama3-70b-8192"
            "messages": [
                {"role": "system", "content": "You are an educational assistant."},
                {"role": "user", "content": final_prompt}
            ],
            "temperature": 0.7
        }

        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return {
            "generated_text": response.json()["choices"][0]["message"]["content"]
        }

    except requests.RequestException as req_err:
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(req_err)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@chat_router.get("/history/{subject}")
async def get_chat_history(subject: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    chat_doc = chats_collection.find_one({"user_id": user_id, "subject": subject})

    if not chat_doc:
        return {"messages": []}

    return {"messages": chat_doc.get("messages", [])}

@chat_router.post("/chatSave")
async def save_chat_message(chat: ChatHistory, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    message_dicts = [msg.dict() for msg in chat.messages]
    existing_chat = chats_collection.find_one({"user_id": user_id, "subject": chat.subject})

    if existing_chat:
        # Append to existing
        chats_collection.update_one(
            {"user_id": user_id, "subject": chat.subject},
            {
                "$push": {"messages": {"$each": message_dicts}},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
    else:
        # New chat document
        chats_collection.insert_one({
            "user_id": user_id,
            "subject": chat.subject,
            "messages": message_dicts,
            "updated_at": datetime.utcnow()
        })

    return {"message": "Chat saved successfully."}