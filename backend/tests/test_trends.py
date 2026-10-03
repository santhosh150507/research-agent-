from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_trends():
    assert client.get("/api/v1/trends").status_code == 200
