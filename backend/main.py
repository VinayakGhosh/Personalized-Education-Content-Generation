from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import chat_router
from routes.auth import auth_router
from routes.profile import profile_router
import os
from langchain_ollama import OllamaLLM

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Ollama model from .env
model_name = os.getenv("OLLAMA_MODEL", "llama3")
llm = OllamaLLM(model=model_name)

# Include routes
app.include_router(chat_router, prefix="/chat", tags=["AI Chat"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(profile_router, prefix="/user")

@app.get("/")
def home():
    return {"message": "go for /docs if you want to look at the swagegr docs of the API"}

print("🚀 FastAPI Server Running!")
