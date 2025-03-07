from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_community.llms import Ollama

app = FastAPI()

llm = Ollama(model="llama3.1")

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
        
    
