from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey, JSON
from app.database import Base

class LiteratureReview(Base):
    __tablename__ = "literature_reviews"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    sections: Mapped[list[dict] | None] = mapped_column(JSON, nullable=True)
    references: Mapped[list[dict] | None] = mapped_column(JSON, nullable=True)
