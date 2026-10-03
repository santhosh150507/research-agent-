from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_methods():
    assert client.get("/api/v1/methods").status_code == 200
def test_datasets():
    assert client.get("/api/v1/datasets").status_code == 200
