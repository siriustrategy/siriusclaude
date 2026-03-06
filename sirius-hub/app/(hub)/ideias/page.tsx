'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Ideia, IdeiaStatus, Prioridade } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import { Plus, Lightbulb, Pencil, Trash2, GripVertical } from 'lucide-react'

const COLUNAS: IdeiaStatus[] = ['Rascunho', 'Refinando', 'Pronta']
const CATEGORIAS = ['Produto', 'Automação', 'Negócio', 'Pessoal', 'Estudo', 'Tecnologia', 'Outro']
const PRIORIDADES: Prioridade[] = ['Alta', 'Média', 'Baixa']

const PRIORIDADE_COLOR: Record<Prioridade, string> = {
  Alta: 'var(--danger)',
  Média: 'var(--warning)',
  Baixa: 'var(--success)',
}

const COL_COLOR: Record<IdeiaStatus, string> = {
  Rascunho: '#6B7280',
  Refinando: 'var(--warning)',
  Pronta: 'var(--success)',
}

function emptyForm() {
  return { titulo: '', descricao: '', categoria: 'Produto', prioridade: 'Média' as Prioridade, status: 'Rascunho' as IdeiaStatus }
}

export default function IdeiasPage() {
  const [ideias, setIdeias] = useState<Ideia[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Ideia | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('ideias')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setIdeias(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditing(null)
    setForm(emptyForm())
    setModal(true)
  }

  function openEdit(i: Ideia) {
    setEditing(i)
    setForm({ titulo: i.titulo, descricao: i.descricao, categoria: i.categoria, prioridade: i.prioridade, status: i.status })
    setModal(true)
  }

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (editing) {
      await supabase.from('ideias').update(form).eq('id', editing.id)
    } else {
      await supabase.from('ideias').insert({ ...form, user_id: user.id })
    }
    setSaving(false)
    setModal(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir esta ideia?')) return
    await supabase.from('ideias').delete().eq('id', id)
    load()
  }

  async function moveCard(id: string, status: IdeiaStatus) {
    await supabase.from('ideias').update({ status }).eq('id', id)
    setIdeias(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  const byStatus = (s: IdeiaStatus) => ideias.filter(i => i.status === s)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="spinner" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb size={24} color="var(--accent)" />
            Banco de Ideias
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {ideias.length} ideias — Kanban de captura e refinamento
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openNew}>
          <Plus size={16} />
          Nova Ideia
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUNAS.map(col => (
          <div
            key={col}
            className="rounded-xl p-4 space-y-3"
            style={{ background: 'var(--surface)', border: `1px solid var(--border)`, minHeight: 400 }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              if (dragging) moveCard(dragging, col)
              setDragging(null)
            }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: COL_COLOR[col] }} />
                <span className="font-semibold text-sm text-white">{col}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                {byStatus(col).length}
              </span>
            </div>

            {/* Cards */}
            {byStatus(col).map(ideia => (
              <div
                key={ideia.id}
                draggable
                onDragStart={() => setDragging(ideia.id)}
                onDragEnd={() => setDragging(null)}
                className="rounded-lg p-3 space-y-2 cursor-grab active:cursor-grabbing group"
                style={{
                  background: 'var(--bg-elevated)',
                  border: `1px solid var(--border)`,
                  opacity: dragging === ideia.id ? 0.4 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <GripVertical size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span className="font-medium text-sm text-white leading-tight">{ideia.titulo}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEdit(ideia)} className="p-1 rounded hover:bg-white/10">
                      <Pencil size={12} style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <button onClick={() => remove(ideia.id)} className="p-1 rounded hover:bg-white/10">
                      <Trash2 size={12} color="var(--danger)" />
                    </button>
                  </div>
                </div>

                {ideia.descricao && (
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                    {ideia.descricao}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}>
                    {ideia.categoria}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                    background: PRIORIDADE_COLOR[ideia.prioridade] + '20',
                    color: PRIORIDADE_COLOR[ideia.prioridade],
                  }}>
                    {ideia.prioridade}
                  </span>
                </div>
              </div>
            ))}

            {byStatus(col).length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Lightbulb size={24} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Arraste ideias aqui</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Ideia' : 'Nova Ideia'}>
        <div className="space-y-4">
          <div>
            <label className="label">Título *</label>
            <input className="input" placeholder="O que veio na sua cabeça?" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea className="input" rows={4} placeholder="Desenvolva a ideia, contexto, como poderia funcionar..." value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Categoria</label>
              <select className="input" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Prioridade</label>
              <select className="input" value={form.prioridade} onChange={e => setForm({ ...form, prioridade: e.target.value as Prioridade })}>
                {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as IdeiaStatus })}>
                {COLUNAS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary flex-1" onClick={save} disabled={!form.titulo || saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
