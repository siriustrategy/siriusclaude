'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Estudo, EstudoStatus } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import { Plus, BookOpen, ExternalLink, Pencil, Trash2, Filter, Award } from 'lucide-react'

const STATUS_LIST: EstudoStatus[] = ['A fazer', 'Em andamento', 'Concluído']
const CATEGORIAS = ['IA', 'Desenvolvimento', 'Design', 'Automação', 'Marketing', 'Negócios', 'Outro']
const PLATAFORMAS = ['YouTube', 'Udemy', 'Coursera', 'Cohort', 'Hotmart', 'LinkedIn Learning', 'Outro']

const STATUS_BADGE: Record<string, string> = {
  'A fazer': 'badge-gray',
  'Em andamento': 'badge-blue',
  'Concluído': 'badge-green',
}

const CAT_BADGE: Record<string, string> = {
  'IA': 'badge-purple',
  'Desenvolvimento': 'badge-blue',
  'Design': 'badge-yellow',
  'Automação': 'badge-green',
  'Marketing': 'badge-red',
  'Negócios': 'badge-gray',
}

function emptyForm() {
  return { titulo: '', plataforma: 'YouTube', link: '', carga_horaria: 0, progresso: 0, status: 'A fazer' as EstudoStatus, categoria: 'IA' }
}

