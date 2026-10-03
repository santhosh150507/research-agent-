from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey, UniqueConstraint
from app.database import Base

class Citation(Base):
    __tablename__ = "citations"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    source_paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    target_paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    __table_args__ = (UniqueConstraint("source_paper_id", "target_paper_id", name="uq_citation"),)
