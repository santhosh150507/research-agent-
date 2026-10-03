from app.services.retrieval.reranker import compute_signals
def test_ranking():
    sig = compute_signals({})
    assert sig.semantic == "Medium"
