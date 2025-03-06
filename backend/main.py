from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama
import requests

app = FastAPI()

# Define request body structure
class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
def home():
    return{"message: Hello World" }

@app.post("/generate/")
def generate_content(request: PromptRequest):
    try:
        response = ollama.chat(model="llama3.1", messages=[{"role": "user", "content": request.prompt}])
        return {"generated_text": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/double")
def double_number(num:int):
    try:
        return{"number": num, "double": num*2}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
# url = "http://127.0.0.1:8000/"
# response = requests.get(url)
# print(response.json())