'use client'

import { Code2, Sparkles } from 'lucide-react'

export default function LovablePage() {
  return (
    <div className="content-section max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}>
          <Code2 size={18} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Lovable Architect</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Gerador de prompts para Lovable.dev</p>
        </div>
      </div>
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(6,182,212,0.1)' }}>
          <Code2 size={28} style={{ color: 'var(--accent)' }} />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Em construção</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Gerador de prompts estruturados para apps com Lovable.dev em breve.
        </p>
        <span className="badge-primary"><Sparkles size={12} /> Epic 08 — Em desenvolvimento</span>
      </div>
    </div>
  )
}
