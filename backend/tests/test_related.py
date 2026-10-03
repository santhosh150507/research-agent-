from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_related():
    assert client.get("/api/v1/papers/1/related").status_code == 200
def test_evolution():
    assert client.get("/api/v1/papers/1/evolution").status_code == 200
