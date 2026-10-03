from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_gaps():
    res = client.post("/api/v1/gaps", json={})
    assert res.status_code == 200
    assert "Potentially underexplored" in str(res.json())
def test_challenges():
    assert client.post("/api/v1/papers/1/challenges", json={"mode": "challenge"}).status_code == 200
