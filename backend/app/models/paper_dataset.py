from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey, UniqueConstraint
from app.database import Base

class PaperDataset(Base):
    __tablename__ = "paper_datasets"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    paper_id: Mapped[int] = mapped_column(ForeignKey("papers.id"), index=True)
    dataset_id: Mapped[int] = mapped_column(ForeignKey("datasets.id"), index=True)
    __table_args__ = (UniqueConstraint("paper_id", "dataset_id", name="uq_paper_dataset"),)
