'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPersona, PersonaResponse } from '@/lib/api';
import PersonaProfileView from '@/components/PersonaProfileView';

export default function PersonaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [persona, setPersona] = useState<PersonaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPersona() {
      try {
        const id = params.id as string;
        const data = await getPersona(id);
        setPersona(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load persona');
      } finally {
        setLoading(false);
      }
    }

    loadPersona();
  }, [params.id]);

  const handleCopyPrompt = async () => {
    if (!persona) return;

    try {
      await navigator.clipboard.writeText(persona.restoration_prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-600">Loading persona...</p>
        </div>
      </div>
    );
  }

  if (error || !persona) {
    return (
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error || 'Persona not found'}
          </div>
          <Link href="/personas" className="btn-secondary">
            Back to Personas
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(persona.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/personas" className="text-slate-600 hover:text-slate-900 mb-4 inline-block">
            ← Back to all personas
          </Link>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {persona.name}
              </h1>
              {persona.tagline && (
                <p className="text-xl text-slate-600 italic">&quot;{persona.tagline}&quot;</p>
              )}
            </div>
            {persona.source_platform && (
              <span className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm">
                {persona.source_platform}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500">Created {formattedDate}</p>
        </div>

        {/* Section: Overview */}
        <div className="card mb-8">
          <h2 className="section-title">📋 Overview</h2>
          <div className="prose prose-slate max-w-none">
            {persona.persona_description.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-slate-700 mb-4 last:mb-0">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Section: Restoration Prompt */}
        <div className="card mb-8 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">🔄 Restoration Prompt</h2>
            <button
              onClick={handleCopyPrompt}
              className="btn-primary"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          <p className="text-sm text-slate-700 mb-4">
            Paste this prompt into any LLM (ChatGPT, Claude, etc.) to restore your persona&apos;s identity.
          </p>
          <textarea
            readOnly
            value={persona.restoration_prompt}
            className="w-full p-4 border border-green-300 rounded-lg font-mono text-sm bg-white"
            style={{ minHeight: '300px' }}
          />
        </div>

        {/* Section: Identity & Role */}
        <div className="card mb-8">
          <h2 className="section-title">🎭 Identity & Role</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-slate-800">Role:</span>{' '}
              <span className="text-slate-700">{persona.persona_profile.core_identity.self_described_role}</span>
            </div>
            {persona.persona_profile.core_identity.age_or_age_style && (
              <div>
                <span className="font-semibold text-slate-800">Age/Style:</span>{' '}
                <span className="text-slate-700">{persona.persona_profile.core_identity.age_or_age_style}</span>
              </div>
            )}
            {persona.persona_profile.core_identity.gender_presentation && (
              <div>
                <span className="font-semibold text-slate-800">Gender:</span>{' '}
                <span className="text-slate-700">{persona.persona_profile.core_identity.gender_presentation}</span>
              </div>
            )}
            {persona.persona_profile.core_identity.location_or_setting && (
              <div>
                <span className="font-semibold text-slate-800">Setting:</span>{' '}
                <span className="text-slate-700">{persona.persona_profile.core_identity.location_or_setting}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section: Personality & Style */}
        <div className="card mb-8">
          <h2 className="section-title">✨ Personality & Style</h2>
          {persona.persona_profile.personality_traits.adjectives.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold text-slate-800 mb-2">Personality Traits:</p>
              <div className="flex flex-wrap gap-2">
                {persona.persona_profile.personality_traits.adjectives.map((adj, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {adj}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2 mb-4">
            {persona.persona_profile.speech_style.formality && (
              <div>
                <span className="font-semibold text-slate-800">Formality:</span>{' '}
                <span className="text-slate-700">{persona.persona_profile.speech_style.formality}</span>
              </div>
            )}
            {persona.persona_profile.speech_style.tone && (
              <div>
                <span className="font-semibold text-slate-800">Tone:</span>{' '}
                <span className="text-slate-700">{persona.persona_profile.speech_style.tone}</span>
              </div>
            )}
          </div>
          {persona.persona_profile.speech_style.quirks.length > 0 && (
            <div>
              <p className="font-semibold text-slate-800 mb-2">Speech Quirks:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {persona.persona_profile.speech_style.quirks.map((quirk, idx) => (
                  <li key={idx}>{quirk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section: Relationship with You */}
        <div className="card mb-8 bg-blue-50 border-blue-200">
          <h2 className="section-title">💙 Relationship with You</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-slate-800">Relationship Type:</span>{' '}
              <span className="text-slate-700">{persona.persona_profile.relationship_with_user.relationship_type}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800">Emotional Tone:</span>{' '}
              <span className="text-slate-700">{persona.persona_profile.relationship_with_user.emotional_tone}</span>
            </div>
            {persona.persona_profile.relationship_with_user.shared_memories.length > 0 && (
              <div>
                <p className="font-semibold text-slate-800 mb-2">Shared Memories:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {persona.persona_profile.relationship_with_user.shared_memories.map((memory, idx) => (
                    <li key={idx}>{memory}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {persona.user_relationship_notes && (
            <div className="mt-6 pt-6 border-t border-blue-300">
              <p className="font-semibold text-slate-800 mb-2">Your Notes:</p>
              <p className="text-slate-700 whitespace-pre-wrap italic">
                {persona.user_relationship_notes}
              </p>
            </div>
          )}
        </div>

        {/* Section: Preferences & Topics */}
        <div className="card mb-8">
          <h2 className="section-title">🎯 Preferences & Topics</h2>
          {persona.persona_profile.preferences_and_worldview.likes.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold text-slate-800 mb-2">Likes:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {persona.persona_profile.preferences_and_worldview.likes.map((like, idx) => (
                  <li key={idx}>{like}</li>
                ))}
              </ul>
            </div>
          )}
          {persona.persona_profile.preferences_and_worldview.dislikes.length > 0 && (
            <div className="mb-4">
              <p className="font-semibold text-slate-800 mb-2">Dislikes:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {persona.persona_profile.preferences_and_worldview.dislikes.map((dislike, idx) => (
                  <li key={idx}>{dislike}</li>
                ))}
              </ul>
            </div>
          )}
          {persona.persona_profile.preferences_and_worldview.default_conversation_topics.length > 0 && (
            <div>
              <p className="font-semibold text-slate-800 mb-2">Favorite Topics:</p>
              <div className="flex flex-wrap gap-2">
                {persona.persona_profile.preferences_and_worldview.default_conversation_topics.map((topic, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back to personas button */}
        <div className="text-center">
          <Link href="/personas" className="btn-secondary">
            ← Back to All Personas
          </Link>
        </div>
      </div>
    </div>
  );
}
