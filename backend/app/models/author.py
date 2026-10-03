from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from app.database import Base

class Author(Base):
    __tablename__ = "authors"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
