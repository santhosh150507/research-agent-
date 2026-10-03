from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey, UniqueConstraint
from app.database import Base

class SavedPaper(Base):
    __tablename__ = "saved_papers"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    __table_args__ = (UniqueConstraint("user_id", "paper_id", name="uq_saved_paper"),)
