from pydantic import BaseModel
from typing import List, Literal

class ChatMessage(BaseModel):
    sender: Literal["user", "bot"]
    text: str

class ChatHistory(BaseModel):
    subject: str
    messages: List[ChatMessage]
