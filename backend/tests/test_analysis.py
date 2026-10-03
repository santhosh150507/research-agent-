from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_analysis():
    res = client.get("/api/v1/papers/1/analysis")
    assert res.status_code == 200
    assert "summary" in res.json()
