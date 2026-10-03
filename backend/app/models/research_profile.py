from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey, JSON
from app.database import Base

class ResearchProfile(Base):
    __tablename__ = "research_profiles"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    name: Mapped[str] = mapped_column(String)
    interests: Mapped[list[str]] = mapped_column(JSON, default=list)
    preferred_domains: Mapped[list[str]] = mapped_column(JSON, default=list)
    favorite_methods: Mapped[list[str]] = mapped_column(JSON, default=list)
    topics_researching: Mapped[list[str]] = mapped_column(JSON, default=list)
