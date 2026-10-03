from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_review_creation():
    res = client.post("/api/v1/literature-review", json={"paper_ids": [1], "title": "Test Review"})
    assert res.status_code == 200
    rid = res.json()["review_id"]
    r2 = client.get(f"/api/v1/literature-review/{rid}")
    assert r2.status_code == 200
    assert r2.json()["status"] in ["queued", "running", "done"]
