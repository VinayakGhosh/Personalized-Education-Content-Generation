from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_ollama import OllamaLLM

chat_router = APIRouter()

# Initialize LangChain Ollama LLM
llm = OllamaLLM(model="gemma3:12b")

class ChatRequest(BaseModel):
    prompt: str

@chat_router.post("/ask")
async def generate_response(request: ChatRequest):
    try:
        response = llm.invoke(request.prompt)  # ✅ Using LangChain invoke
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
