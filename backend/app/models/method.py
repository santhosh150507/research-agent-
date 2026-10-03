from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text
from app.database import Base

class Method(Base):
    __tablename__ = "methods"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
