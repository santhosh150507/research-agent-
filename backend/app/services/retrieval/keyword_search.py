from rank_bm25 import BM25Okapi
def bm25_search(query: str, docs: list[dict]):
    if not docs: return []
    corpus = [d['text'].split() for d in docs]
    bm25 = BM25Okapi(corpus)
    scores = bm25.get_scores(query.split())
    return sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
