from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_graph():
    assert client.get("/api/v1/graph").status_code == 200
