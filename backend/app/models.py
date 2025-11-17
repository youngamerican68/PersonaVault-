"""SQLAlchemy database models."""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID

from .database import Base


class Persona(Base):
    """
    Persona model representing an AI persona backup.

    Attributes:
        id: Unique identifier (UUID)
        session_id: Anonymous session identifier for grouping personas
        name: Persona name (e.g., "Lune Klaus")
        source_platform: Platform where logs originated (e.g., "ChatGPT", "Claude")
        tagline: Short descriptive phrase
        persona_profile_json: Structured persona profile (JSON)
        persona_description: Human-readable description (1-3 paragraphs)
        restoration_prompt: Prompt for recreating persona in any LLM
        user_relationship_notes: Optional user-provided relationship context
        logs_path: File path to raw chat logs
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """

    __tablename__ = "personas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    source_platform = Column(String(50))
    tagline = Column(String(300))
    persona_profile_json = Column(JSON, nullable=False)
    persona_description = Column(Text, nullable=False)
    restoration_prompt = Column(Text, nullable=False)
    user_relationship_notes = Column(Text)
    logs_path = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Persona(id={self.id}, name={self.name}, session_id={self.session_id})>"
