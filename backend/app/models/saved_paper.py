from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey, UniqueConstraint, String, Boolean, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime

class SavedPaper(Base):
    __tablename__ = "saved_papers"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    
    status: Mapped[str] = mapped_column(String, default="unread", server_default="unread", nullable=False)
    bookmarked: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false", nullable=False)
    tags: Mapped[list] = mapped_column(JSON, default=list, server_default="[]", nullable=False)
    saved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, server_default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "paper_id", name="uq_saved_paper"),)
