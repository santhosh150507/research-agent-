from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey
from pgvector.sqlalchemy import Vector
from app.database import Base

class Embedding(Base):
    __tablename__ = "embeddings"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    chunk_id: Mapped[int] = mapped_column(ForeignKey("paper_chunks.id"), index=True)
    embedding = mapped_column(Vector(384))
