from fastapi.testclient import TestClient
from app.main import app
from app.db.seed import seed_demo_data

client = TestClient(app)

def test_e2e_flow():
    seed_demo_data()
    # understand
    r = client.post("/api/v1/query/understand", json={"text": "adaptive"})
    assert r.status_code == 200
    # search
    r = client.post("/api/v1/search", json={"query": "adaptive", "expanded_queries": []})
    assert r.status_code == 200
    # analysis
    r = client.get("/api/v1/papers/1/analysis")
    assert r.status_code == 200
    # compare
    r = client.post("/api/v1/compare", json={"paper_ids": [1, 2]})
    assert r.status_code == 200
    # methods
    r = client.get("/api/v1/methods")
    assert r.status_code == 200
    # chat gaps
    r = client.post("/api/v1/conversations/1/messages", json={"message": "What appears underexplored?"})
    assert r.status_code == 200
    assert "underexplored" in r.json()["message"]
    # review
    r = client.post("/api/v1/literature-review", json={"paper_ids": [1], "title": "Test"})
    assert r.status_code == 200
