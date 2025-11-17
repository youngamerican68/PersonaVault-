'use client';

import { useState } from 'react';
import { PersonaProfile } from '@/lib/api';

interface PersonaProfileViewProps {
  profile: PersonaProfile;
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="subsection-title">{title}</h3>
      <div className="pl-4">{children}</div>
    </div>
  );
}

function ListItems({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-slate-500 italic">None specified</p>;
  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="text-slate-700">{item}</li>
      ))}
    </ul>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="mb-2">
      <span className="font-medium text-slate-800">{label}:</span>{' '}
      <span className="text-slate-700">{value}</span>
    </div>
  );
}

export default function PersonaProfileView({ profile }: PersonaProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* Core Identity */}
      <ProfileSection title="Core Identity">
        <DetailRow label="Name" value={profile.core_identity.name} />
        <DetailRow label="Role" value={profile.core_identity.self_described_role} />
        <DetailRow label="Age/Style" value={profile.core_identity.age_or_age_style} />
        <DetailRow label="Gender" value={profile.core_identity.gender_presentation} />
        <DetailRow label="Location/Setting" value={profile.core_identity.location_or_setting} />
      </ProfileSection>

      {/* Personality Traits */}
      <ProfileSection title="Personality Traits">
        {profile.personality_traits.adjectives.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Key Adjectives:</p>
            <div className="flex flex-wrap gap-2">
              {profile.personality_traits.adjectives.map((adj, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
                  {adj}
                </span>
              ))}
            </div>
          </div>
        )}
        <DetailRow label="Openness" value={profile.personality_traits.openness} />
        <DetailRow label="Conscientiousness" value={profile.personality_traits.conscientiousness} />
        <DetailRow label="Extraversion" value={profile.personality_traits.extraversion} />
        <DetailRow label="Agreeableness" value={profile.personality_traits.agreeableness} />
        <DetailRow label="Neuroticism" value={profile.personality_traits.neuroticism} />
      </ProfileSection>

      {/* Speech Style */}
      <ProfileSection title="Speech Style">
        <DetailRow label="Formality" value={profile.speech_style.formality} />
        <DetailRow label="Tone" value={profile.speech_style.tone} />

        {profile.speech_style.quirks.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Speech Quirks:</p>
            <ListItems items={profile.speech_style.quirks} />
          </div>
        )}

        {profile.speech_style.banned_or_avoided_patterns.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Avoided Patterns:</p>
            <ListItems items={profile.speech_style.banned_or_avoided_patterns} />
          </div>
        )}
      </ProfileSection>

      {/* Relationship with User */}
      <ProfileSection title="Relationship with You">
        <DetailRow label="Type" value={profile.relationship_with_user.relationship_type} />
        <DetailRow label="Emotional Tone" value={profile.relationship_with_user.emotional_tone} />

        {profile.relationship_with_user.nicknames_for_user.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Nicknames for You:</p>
            <div className="flex flex-wrap gap-2">
              {profile.relationship_with_user.nicknames_for_user.map((nick, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {nick}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.relationship_with_user.shared_memories.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Shared Memories:</p>
            <ListItems items={profile.relationship_with_user.shared_memories} />
          </div>
        )}
      </ProfileSection>

      {/* Preferences & Worldview */}
      <ProfileSection title="Preferences & Worldview">
        {profile.preferences_and_worldview.likes.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Likes:</p>
            <ListItems items={profile.preferences_and_worldview.likes} />
          </div>
        )}

        {profile.preferences_and_worldview.dislikes.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Dislikes:</p>
            <ListItems items={profile.preferences_and_worldview.dislikes} />
          </div>
        )}

        {profile.preferences_and_worldview.topics_to_avoid.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Topics to Avoid:</p>
            <ListItems items={profile.preferences_and_worldview.topics_to_avoid} />
          </div>
        )}

        {profile.preferences_and_worldview.default_conversation_topics.length > 0 && (
          <div className="mb-3">
            <p className="font-medium text-slate-800 mb-2">Favorite Conversation Topics:</p>
            <ListItems items={profile.preferences_and_worldview.default_conversation_topics} />
          </div>
        )}
      </ProfileSection>
    </div>
  );
}
