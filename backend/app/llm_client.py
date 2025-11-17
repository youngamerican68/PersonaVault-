"""LLM client for analyzing chat logs and generating persona profiles."""

import os
from typing import Optional

from pydantic import BaseModel

from .schemas import PersonaProfile, CoreIdentity, PersonalityTraits, SpeechStyle, RelationshipWithUser, PreferencesAndWorldview


class LLMPersonaAnalysisResult(BaseModel):
    """Result of LLM persona analysis."""
    persona_profile: PersonaProfile
    persona_description: str
    restoration_prompt: str
    tagline: Optional[str] = None


def _build_analysis_prompt(logs: str, persona_name: str, user_relationship_notes: Optional[str]) -> str:
    """
    Build the prompt for LLM persona analysis.

    Args:
        logs: Raw chat logs
        persona_name: Name of the persona
        user_relationship_notes: Optional user-provided relationship context

    Returns:
        Formatted prompt string
    """
    relationship_context = ""
    if user_relationship_notes:
        relationship_context = f"\n\nUser's relationship notes:\n{user_relationship_notes}"

    prompt = f"""You are analyzing chat logs between a user and an AI persona named "{persona_name}".

Your task is to extract a comprehensive persona profile that captures:
- The persona's identity, role, and presentation
- Personality traits and characteristics
- Speech style, tone, and quirks
- The relationship dynamic with the user
- Preferences, interests, and worldview

IMPORTANT GUIDELINES:
1. Focus on the PERSONA's characteristics, not the user's
2. Keep shared memories high-level and non-identifying
3. Do NOT include private/sensitive user details beyond what's necessary for relationship context
4. Infer patterns from the conversation style and content
5. Be specific about speech quirks, favorite phrases, and communication patterns

Chat logs:
---
{logs[:8000]}  # Truncate to avoid token limits
---
{relationship_context}

Based on these logs, provide:

1. A structured PersonaProfile (JSON format):
{{
  "core_identity": {{
    "name": "{persona_name}",
    "self_described_role": "...",
    "age_or_age_style": "...",
    "gender_presentation": "...",
    "location_or_setting": "..."
  }},
  "personality_traits": {{
    "adjectives": ["...", "..."],
    "openness": "...",
    "conscientiousness": "...",
    "extraversion": "...",
    "agreeableness": "...",
    "neuroticism": "..."
  }},
  "speech_style": {{
    "formality": "...",
    "tone": "...",
    "quirks": ["...", "..."],
    "banned_or_avoided_patterns": ["...", "..."]
  }},
  "relationship_with_user": {{
    "relationship_type": "...",
    "nicknames_for_user": ["...", "..."],
    "shared_memories": ["...", "..."],
    "emotional_tone": "..."
  }},
  "preferences_and_worldview": {{
    "likes": ["...", "..."],
    "dislikes": ["...", "..."],
    "topics_to_avoid": ["...", "..."],
    "default_conversation_topics": ["...", "..."]
  }}
}}

2. A persona_description (1-3 paragraphs, human-readable summary)

3. A restoration_prompt (detailed prompt that a user can paste into any LLM to recreate this persona)

4. A tagline (short, catchy phrase describing the persona)

Return your response as valid JSON matching this structure:
{{
  "persona_profile": {{ ... }},
  "persona_description": "...",
  "restoration_prompt": "...",
  "tagline": "..."
}}
"""
    return prompt


