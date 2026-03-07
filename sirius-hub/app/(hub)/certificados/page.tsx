'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Certificado } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import { Plus, Award, Pencil, Trash2, Download, Eye, Star } from 'lucide-react'

const CATEGORIAS = ['IA', 'Desenvolvimento', 'Design', 'Automação', 'Marketing', 'Negócios', 'Outro']

function emptyForm() {
  return { titulo: '', instituicao: '', data_conclusao: new Date().toISOString().split('T')[0], carga_horaria: 0, categoria: 'IA', tipo: 'importado' as 'importado' | 'gerado' }
}

export default function CertificadosPage() {
  const [certs, setCerts] = useState<Certificado[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState<Certificado | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<Certificado | null>(null)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('certificados').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setCerts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() { setForm(emptyForm()); setEditando(null); setModal(true) }
  function openEdit(c: Certificado) {
    setForm({ titulo: c.titulo, instituicao: c.instituicao, data_conclusao: c.data_conclusao || '', carga_horaria: c.carga_horaria, categoria: c.categoria, tipo: c.tipo })
    setEditando(c); setModal(true)
  }

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { ...form, carga_horaria: Number(form.carga_horaria), user_id: user.id }
    if (editando) await supabase.from('certificados').update(payload).eq('id', editando.id)
    else await supabase.from('certificados').insert(payload)
    setSaving(false); setModal(false); load()
  }

  async function remove(id: string) {
    if (!confirm('Remover este certificado?')) return
    await supabase.from('certificados').delete().eq('id', id)
    load()
  }

  function handlePrint(cert: Certificado) {
    const win = window.open('', '_blank')!
    win.document.write(certHTML(cert))
    win.document.close()
    win.print()
  }

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Carregando certificados...</div>

  return (
    <div style={{ padding: '40px 48px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <span className="section-label" style={{ marginBottom: 12, display: 'inline-flex' }}>CERTIFICADOS</span>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Meus Certificados</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{certs.length} certificado{certs.length !== 1 ? 's' : ''} · {certs.filter(c => c.tipo === 'gerado').length} gerados pelo Hub</p>
        </div>
        <button className="btn-primary" onClick={openNew}><Plus size={16} /> Importar Certificado</button>
      </div>

      {certs.length === 0 ? (
        <div className="empty-state">
          <Award size={40} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: 15, marginBottom: 8 }}>Nenhum certificado ainda</p>
          <p style={{ fontSize: 13, marginBottom: 20, color: 'var(--text-muted)' }}>
            Conclua um estudo para gerar um certificado, ou importe manualmente.
          </p>
          <button className="btn-primary" onClick={openNew}><Plus size={14} /> Importar</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {certs.map(c => (
            <div key={c.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Certificate visual header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(59,91,219,0.15) 0%, rgba(124,58,237,0.1) 100%)',
                borderBottom: '1px solid var(--border)',
                padding: '24px 20px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: -20, right: -20,
                  width: 80, height: 80,
                  background: 'rgba(59,91,219,0.08)',
                  borderRadius: '50%',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(59,91,219,0.2)',
                    border: '1px solid rgba(59,91,219,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Award size={20} color="#5B7BFF" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
                      {c.tipo === 'gerado' ? 'Hub Certificate' : 'Importado'}
                    </div>
                    <span className={`badge ${CAT_BADGE[c.categoria] || 'badge-gray'}`}>{c.categoria}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{c.titulo}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{c.instituicao}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  {c.data_conclusao && <span>{new Date(c.data_conclusao + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                  {c.carga_horaria > 0 && <span>{c.carga_horaria}h</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => setPreview(c)}>
                    <Eye size={13} /> Visualizar
                  </button>
                  <button className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12 }} onClick={() => handlePrint(c)}>
                    <Download size={13} /> Exportar
                  </button>
                  <button className="btn-ghost" onClick={() => openEdit(c)}><Pencil size={13} /></button>
                  <button className="btn-ghost" onClick={() => remove(c.id)} style={{ color: '#f87171' }}><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Importar/Editar */}
      <Modal open={modal} onClose={() => setModal(false)} title={editando ? 'Editar Certificado' : 'Importar Certificado'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Título do Curso / Certificação</label>
            <input className="input-field" placeholder="Ex: IA Generativa para Marketing" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Instituição / Plataforma</label>
              <input className="input-field" placeholder="Ex: Coursera, Udemy..." value={form.instituicao} onChange={e => setForm({ ...form, instituicao: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Categoria</label>
              <select className="input-field" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Data de Conclusão</label>
              <input type="date" className="input-field" value={form.data_conclusao} onChange={e => setForm({ ...form, data_conclusao: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Carga Horária</label>
              <input type="number" min={0} className="input-field" value={form.carga_horaria} onChange={e => setForm({ ...form, carga_horaria: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving || !form.titulo}>
              {saving ? 'Salvando...' : editando ? 'Salvar' : 'Importar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Preview do Certificado" maxWidth={640}>
        {preview && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #080C18 0%, #0D1225 100%)',
              border: '2px solid rgba(59,91,219,0.4)',
              borderRadius: 12,
              padding: '40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 20, left: 20, opacity: 0.05, fontSize: 120 }}>
                <Star size={120} />
              </div>
              <div style={{ position: 'absolute', bottom: 20, right: 20, opacity: 0.05 }}>
                <Star size={80} />
              </div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#93c5fd', marginBottom: 24, textTransform: 'uppercase' }}>
                Sirius Hub · Certificado de Conclusão
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Certificamos que
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
                Breno Nobre
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                concluiu com êxito o curso
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#93c5fd', marginBottom: 20, lineHeight: 1.3 }}>
                {preview.titulo}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {preview.instituicao} · {preview.carga_horaria}h · {preview.data_conclusao && new Date(preview.data_conclusao + 'T00:00:00').toLocaleDateString('pt-BR')}
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setPreview(null)}>Fechar</button>
              <button className="btn-primary" onClick={() => handlePrint(preview)}><Download size={14} /> Exportar PDF</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

const CAT_BADGE: Record<string, string> = {
  'IA': 'badge-purple', 'Desenvolvimento': 'badge-blue',
  'Design': 'badge-yellow', 'Automação': 'badge-green',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6,
  fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase',
}

function certHTML(c: Certificado): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificado - ${c.titulo}</title>
  <style>
    body { margin: 0; font-family: 'Georgia', serif; background: #080C18; color: #E8EEFF; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .cert { border: 3px solid #3B5BDB; border-radius: 16px; padding: 60px 80px; text-align: center; max-width: 700px; margin: 40px auto; background: linear-gradient(135deg, #080C18 0%, #0D1225 100%); }
    .label { font-size: 11px; letter-spacing: 0.2em; color: #93c5fd; text-transform: uppercase; margin-bottom: 30px; }
    .certify { font-size: 16px; color: #7A8AAE; margin-bottom: 10px; }
    .name { font-size: 36px; font-weight: bold; color: #E8EEFF; margin-bottom: 12px; }
    .course-label { font-size: 14px; color: #7A8AAE; margin-bottom: 16px; }
    .course { font-size: 24px; color: #93c5fd; font-weight: bold; margin-bottom: 30px; }
    .meta { font-size: 13px; color: #4A5680; }
    @media print { body { background: white; } .cert { border-color: #3B5BDB; } }
  </style></head><body>
  <div class="cert">
    <div class="label">Sirius Hub &middot; Certificado de Conclusão</div>
    <div class="certify">Certificamos que</div>
    <div class="name">Breno Nobre</div>
    <div class="course-label">concluiu com êxito o curso</div>
    <div class="course">${c.titulo}</div>
    <div class="meta">${c.instituicao} &middot; ${c.carga_horaria}h &middot; ${c.data_conclusao ? new Date(c.data_conclusao + 'T00:00:00').toLocaleDateString('pt-BR') : ''}</div>
  </div></body></html>`
}
