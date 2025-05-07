from pydantic import BaseModel
from typing import List, Literal

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatHistory(BaseModel):
    subject: str
    messages: List[ChatMessage]
