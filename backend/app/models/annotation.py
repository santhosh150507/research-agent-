from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey, Text
from app.database import Base

class Annotation(Base):
    __tablename__ = "annotations"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    section: Mapped[str | None] = mapped_column(String, nullable=True)
    page: Mapped[int | None] = mapped_column(Integer, nullable=True)
    text_selection: Mapped[str | None] = mapped_column(Text, nullable=True)
    comment: Mapped[str] = mapped_column(Text)
