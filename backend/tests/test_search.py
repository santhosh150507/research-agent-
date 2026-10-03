from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_search():
    res = client.post("/api/v1/search", json={"query": "adaptive", "expanded_queries": []})
    assert res.status_code == 200
    assert "agent_trace" in res.json()
