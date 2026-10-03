from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chat.agent import chat_agent

router = APIRouter()

class ChatReq(BaseModel):
    message: str

@router.post("/conversations")
def create_conv():
    return {"id": 1, "title": "New Chat"}

@router.get("/conversations")
def get_convs():
    return []

@router.get("/conversations/{id}")
def get_conv(id: int):
    return {"id": id, "messages": []}

@router.post("/conversations/{id}/messages")
def send_msg(id: int, req: ChatReq):
    return chat_agent(id, req.message)
