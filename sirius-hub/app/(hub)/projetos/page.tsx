'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Projeto, ProjetoStatus } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import {
  Plus, FolderOpen, ExternalLink, LayoutGrid, List,
  Filter, Pencil, Trash2, Clock, TrendingUp,
} from 'lucide-react'

const STATUS_COLORS: Record<string, { badge: string, dot: string }> = {
  'Planejamento': { badge: 'badge-gray',   dot: '#4A5680' },
  'Em andamento': { badge: 'badge-blue',   dot: '#3B5BDB' },
  'Ativo':        { badge: 'badge-green',  dot: '#10b981' },
  'Pausado':      { badge: 'badge-yellow', dot: '#f59e0b' },
  'Concluído':    { badge: 'badge-purple', dot: '#7C3AED' },
}

const STATUS_LIST: ProjetoStatus[] = ['Planejamento', 'Em andamento', 'Ativo', 'Pausado', 'Concluído']

function emptyForm() {
  return { nome: '', empresa: '', descricao: '', status: 'Em andamento' as ProjetoStatus, score: 0, horas_investidas: 0, data_inicio: '', tags: '', link_externo: '' }
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filtroEmpresa, setFiltroEmpresa] = useState('Todos')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState<Projeto | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('projetos').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setProjetos(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const empresas = ['Todos', ...Array.from(new Set(projetos.map(p => p.empresa).filter(Boolean)))]

  const filtrados = projetos.filter(p => {
    if (filtroEmpresa !== 'Todos' && p.empresa !== filtroEmpresa) return false
    if (filtroStatus !== 'Todos' && p.status !== filtroStatus) return false
    return true
  })

  function openNew() { setForm(emptyForm()); setEditando(null); setModal(true) }
  function openEdit(p: Projeto) {
    setForm({ nome: p.nome, empresa: p.empresa, descricao: p.descricao, status: p.status, score: p.score, horas_investidas: p.horas_investidas, data_inicio: p.data_inicio || '', tags: p.tags?.join(', ') || '', link_externo: p.link_externo || '' })
    setEditando(p); setModal(true)
  }

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = {
      nome: form.nome, empresa: form.empresa, descricao: form.descricao,
      status: form.status, score: Number(form.score),
      horas_investidas: Number(form.horas_investidas),
      data_inicio: form.data_inicio || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      link_externo: form.link_externo, user_id: user.id,
    }
    if (editando) {
      await supabase.from('projetos').update(payload).eq('id', editando.id)
    } else {
      await supabase.from('projetos').insert(payload)
    }
    setSaving(false); setModal(false); load()
  }

  async function remove(id: string) {
    if (!confirm('Remover este projeto?')) return
    await supabase.from('projetos').delete().eq('id', id)
    load()
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Carregando projetos...</div>

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>PROJETOS</div>
          <h1 className="page-title">Meus Projetos</h1>
          <p className="page-subtitle">{projetos.length} projeto{projetos.length !== 1 ? 's' : ''} cadastrado{projetos.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Novo Projeto
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select className="input-field" style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: 13 }}
            value={filtroEmpresa} onChange={e => setFiltroEmpresa(e.target.value)}>
            {empresas.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <select className="input-field" style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: 13 }}
          value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
          {['Todos', ...STATUS_LIST].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button className={`btn-ghost ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} style={{ color: view === 'grid' ? 'var(--accent)' : undefined }}>
            <LayoutGrid size={16} />
          </button>
          <button className={`btn-ghost ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} style={{ color: view === 'list' ? 'var(--accent)' : undefined }}>
            <List size={16} />
          </button>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={40} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: 15, marginBottom: 8 }}>Nenhum projeto encontrado</p>
          <button className="btn-primary" onClick={openNew}><Plus size={14} /> Criar primeiro projeto</button>
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtrados.map(p => <ProjetoCard key={p.id} projeto={p} onEdit={() => openEdit(p)} onDelete={() => remove(p.id)} />)}
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Projeto', 'Empresa', 'Status', 'Score', 'Horas', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{p.nome}</div>
                    {p.tags?.length > 0 && <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                      {p.tags.slice(0, 2).map(t => <span key={t} className="badge badge-gray" style={{ fontSize: 10 }}>{t}</span>)}
                    </div>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.empresa}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${STATUS_COLORS[p.status]?.badge || 'badge-gray'}`}>{p.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar-track" style={{ width: 60 }}>
                        <div className="progress-bar-fill" style={{ width: `${p.score}%` }} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.score}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.horas_investidas}h</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {p.link_externo && <a href={p.link_externo} target="_blank" rel="noreferrer" className="btn-ghost"><ExternalLink size={14} /></a>}
                      <button className="btn-ghost" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                      <button className="btn-ghost" onClick={() => remove(p.id)} style={{ color: '#f87171' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editando ? 'Editar Projeto' : 'Novo Projeto'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Nome do Projeto</label>
              <input className="input-field" placeholder="Ex: Sirius Hub" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Empresa</label>
              <input className="input-field" placeholder="Ex: Sirius Strategy" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Descrição</label>
            <textarea className="input-field" placeholder="O que é este projeto?" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ProjetoStatus })}>
                {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Score / Progresso (%)</label>
              <input type="number" min={0} max={100} className="input-field" value={form.score} onChange={e => setForm({ ...form, score: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Horas Investidas</label>
              <input type="number" min={0} className="input-field" value={form.horas_investidas} onChange={e => setForm({ ...form, horas_investidas: Number(e.target.value) })} />
            </div>
            <div>
              <label style={labelStyle}>Data de Início</label>
              <input type="date" className="input-field" value={form.data_inicio} onChange={e => setForm({ ...form, data_inicio: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Tags (separadas por vírgula)</label>
            <input className="input-field" placeholder="Ex: IA, Next.js, Automação" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Link do Dashboard Externo</label>
            <input className="input-field" placeholder="https://..." value={form.link_externo} onChange={e => setForm({ ...form, link_externo: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving || !form.nome}>
              {saving ? 'Salvando...' : editando ? 'Salvar' : 'Criar Projeto'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ProjetoCard({ projeto: p, onEdit, onDelete }: { projeto: Projeto, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nome}</h3>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.empresa}</span>
        </div>
        <span className={`badge ${STATUS_COLORS[p.status]?.badge || 'badge-gray'}`} style={{ marginLeft: 8, flexShrink: 0 }}>{p.status}</span>
      </div>

      {p.descricao && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.descricao}</p>}

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>Score</span>
          <span style={{ fontWeight: 600, color: p.score >= 80 ? '#10b981' : p.score >= 50 ? '#f59e0b' : 'var(--text-secondary)' }}>{p.score}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${p.score}%` }} />
        </div>
      </div>

      {p.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
          {p.tags.slice(0, 3).map(t => <span key={t} className="badge badge-gray" style={{ fontSize: 10 }}>{t}</span>)}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <Clock size={13} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>{p.horas_investidas}h investidas</span>
        <div style={{ display: 'flex', gap: 2 }}>
          {p.link_externo && <a href={p.link_externo} target="_blank" rel="noreferrer" className="btn-ghost"><ExternalLink size={13} /></a>}
          <button className="btn-ghost" onClick={onEdit}><Pencil size={13} /></button>
          <button className="btn-ghost" onClick={onDelete} style={{ color: '#f87171' }}><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: 'var(--text-muted)', marginBottom: 6,
  fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em',
  textTransform: 'uppercase',
}
