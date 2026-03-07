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
  Alta: '#f87171',
  Média: '#fbbf24',
  Baixa: '#34d399',
}

const COL_CONFIG: Record<IdeiaStatus, { color: string; badge: string }> = {
  Rascunho: { color: '#6B7280', badge: 'badge-gray' },
  Refinando: { color: '#f59e0b', badge: 'badge-yellow' },
  Pronta: { color: '#10b981', badge: 'badge-green' },
}

function emptyForm() {
  return { titulo: '', descricao: '', categoria: 'Produto', prioridade: 'Média' as Prioridade, status: 'Rascunho' as IdeiaStatus }
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6,
  fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase',
}

export default function IdeiasPage() {
  const [ideias, setIdeias] = useState<Ideia[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Ideia | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<IdeiaStatus | null>(null)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('ideias').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setIdeias(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setForm(emptyForm()); setModal(true) }
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
    setSaving(false); setModal(false); load()
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12, color: 'var(--text-muted)' }}>
      <div style={{ width: 18, height: 18, border: '2px solid var(--border-strong)', borderTopColor: 'var(--accent)', borderRadius: '50%' }} className="animate-spin" />
      Carregando ideias...
    </div>
  )

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <span className="section-label" style={{ marginBottom: 12, display: 'inline-flex' }}>IDEIAS</span>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            Banco de Ideias
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            {ideias.length} ideia{ideias.length !== 1 ? 's' : ''} — Capture, refine e execute.
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nova Ideia
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {COLUNAS.map(col => {
          const config = COL_CONFIG[col]
          const cards = byStatus(col)
          const isOver = dragOver === col

          return (
            <div
              key={col}
              style={{
                background: isOver ? 'rgba(59,91,219,0.04)' : 'var(--card-bg)',
                border: `1px solid ${isOver ? 'rgba(59,91,219,0.35)' : 'var(--card-border)'}`,
                borderRadius: 14,
                padding: 16,
                minHeight: 420,
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onDragOver={e => { e.preventDefault(); setDragOver(col) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => {
                e.preventDefault()
                if (dragging) moveCard(dragging, col)
                setDragging(null); setDragOver(null)
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: config.color }} />
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                    {col}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 700,
                  background: 'rgba(59,91,219,0.1)', color: 'var(--text-muted)',
                  borderRadius: 20, padding: '2px 10px',
                }}>
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cards.map(ideia => (
                  <div
                    key={ideia.id}
                    draggable
                    onDragStart={() => setDragging(ideia.id)}
                    onDragEnd={() => { setDragging(null); setDragOver(null) }}
                    className="glass-card"
                    style={{
                      padding: '14px 14px',
                      cursor: 'grab',
                      opacity: dragging === ideia.id ? 0.4 : 1,
                      transition: 'opacity 0.15s',
                      position: 'relative',
                    }}
                  >
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: ideia.descricao ? 8 : 10 }}>
                      <GripVertical size={12} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', flex: 1, lineHeight: 1.4 }}>
                        {ideia.titulo}
                      </span>
                      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                        <button className="btn-ghost" onClick={() => openEdit(ideia)} style={{ padding: '3px 5px' }}>
                          <Pencil size={11} />
                        </button>
                        <button className="btn-ghost" onClick={() => remove(ideia.id)} style={{ padding: '3px 5px', color: '#f87171' }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>

                    {ideia.descricao && (
                      <p style={{
                        fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        marginLeft: 20,
                      }}>
                        {ideia.descricao}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 20 }}>
                      <span style={{
                        fontSize: 11, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600,
                        background: 'rgba(59,91,219,0.08)', color: 'var(--text-secondary)',
                        borderRadius: 6, padding: '2px 8px',
                      }}>
                        {ideia.categoria}
                      </span>
                      <span style={{
                        fontSize: 11, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                        background: PRIORIDADE_COLOR[ideia.prioridade] + '18',
                        color: PRIORIDADE_COLOR[ideia.prioridade],
                        borderRadius: 6, padding: '2px 8px',
                      }}>
                        {ideia.prioridade}
                      </span>
                    </div>
                  </div>
                ))}

                {cards.length === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', textAlign: 'center' }}>
                    <Lightbulb size={22} color="var(--text-muted)" style={{ opacity: 0.4, marginBottom: 8 }} />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Arraste ideias aqui</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Ideia' : 'Nova Ideia'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Título *</label>
            <input className="input-field" placeholder="O que veio na sua cabeça?" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Descrição</label>
            <textarea className="input-field" rows={4} placeholder="Desenvolva a ideia, contexto, como poderia funcionar..." value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Categoria</label>
              <select className="input-field" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Prioridade</label>
              <select className="input-field" value={form.prioridade} onChange={e => setForm({ ...form, prioridade: e.target.value as Prioridade })}>
                {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as IdeiaStatus })}>
                {COLUNAS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={!form.titulo || saving}>
              {saving ? 'Salvando...' : editing ? 'Salvar' : 'Criar Ideia'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
