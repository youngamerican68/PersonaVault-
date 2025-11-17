/**
 * API client for Persona Vault backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// TypeScript Types (matching backend schemas)
// ============================================================================

export interface CoreIdentity {
  name: string;
  self_described_role: string;
  age_or_age_style?: string | null;
  gender_presentation?: string | null;
  location_or_setting?: string | null;
}

export interface PersonalityTraits {
  adjectives: string[];
  openness?: string | null;
  conscientiousness?: string | null;
  extraversion?: string | null;
  agreeableness?: string | null;
  neuroticism?: string | null;
}

export interface SpeechStyle {
  formality?: string | null;
  tone?: string | null;
  quirks: string[];
  banned_or_avoided_patterns: string[];
}

export interface RelationshipWithUser {
  relationship_type: string;
  nicknames_for_user: string[];
  shared_memories: string[];
  emotional_tone: string;
}

export interface PreferencesAndWorldview {
  likes: string[];
  dislikes: string[];
  topics_to_avoid: string[];
  default_conversation_topics: string[];
}

export interface PersonaProfile {
  core_identity: CoreIdentity;
  personality_traits: PersonalityTraits;
  speech_style: SpeechStyle;
  relationship_with_user: RelationshipWithUser;
  preferences_and_worldview: PreferencesAndWorldview;
}

export interface PersonaResponse {
  id: string;
  session_id: string;
  name: string;
  source_platform?: string | null;
  tagline?: string | null;
  persona_profile: PersonaProfile;
  persona_description: string;
  restoration_prompt: string;
  user_relationship_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonaListItem {
  id: string;
  name: string;
  tagline?: string | null;
  source_platform?: string | null;
  created_at: string;
}

export interface PersonaCreateRequest {
  name: string;
  source_platform?: string | null;
  logs_text: string;
  user_relationship_notes?: string | null;
}

export interface AppMeta {
  app_name: string;
  version: string;
  disclaimer: string;
}

export interface APIError {
  detail: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Create a new persona from chat logs
 */
export async function createPersona(data: PersonaCreateRequest): Promise<PersonaResponse> {
  const response = await fetch(`${API_BASE_URL}/api/personas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: include cookies for session
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to create persona' }));
    throw new Error(error.detail || 'Failed to create persona');
  }

  return response.json();
}

/**
 * Get all personas for the current session
 */
export async function listPersonas(): Promise<PersonaListItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/personas`, {
    credentials: 'include', // Important: include cookies for session
  });

  if (!response.ok) {
    throw new Error('Failed to fetch personas');
  }

  return response.json();
}

/**
 * Get a specific persona by ID
 */
export async function getPersona(id: string): Promise<PersonaResponse> {
  const response = await fetch(`${API_BASE_URL}/api/personas/${id}`, {
    credentials: 'include', // Important: include cookies for session
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Failed to fetch persona' })) as APIError;
    throw new Error(error.detail || 'Failed to fetch persona');
  }

  return response.json();
}

/**
 * Get application metadata including version and disclaimer
 */
export async function getAppMeta(): Promise<AppMeta> {
  const response = await fetch(`${API_BASE_URL}/api/meta`);

  if (!response.ok) {
    throw new Error('Failed to fetch app metadata');
  }

  return response.json();
}
