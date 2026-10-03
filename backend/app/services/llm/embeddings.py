from app.config import settings
from app.database import SessionLocal
from app.models.embedding import Embedding as EmbeddingModel
import hashlib

def get_embedding(text: str) -> list[float]:
    # Dummy fallback hashing for DEMO_MODE
    h = hashlib.md5(text.encode()).digest()
    vec = [float(b)/255.0 for b in h]
    # pad or truncate to EMBEDDING_DIM
    dim = settings.embedding_dim
    while len(vec) < dim: vec += vec
    return vec[:dim]
