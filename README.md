# About

This repository has source code for Personalized Educational Content Generation using AI

# How to use this Repo

## Backend
- Download python and ollama in your system
- cd into /backend
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
- if your device has low ram then use
       ```
       ollama pull tinyllama:1.1b
       ```
       
4) Create .env file and put this in it
    ```
          MONGO_URI=<mongo_db_uri>
          JWT_SECRET=your_secret_key
          OLLAMA_MODEL=llama3-8b-8192
          GROG_API = <your api key>
     ```
4) Run FastApi
     ```
     uvicorn main:app --reload
    ```
   


## Frontend
- cd into /frontend

1) Install node dependencies
        ```
        npm install
        ```
   
3) Start vite server
        ```
        npm run dev
        ```
