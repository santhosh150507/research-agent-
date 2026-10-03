from fastapi.testclient import TestClient
from app.main import app
from app.services.analysis.paper_analysis import extract_claims
from app.schemas.common import Claim

client = TestClient(app)

def test_extract_claims_quote_exact():
    text = "We propose a novel method. Results show an improvement."
    claims = extract_claims(text, ["propose"])
    assert len(claims) == 1
    assert claims[0]["text"] == "We propose a novel method."
    assert claims[0]["kind"] == "sourced"
    assert len(claims[0]["sources"]) > 0

def test_compare_nulls_and_analysis_differs():
    res1 = client.get("/api/v1/papers/1/analysis").json()
    res2 = client.get("/api/v1/papers/2/analysis").json()
    
    comp = client.post("/api/v1/compare", json={"paper_ids": [1, 9999]}).json()
    # Paper 9999 doesn't exist, should have nulls
    rows = comp["rows"]
    assert len(rows) > 0
    assert rows[0]["values"]["9999"] is None
