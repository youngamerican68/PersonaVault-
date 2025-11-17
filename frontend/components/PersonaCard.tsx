import Link from 'next/link';
import { PersonaListItem } from '@/lib/api';

interface PersonaCardProps {
  persona: PersonaListItem;
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  const formattedDate = new Date(persona.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/personas/${persona.id}`} className="card block hover:border-slate-400">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-slate-900">{persona.name}</h3>
          {persona.source_platform && (
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
              {persona.source_platform}
            </span>
          )}
        </div>

        {persona.tagline && (
          <p className="text-slate-600 italic">&quot;{persona.tagline}&quot;</p>
        )}

        <p className="text-sm text-slate-500 mt-2">Created {formattedDate}</p>
      </div>
    </Link>
  );
}
