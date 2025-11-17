import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Persona Vault',
  description: 'Back up and restore your AI persona identities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-slate-900 text-white py-4 px-6 shadow-lg">
            <nav className="max-w-6xl mx-auto flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold hover:text-slate-300 transition">
                Persona Vault
              </Link>
              <div className="flex gap-6">
                <Link href="/" className="hover:text-slate-300 transition">
                  Home
                </Link>
                <Link href="/personas" className="hover:text-slate-300 transition">
                  My Personas
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-slate-100 py-6 px-6 text-slate-600 text-sm border-t border-slate-300">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-4">
                <p className="font-semibold">Persona Vault - Your AI personas, preserved and portable</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 max-w-4xl mx-auto">
                <p className="font-semibold mb-2">⚠️ Privacy & Safety Notice</p>
                <p>
                  Persona Vault analyzes chat logs that may contain personal information.
                  This tool is for personal use only and does not provide legal, medical, or mental health advice.
                  Do not paste highly sensitive information (passwords, financial data, etc.).
                  Backups are stored on this server; use at your own discretion.
                </p>
              </div>

              <div className="text-center mt-4 text-xs text-slate-500">
                <p>v0.1.0</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
