from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
from app.db.seed import seed_demo_data
from app.database import SessionLocal
from app.models.paper import Paper

def test_analysis():
    seed_demo_data()
    db = SessionLocal()
    paper = db.query(Paper).first()
    db.close()
    
    assert paper is not None, "No paper found in DB"
    res = client.get(f"/api/v1/papers/{paper.id}/analysis")
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "paper_id" in data
