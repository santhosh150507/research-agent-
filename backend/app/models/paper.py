from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Boolean, Text, Index
from app.database import Base

class Paper(Base):
    __tablename__ = "papers"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    venue: Mapped[str | None] = mapped_column(String, nullable=True)
    doi: Mapped[str | None] = mapped_column(String, nullable=True, unique=True, index=True)
    url: Mapped[str | None] = mapped_column(String, nullable=True)
    abstract: Mapped[str | None] = mapped_column(Text, nullable=True)
    citation_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    open_access: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    source: Mapped[str] = mapped_column(String) # "demo", "openalex", etc.
