from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey, JSON
from app.database import Base

class SearchResult(Base):
    __tablename__ = "search_results"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    search_id: Mapped[int] = mapped_column(ForeignKey("search_queries.id"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    rank: Mapped[int] = mapped_column(Integer)
    signals: Mapped[dict] = mapped_column(JSON)
