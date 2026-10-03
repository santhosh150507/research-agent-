from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, ForeignKey
from app.database import Base

class ResearchConversation(Base):
    __tablename__ = "research_conversations"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("research_projects.id"), nullable=True, index=True)