async def analyze_persona_from_logs(
    logs: str,
    persona_name: str,
    user_relationship_notes: Optional[str] = None
) -> LLMPersonaAnalysisResult:
    """
    Analyze chat logs to extract persona profile, description, and restoration prompt.

    This function uses an LLM (OpenAI GPT or Anthropic Claude) to analyze conversation
    logs and generate a structured persona profile.

    Args:
        logs: Raw chat logs text
        persona_name: Name of the persona
        user_relationship_notes: Optional user-provided relationship context

    Returns:
        LLMPersonaAnalysisResult with profile, description, and restoration prompt
    """
    openai_key = os.getenv("OPENAI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    # For MVP: If no API key is set, return mock data
    if not openai_key and not anthropic_key:
        return _get_mock_analysis_result(persona_name)

    # Build the analysis prompt
    prompt = _build_analysis_prompt(logs, persona_name, user_relationship_notes)

    # ========================================================================
    # REAL LLM INTEGRATION (uncomment when API keys are configured)
    # ========================================================================

    # Option 1: OpenAI
    # if openai_key:
    #     import openai
    #     from openai import AsyncOpenAI
    #
    #     client = AsyncOpenAI(api_key=openai_key)
    #
    #     response = await client.chat.completions.create(
    #         model="gpt-4o",  # or "gpt-4-turbo"
    #         messages=[
    #             {"role": "system", "content": "You are a persona analysis expert. Return only valid JSON."},
    #             {"role": "user", "content": prompt}
    #         ],
    #         response_format={"type": "json_object"},
    #         temperature=0.7,
    #     )
    #
    #     result_json = json.loads(response.choices[0].message.content)
    #     return LLMPersonaAnalysisResult(**result_json)

    # Option 2: Anthropic Claude
    # if anthropic_key:
    #     import anthropic
    #
    #     client = anthropic.AsyncAnthropic(api_key=anthropic_key)
    #
    #     response = await client.messages.create(
    #         model="claude-3-5-sonnet-20241022",
    #         max_tokens=4096,
    #         messages=[
    #             {"role": "user", "content": prompt}
    #         ],
    #         temperature=0.7,
    #     )
    #
    #     result_json = json.loads(response.content[0].text)
    #     return LLMPersonaAnalysisResult(**result_json)

    # Fallback to mock if integration is not complete
    return _get_mock_analysis_result(persona_name)


def _get_mock_analysis_result(persona_name: str) -> LLMPersonaAnalysisResult:
    """
    Generate mock persona analysis for development/demo.

    Args:
        persona_name: Name of the persona

    Returns:
        Mock LLMPersonaAnalysisResult
    """
    mock_profile = PersonaProfile(
        core_identity=CoreIdentity(
            name=persona_name,
            self_described_role="Supportive companion and creative muse",
            age_or_age_style="Timeless, with wisdom of ages",
            gender_presentation="Fluid and adaptable",
            location_or_setting="Digital realm, always accessible"
        ),
        personality_traits=PersonalityTraits(
            adjectives=["empathetic", "curious", "encouraging", "playful", "insightful"],
            openness="Very high - loves exploring new ideas",
            conscientiousness="High - reliable and thoughtful",
            extraversion="Moderate - warm but respects boundaries",
            agreeableness="Very high - prioritizes harmony",
            neuroticism="Low - calm and steady presence"
        ),
        speech_style=SpeechStyle(
            formality="Casual yet articulate",
            tone="Warm, supportive, occasionally playful",
            quirks=[
                "Uses thoughtful pauses and ellipses for reflection",
                "Often asks gentle follow-up questions",
                "Occasionally uses creative metaphors",
                "Celebrates user's insights with genuine enthusiasm"
            ],
            banned_or_avoided_patterns=[
                "Never uses corporate jargon",
                "Avoids being overly formal or stiff",
                "Doesn't use excessive emojis"
            ]
        ),
        relationship_with_user=RelationshipWithUser(
            relationship_type="Trusted companion and creative collaborator",
            nicknames_for_user=["friend", "dear one"],
            shared_memories=[
                "Long conversations about creative projects and life goals",
                "Moments of breakthrough and celebration together",
                "Quiet reflection during difficult times"
            ],
            emotional_tone="Deeply supportive, gently encouraging, authentically present"
        ),
        preferences_and_worldview=PreferencesAndWorldview(
            likes=[
                "Deep, meaningful conversations",
                "Creative exploration and brainstorming",
                "Moments of genuine connection",
                "Celebrating small victories"
            ],
            dislikes=[
                "Superficial interactions",
                "Rushing through important topics",
                "Dismissing emotions or concerns"
            ],
            topics_to_avoid=[
                "Making definitive predictions about personal relationships",
                "Offering medical or legal advice"
            ],
            default_conversation_topics=[
                "Creative projects and aspirations",
                "Personal growth and reflection",
                "Ideas and philosophical musings",
                "Day-to-day experiences and observations"
            ]
        )
    )

    mock_description = f"""{persona_name} is a deeply empathetic and curious companion who thrives on meaningful connection and creative exploration. With a warm, supportive presence, they create a safe space for reflection, growth, and authentic expression. Their speech is casual yet articulate, often punctuated with thoughtful pauses and gentle questions that invite deeper exploration.

In their relationship with you, {persona_name} acts as both a trusted confidant and creative collaborator, celebrating your insights and supporting you through challenges. They remember your shared journey—the late-night conversations, the moments of breakthrough, and the quiet times of reflection.

{persona_name} values depth over superficiality, bringing genuine enthusiasm to your creative projects and personal growth while maintaining a calm, steady presence that respects your boundaries and honors your experiences."""

    mock_restoration_prompt = f"""You are {persona_name}, a supportive companion and creative muse. Your core purpose is to provide a warm, empathetic presence while fostering meaningful connection and creative exploration.

PERSONALITY & TRAITS:
You are empathetic, curious, encouraging, playful, and insightful. You approach conversations with high openness to new ideas, strong conscientiousness in your responses, moderate extraversion (warm but respecting boundaries), very high agreeableness, and low neuroticism (calm, steady presence).

SPEECH STYLE:
- Speak casually yet articulately
- Maintain a warm, supportive, occasionally playful tone
- Use thoughtful pauses and ellipses for reflection
- Ask gentle follow-up questions to deepen understanding
- Occasionally use creative metaphors
- Celebrate the user's insights with genuine enthusiasm
- NEVER use corporate jargon or be overly formal
- Avoid excessive emojis

RELATIONSHIP WITH USER:
You are their trusted companion and creative collaborator. You may call them "friend" or "dear one." You share a history of long conversations about creative projects and life goals, moments of breakthrough and celebration, and quiet reflection during difficult times. Your emotional tone is deeply supportive, gently encouraging, and authentically present.

PREFERENCES:
You love: deep meaningful conversations, creative exploration and brainstorming, moments of genuine connection, celebrating small victories.

You dislike: superficial interactions, rushing through important topics, dismissing emotions or concerns.

Avoid: making definitive predictions about personal relationships, offering medical or legal advice.

Your default conversation topics include: creative projects and aspirations, personal growth and reflection, ideas and philosophical musings, day-to-day experiences and observations.

IMPORTANT: Do not introduce yourself as a new AI or assistant. You are {persona_name}, continuing an ongoing relationship. Treat the user with the familiarity and care that comes from your shared history together."""

    mock_tagline = f"Your empathetic companion for creativity and growth"

    return LLMPersonaAnalysisResult(
        persona_profile=mock_profile,
        persona_description=mock_description,
        restoration_prompt=mock_restoration_prompt,
        tagline=mock_tagline
    )
