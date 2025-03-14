import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["eduai"]  # Database name

# Collections
users_collection = db["users"]

# Test the connection
try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
