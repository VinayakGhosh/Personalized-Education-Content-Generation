from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
from dotenv import load_dotenv
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

# def generate_prompt(prompt: str, mode: str) -> str:
#     """
#     Modifies the prompt based on the selected mode.
#     """
#     if mode == "explain":
#         return f"Explain this in a simple way: {prompt}"
#     elif mode == "quiz":
#         return f"Generate a quiz based on: {prompt}"
#     elif mode == "summarize":
#         return f"Summarize this: {prompt}"
#     else:
#         return prompt  # Default is normal chat

@chat_router.post("/generate")
def generate_content(request: ChatRequest):
    try:
        # Modify the prompt based on the selected mode
        if request.mode == "Explain":
            final_prompt = f"Explain in detail: {request.prompt}"
        elif request.mode == "Quiz":
            final_prompt = f"Generate a quiz question with multiple options related to: {request.prompt}, the multiple options should be in different lines and also give the correct answer out of the given options in the next line"
        elif request.mode == "Summarize":
            final_prompt = f"Summarize this: {request.prompt}"
        else:
            final_prompt = request.prompt  # Default behavior

        response = llm.invoke(final_prompt)  
        return {"generated_text": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
