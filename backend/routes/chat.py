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
