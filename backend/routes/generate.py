from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()

# Request model
class GenerateRequest(BaseModel):
    prompt: str

OLLAMA_API_URL = "http://localhost:11434/api/generate"  # Adjust as needed

@router.post("/generate/")
def generate_text(request: GenerateRequest):
    payload = {"model": "llama3.1", "prompt": request.prompt}
    response = requests.post(OLLAMA_API_URL, json=payload)
    return response.json()
