from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey, Text
from app.database import Base

class PaperChunk(Base):
    __tablename__ = "paper_chunks"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    text: Mapped[str] = mapped_column(Text)
    section: Mapped[str | None] = mapped_column(String, nullable=True)
