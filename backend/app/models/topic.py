from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from app.database import Base

class Topic(Base):
    __tablename__ = "topics"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
