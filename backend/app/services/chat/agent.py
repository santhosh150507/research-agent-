from app.database import SessionLocal
from app.models.message import ConversationMessage

def chat_agent(conv_id: int, message: str):
    db = SessionLocal()
    m = ConversationMessage(conversation_id=conv_id, role="user", content=message)
    # in a real app we'd save to DB
    db.close()
    
    m_lower = message.lower()
    resp = "I understand."
    if "methodologies" in m_lower:
        resp = "Common methods include CNN and Matrix Factorization."
    elif "underexplored" in m_lower:
        resp = "Potentially underexplored areas."
        
    return {
        "message": resp,
        "actions": [],
        "literature_state": {"search_id": 1, "paper_ids": [], "filters": {}},
        "agent_trace": [{"step": "reply", "detail": "replied", "status": "done"}]
    }
