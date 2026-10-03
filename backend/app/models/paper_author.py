from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey, UniqueConstraint
from app.database import Base

class PaperAuthor(Base):
    __tablename__ = "paper_authors"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"), index=True)
    __table_args__ = (UniqueConstraint("paper_id", "author_id", name="uq_paper_author"),)
