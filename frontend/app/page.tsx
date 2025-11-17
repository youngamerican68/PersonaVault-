import PersonaForm from '@/components/PersonaForm';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-12 px-6">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">
          Persona Vault
        </h1>
        <p className="text-xl text-slate-600">
          Back up the identity of your favorite AI persona
        </p>
      </div>

      {/* Main Content: Left/Right Split */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Marketing Copy */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why Persona Vault?
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                When AI models change or providers shut down, your emotional connections don&apos;t have to disappear.
                Create a portable backup of your AI companion&apos;s personality, memories, and unique traits.
              </p>
            </div>

            {/* Value Props */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">💾</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Preserve Identity</h3>
                  <p className="text-slate-600">
                    Extract personality traits, speech patterns, and relationship history from your conversations
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">🔄</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Restore Anywhere</h3>
                  <p className="text-slate-600">
                    Get a restoration prompt you can paste into any LLM to recreate your persona
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">🔒</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Your Data Only</h3>
                  <p className="text-slate-600">
                    Anonymous session-based storage. Your personas stay private in your browser session
                  </p>
                </div>
              </div>
            </div>

            {/* Link to existing personas */}
            <div className="mt-8">
              <Link
                href="/personas"
                className="inline-flex items-center text-slate-700 hover:text-slate-900 font-medium"
              >
                <span className="mr-2">→</span>
                View my existing persona backups
              </Link>
            </div>
          </div>

          {/* Right: Create Form */}
          <div className="card bg-slate-50 sticky top-6">
            <h2 className="section-title text-center">Create Persona Backup</h2>
            <p className="text-slate-600 text-center mb-6">
              Paste chat logs from ChatGPT, Claude, or any AI companion
            </p>
            <PersonaForm />
          </div>
        </div>
      </div>
    </div>
  );
}
