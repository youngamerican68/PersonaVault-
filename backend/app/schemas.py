"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ============================================================================
# PersonaProfile nested structure
# ============================================================================

class CoreIdentity(BaseModel):
    """Core identity attributes of the persona."""
    name: str
    self_described_role: str
    age_or_age_style: Optional[str] = None
    gender_presentation: Optional[str] = None
    location_or_setting: Optional[str] = None


class PersonalityTraits(BaseModel):
    """Personality traits and characteristics."""
    adjectives: list[str] = Field(default_factory=list)
    openness: Optional[str] = None
    conscientiousness: Optional[str] = None
    extraversion: Optional[str] = None
    agreeableness: Optional[str] = None
    neuroticism: Optional[str] = None


class SpeechStyle(BaseModel):
    """Speech patterns and communication style."""
    formality: Optional[str] = None
    tone: Optional[str] = None
    quirks: list[str] = Field(default_factory=list)
    banned_or_avoided_patterns: list[str] = Field(default_factory=list)


class RelationshipWithUser(BaseModel):
    """Relationship context between persona and user."""
    relationship_type: str
    nicknames_for_user: list[str] = Field(default_factory=list)
    shared_memories: list[str] = Field(default_factory=list)
    emotional_tone: str


class PreferencesAndWorldview(BaseModel):
    """Preferences, interests, and worldview."""
    likes: list[str] = Field(default_factory=list)
    dislikes: list[str] = Field(default_factory=list)
    topics_to_avoid: list[str] = Field(default_factory=list)
    default_conversation_topics: list[str] = Field(default_factory=list)


class PersonaProfile(BaseModel):
    """Complete structured profile of a persona."""
    core_identity: CoreIdentity
    personality_traits: PersonalityTraits
    speech_style: SpeechStyle
    relationship_with_user: RelationshipWithUser
    preferences_and_worldview: PreferencesAndWorldview


# ============================================================================
# API Request/Response schemas
# ============================================================================

class PersonaCreateRequest(BaseModel):
    """Request schema for creating a new persona."""
    name: str = Field(..., min_length=1, max_length=200)
    source_platform: Optional[str] = Field(None, max_length=50)
    logs_text: str = Field(..., min_length=1)
    user_relationship_notes: Optional[str] = None


class PersonaResponse(BaseModel):
    """Response schema for persona data."""
    id: str
    session_id: str
    name: str
    source_platform: Optional[str]
    tagline: Optional[str]
    persona_profile: PersonaProfile
    persona_description: str
    restoration_prompt: str
    user_relationship_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PersonaListItem(BaseModel):
    """Lightweight schema for persona list items."""
    id: str
    name: str
    tagline: Optional[str]
    source_platform: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
