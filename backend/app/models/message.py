from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey, Text, JSON
from app.database import Base

class ConversationMessage(Base):
    __tablename__ = "conversation_messages"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("research_conversations.id"), index=True)
    role: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(Text)
    claims: Mapped[list[dict]] = mapped_column(JSON, default=list)
