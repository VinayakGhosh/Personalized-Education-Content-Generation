from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import OllamaLLM

app = FastAPI()

llm = OllamaLLM(model="llama3.1")

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from React app
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define request body structure
class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
def home():
    return{"message: Hello World" }

@app.post("/generate/")
def generate_content(request: PromptRequest):
    try:
        response = llm.invoke(request.prompt)  # Using LangChain's invoke method
        return {"generated_text": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/double")
def double_number(num:int):
    try:
        return{"number": num, "double": num*2}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    
