from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey, JSON
from app.database import Base

class UploadJob(Base):
    __tablename__ = "upload_jobs"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    status: Mapped[str] = mapped_column(String)
    error: Mapped[str | None] = mapped_column(String, nullable=True)
    paper_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("papers.id"), nullable=True)
    structure: Mapped[dict | None] = mapped_column(JSON, nullable=True)
