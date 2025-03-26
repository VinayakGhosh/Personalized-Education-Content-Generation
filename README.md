#About
This repository has source code for Personalized Educational Content Generation using AI

#How to use this Repo
##Backend
cd into /backend
1) Setup virtual env in python using
     ```
     python -m venv venv
     source venv/Scripts/activate  
    ```

2) Install Dependencies
    ```
      pip install -r requirements.txt
    ```
3) Download Ollama Model
     ```
     ollama pull mistral
     ```
4) Run FastApi
     ```
     uvicorn main:app --reload
    ```


