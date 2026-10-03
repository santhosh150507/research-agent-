from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.chat.agent import chat_agent
from app.database import SessionLocal
from app.models.conversation import ResearchConversation
from app.models.message import ConversationMessage

router = APIRouter()

class ChatReq(BaseModel):
    message: str

@router.post("/conversations")
def create_conv():
    from app.models.user import User
    db = SessionLocal()
    user = db.query(User).first()
    if not user:
        user = User(email="test@example.com", name="Test")
        db.add(user)
        db.commit()
        db.refresh(user)
    uid = user.id
    c = ResearchConversation(user_id=uid, project_id=None, literature_state={})
    db.add(c)
    db.commit()
    db.refresh(c)
    res = {"id": c.id, "title": "New Chat"}
    db.close()
    return res

@router.get("/conversations/{id}")
def get_conv(id: int):
    db = SessionLocal()
    c = db.query(ResearchConversation).filter(ResearchConversation.id == id).first()
    if not c:
        db.close()
        raise HTTPException(404)
    msgs = db.query(ConversationMessage).filter(ConversationMessage.conversation_id == id).all()
    res = {"id": c.id, "messages": [{"role": m.role, "content": m.content} for m in msgs]}
    db.close()
    return res

@router.post("/conversations/{id}/messages")
def send_msg(id: int, req: ChatReq):
    return chat_agent(id, req.message)
