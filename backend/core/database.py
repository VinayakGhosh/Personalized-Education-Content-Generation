import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["chat_app"]  # Database name
users_collection = db["users"]
profiles_collection = db["profiles"]  # New Collection
chapters_collection = db["chapters"]
chats_collection = db["chat"]
print("✅ Connected to MongoDB!")
