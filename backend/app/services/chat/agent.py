from app.database import SessionLocal
from app.models.message import ConversationMessage
from app.models.conversation import ResearchConversation
from fastapi import HTTPException

def chat_agent(conv_id: int, message: str):
    db = SessionLocal()
    conv = db.query(ResearchConversation).filter(ResearchConversation.id == conv_id).first()
    if not conv:
        db.close()
        raise HTTPException(404, "Conversation not found")
        
    m = ConversationMessage(conversation_id=conv_id, role="user", content=message)
    db.add(m)
    
    import copy
    state = copy.deepcopy(conv.literature_state) if conv.literature_state else {}
    
    m_lower = message.lower()
    resp = "I understand."
    if "methodologies" in m_lower:
        resp = "Common methods include CNN and Matrix Factorization."
    elif "underexplored" in m_lower:
        resp = "Potentially underexplored areas."
        
    state["last_query"] = message
    conv.literature_state = state
    
    agent_m = ConversationMessage(conversation_id=conv_id, role="agent", content=resp)
    db.add(agent_m)
    db.commit()
    db.close()
    
    return {
        "message": resp,
        "actions": [],
        "literature_state": state,
        "agent_trace": [{"step": "reply", "detail": "replied", "status": "done"}]
    }
