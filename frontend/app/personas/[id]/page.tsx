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

        {/* Persona Description */}
        <div className="card mb-8">
          <h2 className="section-title">About This Persona</h2>
          <div className="prose prose-slate max-w-none">
            {persona.persona_description.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-slate-700 mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* User Relationship Notes */}
        {persona.user_relationship_notes && (
          <div className="card mb-8 bg-blue-50 border-blue-200">
            <h2 className="section-title">Your Relationship Notes</h2>
            <p className="text-slate-700 whitespace-pre-wrap">
              {persona.user_relationship_notes}
            </p>
          </div>
        )}

        {/* Restoration Prompt */}
        <div className="card mb-8 bg-green-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Restoration Prompt</h2>
            <button
              onClick={handleCopyPrompt}
              className="btn-primary"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Paste this prompt into any LLM (ChatGPT, Claude, etc.) to restore your persona&apos;s identity.
          </p>
          <textarea
            readOnly
            value={persona.restoration_prompt}
            className="w-full p-4 border border-green-300 rounded-lg font-mono text-sm bg-white"
            style={{ minHeight: '300px' }}
          />
        </div>

        {/* Detailed Profile */}
        <div className="card">
          <h2 className="section-title">Detailed Persona Profile</h2>
          <PersonaProfileView profile={persona.persona_profile} />
        </div>
      </div>
    </div>
  );
}
