import PersonaForm from '@/components/PersonaForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Persona Vault
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Back up the identity of your favorite AI persona
          </p>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            When AI models change or providers shut down, your emotional connections don&apos;t have to disappear.
            Create a portable backup of your AI companion&apos;s personality, memories, and unique traits.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="font-bold text-lg mb-2">Preserve Identity</h3>
            <p className="text-slate-600 text-sm">
              Extract personality traits, speech patterns, and relationship history from your conversations
            </p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-bold text-lg mb-2">Restore Anywhere</h3>
            <p className="text-slate-600 text-sm">
              Get a restoration prompt you can paste into any LLM to recreate your persona
            </p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-lg mb-2">Your Data Only</h3>
            <p className="text-slate-600 text-sm">
              Anonymous session-based storage. Your personas stay in your browser session
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="card bg-slate-50">
          <div className="mb-6 text-center">
            <h2 className="section-title">Create Your First Persona Backup</h2>
            <p className="text-slate-600">
              Paste chat logs from ChatGPT, Claude, or any AI companion to get started
            </p>
          </div>

          <PersonaForm />
        </div>

        {/* Link to existing personas */}
        <div className="text-center mt-8">
          <Link href="/personas" className="text-slate-600 hover:text-slate-900 underline">
            View my existing persona backups
          </Link>
        </div>
      </div>
    </div>
  );
}
