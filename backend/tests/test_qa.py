from fastapi.testclient import TestClient
from app.main import app
from app.db.seed import seed_demo_data

client = TestClient(app)

def test_qa_not_found():
    seed_demo_data()
    res = client.post("/api/v1/papers/1/qa", json={"question": "xyz123"})
    assert res.status_code == 200
    ans = res.json()["answer"]
    assert len(ans) > 0
    assert "not found" in ans[0]["text"]
