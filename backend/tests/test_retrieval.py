from app.services.retrieval.keyword_search import bm25_search

def test_bm25():
    docs = [{'id': 1, 'text': 'adaptive learning personalized recommendation'}]
    res = bm25_search('adaptive', docs)
    assert len(res) == 1
