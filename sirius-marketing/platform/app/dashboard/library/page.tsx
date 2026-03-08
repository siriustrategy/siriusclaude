'use client'

import { Library, Sparkles } from 'lucide-react'

export default function LibraryPage() {
  return (
    <div className="content-section max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
          <Library size={18} style={{ color: 'var(--primary-light)' }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Library</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Seu acervo de conteúdos e assets</p>
        </div>
      </div>
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(124,58,237,0.1)' }}>
          <Library size={28} style={{ color: 'var(--primary-light)' }} />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Em construção</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Biblioteca de conteúdos, templates e assets da marca em breve.
        </p>
        <span className="badge-primary"><Sparkles size={12} /> Em desenvolvimento</span>
      </div>
    </div>
  )
}