export default function EstudosPage() {
  const [estudos, setEstudos] = useState<Estudo[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [filtroCategoria, setFiltroCategoria] = useState('Todos')
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState<Estudo | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [gerarCert, setGerarCert] = useState<Estudo | null>(null)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('estudos').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setEstudos(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtrados = estudos.filter(e => {
    if (filtroStatus !== 'Todos' && e.status !== filtroStatus) return false
    if (filtroCategoria !== 'Todos' && e.categoria !== filtroCategoria) return false
    return true
  })

  function openNew() { setForm(emptyForm()); setEditando(null); setModal(true) }
  function openEdit(e: Estudo) {
    setForm({ titulo: e.titulo, plataforma: e.plataforma, link: e.link || '', carga_horaria: e.carga_horaria, progresso: e.progresso, status: e.status, categoria: e.categoria })
    setEditando(e); setModal(true)
  }

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { titulo: form.titulo, plataforma: form.plataforma, link: form.link, carga_horaria: Number(form.carga_horaria), progresso: Number(form.progresso), status: form.status, categoria: form.categoria, user_id: user.id }
    if (editando) await supabase.from('estudos').update(payload).eq('id', editando.id)
    else await supabase.from('estudos').insert(payload)
    setSaving(false); setModal(false); load()
  }

  async function remove(id: string) {
    if (!confirm('Remover este estudo?')) return
    await supabase.from('estudos').delete().eq('id', id)
    load()
  }

  async function gerarCertificado(e: Estudo) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('certificados').insert({
      titulo: e.titulo, instituicao: e.plataforma,
      data_conclusao: new Date().toISOString().split('T')[0],
      carga_horaria: e.carga_horaria, categoria: e.categoria,
      tipo: 'gerado', estudo_id: e.id, user_id: user.id,
    })
    // Marcar como concluído
    await supabase.from('estudos').update({ status: 'Concluído', progresso: 100 }).eq('id', e.id)
    setGerarCert(null); load()
    alert('Certificado gerado e estudo marcado como concluído!')
  }

  const totalHoras = estudos.filter(e => e.status === 'Concluído').reduce((acc, e) => acc + (e.carga_horaria || 0), 0)

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Carregando estudos...</div>

  return (
    <div style={{ padding: '40px 48px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <span className="section-label" style={{ marginBottom: 12, display: 'inline-flex' }}>ESTUDOS</span>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Meus Estudos</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{totalHoras}h concluídas · {estudos.filter(e => e.status === 'Em andamento').length} em andamento</p>
        </div>
        <button className="btn-primary" onClick={openNew}><Plus size={16} /> Novo Estudo</button>
      </div>

      {/* Stats rápidas */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {STATUS_LIST.map(s => (
          <div key={s} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className={`badge ${STATUS_BADGE[s]}`}>{s}</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18 }}>{estudos.filter(e => e.status === s).length}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select className="input-field" style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: 13 }} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            {['Todos', ...STATUS_LIST].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <select className="input-field" style={{ width: 'auto', padding: '6px 32px 6px 12px', fontSize: 13 }} value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
          {['Todos', ...CATEGORIAS].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtrados.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={40} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: 15, marginBottom: 8 }}>Nenhum estudo encontrado</p>
          <button className="btn-primary" onClick={openNew}><Plus size={14} /> Adicionar estudo</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtrados.map(e => (
            <div key={e.id} className="glass-card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Progress circle */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: `conic-gradient(var(--accent) ${e.progresso * 3.6}deg, rgba(59,91,219,0.1) 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'var(--text-primary)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}>{e.progresso}%</div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{e.titulo}</h3>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className={`badge ${CAT_BADGE[e.categoria] || 'badge-gray'}`}>{e.categoria}</span>
                        <span className={`badge ${STATUS_BADGE[e.status]}`}>{e.status}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.plataforma}</span>
                        {e.carga_horaria > 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {e.carga_horaria}h</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                      {e.status === 'Concluído' && (
                        <button className="btn-ghost" onClick={() => setGerarCert(e)} style={{ color: '#f59e0b' }} title="Gerar certificado">
                          <Award size={14} />
                        </button>
                      )}
                      {e.link && <a href={e.link} target="_blank" rel="noreferrer" className="btn-ghost"><ExternalLink size={13} /></a>}
                      <button className="btn-ghost" onClick={() => openEdit(e)}><Pencil size={13} /></button>
                      <button className="btn-ghost" onClick={() => remove(e.id)} style={{ color: '#f87171' }}><Trash2 size={13} /></button>
                    </div>
                  </div>

                  <div className="progress-bar-track" style={{ marginTop: 12 }}>
                    <div className="progress-bar-fill" style={{
                      width: `${e.progresso}%`,
                      background: e.status === 'Concluído' ? 'linear-gradient(90deg, #10b981, #34d399)' : undefined,
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Novo/Editar */}
      <Modal open={modal} onClose={() => setModal(false)} title={editando ? 'Editar Estudo' : 'Novo Estudo'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Título do Curso / Estudo</label>
            <input className="input-field" placeholder="Ex: ChatGPT para Marketing" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Plataforma</label>
              <select className="input-field" value={form.plataforma} onChange={e => setForm({ ...form, plataforma: e.target.value })}>
                {PLATAFORMAS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Categoria</label>
              <select className="input-field" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Link do Curso</label>
            <input className="input-field" placeholder="https://..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Carga Horária</label>
              <input type="number" min={0} className="input-field" value={form.carga_horaria} onChange={e => setForm({ ...form, carga_horaria: Number(e.target.value) })} />
            </div>
            <div>
              <label style={labelStyle}>Progresso (%)</label>
              <input type="number" min={0} max={100} className="input-field" value={form.progresso} onChange={e => setForm({ ...form, progresso: Number(e.target.value) })} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as EstudoStatus })}>
                {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving || !form.titulo}>
              {saving ? 'Salvando...' : editando ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Gerar Certificado */}
      <Modal open={!!gerarCert} onClose={() => setGerarCert(null)} title="Gerar Certificado">
        {gerarCert && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>
              Deseja gerar um certificado para o estudo <strong style={{ color: 'var(--text-primary)' }}>{gerarCert.titulo}</strong>?
              Ele será adicionado à sua aba de Certificados.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setGerarCert(null)}>Cancelar</button>
              <button className="btn-primary" onClick={() => gerarCertificado(gerarCert)}><Award size={14} /> Gerar Certificado</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6,
  fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase',
}
