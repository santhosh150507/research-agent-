from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey, Text, DateTime
from datetime import datetime
from app.database import Base

class Note(Base):
    __tablename__ = "notes"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    body: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
