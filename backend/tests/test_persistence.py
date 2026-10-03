from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.conversation import ResearchConversation
from app.models.message import ConversationMessage
from app.models.literature_review import LiteratureReview
from app.db.seed import seed_demo_data

client = TestClient(app)

def test_chat_persistence():
    seed_demo_data()
    # create conv
    cres = client.post("/api/v1/conversations").json()
    cid = cres["id"]
    
    # send 2 messages
    client.post(f"/api/v1/conversations/{cid}/messages", json={"message": "First"})
    client.post(f"/api/v1/conversations/{cid}/messages", json={"message": "Second"})
    
    db = SessionLocal()
    conv = db.query(ResearchConversation).filter(ResearchConversation.id == cid).first()
    assert conv.literature_state.get("last_query") == "Second"
    
    msgs = db.query(ConversationMessage).filter(ConversationMessage.conversation_id == cid).all()
    assert len(msgs) == 4 # 2 user, 2 agent
    db.close()

def test_review_persistence():
    seed_demo_data()
    rres = client.post("/api/v1/literature-review", json={"paper_ids": [1], "title": "Test Persist"}).json()
    rid = rres["review_id"]
    
    db = SessionLocal()
    rev = db.query(LiteratureReview).filter(LiteratureReview.id == int(rid)).first()
    assert rev is not None
    assert rev.title == "Test Persist"
    db.close()
    
    res2 = client.get(f"/api/v1/literature-review/{rid}").json()
    assert res2["title"] == "Test Persist"
    assert "status" in res2
