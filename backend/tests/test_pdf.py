from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_upload_non_pdf():
    files = {'file': ('test.txt', b'hello')}
    res = client.post("/api/v1/upload", files=files)
    assert res.status_code == 400
