import Link from 'next/link';
import { listPersonas } from '@/lib/api';
import PersonaCard from '@/components/PersonaCard';

export const dynamic = 'force-dynamic'; // Disable static generation for session-based data

export default async function PersonasPage() {
  let personas;
  let error = null;

  try {
    personas = await listPersonas();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load personas';
    personas = [];
  }

  return (
    <div className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              My Persona Backups
            </h1>
            <p className="text-slate-600">
              All your saved AI persona identities
            </p>
          </div>
          <Link href="/" className="btn-primary">
            Create New Backup
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {personas.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-600 text-lg mb-4">
              You haven&apos;t created any persona backups yet.
            </p>
            <Link href="/" className="btn-primary inline-block">
              Create Your First Backup
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personas.map((persona) => (
              <PersonaCard key={persona.id} persona={persona} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
