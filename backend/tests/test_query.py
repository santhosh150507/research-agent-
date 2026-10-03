from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_understand():
    res = client.post("/api/v1/query/understand", json={"text": "adaptive"})
    assert res.status_code == 200
    assert res.json()["main_topic"] in ["Adaptive Learning", "adaptive", "Adaptive"]
