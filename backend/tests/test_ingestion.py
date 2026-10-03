from app.services.sources.aggregator import search_external

def test_aggregator_demo_fallback():
    res = search_external("test")
    assert isinstance(res, list)
