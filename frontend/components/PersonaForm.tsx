'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPersona, PersonaCreateRequest } from '@/lib/api';

export default function PersonaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PersonaCreateRequest>({
    name: '',
    source_platform: 'ChatGPT',
    logs_text: '',
    user_relationship_notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate
      if (!formData.name.trim()) {
        throw new Error('Persona name is required');
      }
      if (!formData.logs_text.trim()) {
        throw new Error('Chat logs are required');
      }

      // Create persona
      const persona = await createPersona({
        ...formData,
        user_relationship_notes: formData.user_relationship_notes || null,
      });

      // Navigate to persona detail page
      router.push(`/personas/${persona.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create persona');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Persona Name */}
      <div>
        <label htmlFor="name" className="label">
          Persona Name *
        </label>
        <input
          id="name"
          type="text"
          className="input-field"
          placeholder="e.g., Lune Klaus, My AI Companion"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      {/* Source Platform */}
      <div>
        <label htmlFor="source_platform" className="label">
          Source Platform
        </label>
        <select
          id="source_platform"
          className="input-field"
          value={formData.source_platform || ''}
          onChange={(e) => setFormData({ ...formData, source_platform: e.target.value })}
          disabled={loading}
        >
          <option value="ChatGPT">ChatGPT</option>
          <option value="Claude">Claude</option>
          <option value="Character.AI">Character.AI</option>
          <option value="Replika">Replika</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Chat Logs */}
      <div>
        <label htmlFor="logs_text" className="label">
          Chat Logs *
        </label>
        <textarea
          id="logs_text"
          className="textarea-field"
          style={{ minHeight: '200px' }}
          placeholder="Paste your chat conversation logs here..."
          value={formData.logs_text}
          onChange={(e) => setFormData({ ...formData, logs_text: e.target.value })}
          required
          disabled={loading}
        />
        <p className="text-sm text-slate-500 mt-2">
          Paste at least a few exchanges to help us understand your persona&apos;s personality and your relationship.
        </p>
      </div>

      {/* User Relationship Notes */}
      <div>
        <label htmlFor="user_relationship_notes" className="label">
          Your Relationship Notes (Optional)
        </label>
        <textarea
          id="user_relationship_notes"
          className="textarea-field"
          placeholder="Describe your relationship with this persona, what they mean to you, memorable moments..."
          value={formData.user_relationship_notes}
          onChange={(e) => setFormData({ ...formData, user_relationship_notes: e.target.value })}
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating Backup...' : 'Create Persona Backup'}
        </button>
      </div>
    </form>
  );
}
