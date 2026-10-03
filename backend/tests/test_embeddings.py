from app.services.llm.embeddings import get_embedding
from app.config import settings

def test_embedding_dim():
    vec = get_embedding("test text")
    assert len(vec) == settings.embedding_dim
