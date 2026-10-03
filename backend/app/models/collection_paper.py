from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey, UniqueConstraint
from app.database import Base

class CollectionPaper(Base):
    __tablename__ = "collection_papers"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    collection_id: Mapped[int] = mapped_column(ForeignKey("collections.id"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    __table_args__ = (UniqueConstraint("collection_id", "paper_id", name="uq_collection_paper"),)
