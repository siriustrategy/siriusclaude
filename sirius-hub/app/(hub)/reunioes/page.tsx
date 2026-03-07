'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Reuniao, ActionItem } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import { Plus, CalendarDays, Users, FileText, CheckSquare, Square, Pencil, Trash2, ChevronRight, Clock } from 'lucide-react'

function emptyForm() {
  return {
    titulo: '', empresa: '', data: new Date().toISOString().split('T')[0],
    horario: '', participantes: '', pauta: '', notas: '', projeto_id: '',
  }
}

export default function ReunioesPage() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([])
  const [projetos, setProjetos] = useState<any[]>([])
  const [selecionada, setSelecionada] = useState<Reuniao | null>(null)
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState<Reuniao | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [novaTask, setNovaTask] = useState('')
  const [addingTask, setAddingTask] = useState(false)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [r, p] = await Promise.all([
      supabase.from('reunioes').select('*').eq('user_id', user.id).order('data', { ascending: false }),
      supabase.from('projetos').select('id, nome').eq('user_id', user.id),
    ])
    setReunioes(r.data || [])
    setProjetos(p.data || [])
    setLoading(false)
  }

  async function loadActionItems(reuniaoId: string) {
    const { data } = await supabase.from('action_items').select('*').eq('reuniao_id', reuniaoId).order('created_at')
    setActionItems(data || [])
  }

  useEffect(() => { load() }, [])

  async function selectReuniao(r: Reuniao) {
    setSelecionada(r)
    await loadActionItems(r.id)
  }

  function openNew() { setForm(emptyForm()); setEditando(null); setModal(true) }
  function openEdit(r: Reuniao) {
    setForm({
      titulo: r.titulo, empresa: r.empresa, data: r.data,
      horario: r.horario || '', participantes: r.participantes?.join(', ') || '',
      pauta: r.pauta || '', notas: r.notas || '', projeto_id: r.projeto_id || '',
    })
    setEditando(r); setModal(true)
  }

  async function save() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = {
      titulo: form.titulo, empresa: form.empresa, data: form.data,
      horario: form.horario, notas: form.notas, pauta: form.pauta,
      participantes: form.participantes ? form.participantes.split(',').map(p => p.trim()).filter(Boolean) : [],
      projeto_id: form.projeto_id || null, user_id: user.id,
    }
    if (editando) {
      await supabase.from('reunioes').update(payload).eq('id', editando.id)
      if (selecionada?.id === editando.id) setSelecionada({ ...selecionada, ...payload } as Reuniao)
    } else {
      await supabase.from('reunioes').insert(payload)
    }
    setSaving(false); setModal(false); load()
  }

  async function remove(id: string) {
    if (!confirm('Remover esta reunião?')) return
    await supabase.from('reunioes').delete().eq('id', id)
    if (selecionada?.id === id) setSelecionada(null)
    load()
  }

  async function addActionItem() {
    if (!novaTask.trim() || !selecionada) return
    setAddingTask(true)
    await supabase.from('action_items').insert({ reuniao_id: selecionada.id, descricao: novaTask.trim() })
    setNovaTask('')
    await loadActionItems(selecionada.id)
    setAddingTask(false)
  }

  async function toggleActionItem(item: ActionItem) {
    await supabase.from('action_items').update({ concluido: !item.concluido }).eq('id', item.id)
    await loadActionItems(selecionada!.id)
  }

  async function removeActionItem(id: string) {
    await supabase.from('action_items').delete().eq('id', id)
    await loadActionItems(selecionada!.id)
  }

  const today = new Date().toISOString().split('T')[0]
  const proximas = reunioes.filter(r => r.data >= today)
  const passadas = reunioes.filter(r => r.data < today)

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 40, textAlign: 'center' }}>Carregando reuniões...</div>

  return (
    <div style={{ padding: '40px 48px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <span className="section-label" style={{ marginBottom: 12, display: 'inline-flex' }}>REUNIÕES</span>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Reuniões</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{proximas.length} próxima{proximas.length !== 1 ? 's' : ''} · {passadas.length} passada{passadas.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={openNew}><Plus size={16} /> Nova Reunião</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selecionada ? '1fr 1fr' : '1fr', gap: 20 }}>
        {/* Lista */}
        <div>
          {reunioes.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={40} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
              <p style={{ fontSize: 15, marginBottom: 8 }}>Nenhuma reunião cadastrada</p>
              <button className="btn-primary" onClick={openNew}><Plus size={14} /> Agendar reunião</button>
            </div>
          ) : (
            <div>
              {proximas.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>PRÓXIMAS</div>
                  {proximas.map(r => <ReuniaoRow key={r.id} reuniao={r} isActive={selecionada?.id === r.id} onClick={() => selectReuniao(r)} onEdit={() => openEdit(r)} onDelete={() => remove(r.id)} />)}
                </div>
              )}
              {passadas.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>PASSADAS</div>
                  {passadas.map(r => <ReuniaoRow key={r.id} reuniao={r} isActive={selecionada?.id === r.id} onClick={() => selectReuniao(r)} onEdit={() => openEdit(r)} onDelete={() => remove(r.id)} past />)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selecionada && (
          <div className="glass-card" style={{ padding: 24, position: 'sticky', top: 20, alignSelf: 'flex-start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{selecionada.titulo}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="badge badge-blue">{selecionada.empresa}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    {new Date(selecionada.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                    {selecionada.horario && ` · ${selecionada.horario}`}
                  </span>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setSelecionada(null)} style={{ flexShrink: 0 }}>
                <ChevronRight size={16} />
              </button>
            </div>

            {selecionada.participantes?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <Users size={13} /> Participantes
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selecionada.participantes.map(p => (
                    <span key={p} className="badge badge-gray">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {selecionada.pauta && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={13} /> PAUTA
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selecionada.pauta}</p>
              </div>
            )}

            {selecionada.notas && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>NOTAS</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selecionada.notas}</p>
              </div>
            )}

            <div className="divider" />

            {/* Action Items */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckSquare size={13} /> ACTION ITEMS ({actionItems.filter(a => a.concluido).length}/{actionItems.length})
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                  className="input-field"
                  placeholder="Nova tarefa..."
                  value={novaTask}
                  onChange={e => setNovaTask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addActionItem()}
                  style={{ fontSize: 13 }}
                />
                <button className="btn-primary" onClick={addActionItem} disabled={addingTask || !novaTask.trim()} style={{ flexShrink: 0, padding: '10px 14px' }}>
                  <Plus size={15} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {actionItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--surface)' }}>
                    <button onClick={() => toggleActionItem(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.concluido ? 'var(--success)' : 'var(--text-muted)', flexShrink: 0 }}>
                      {item.concluido ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                    <span style={{ flex: 1, fontSize: 13, color: item.concluido ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.concluido ? 'line-through' : 'none' }}>
                      {item.descricao}
                    </span>
                    <button className="btn-ghost" onClick={() => removeActionItem(item.id)} style={{ color: '#f87171', padding: 4 }}><Trash2 size={12} /></button>
                  </div>
                ))}
                {actionItems.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>Nenhuma tarefa</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editando ? 'Editar Reunião' : 'Nova Reunião'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Título</label>
            <input className="input-field" placeholder="Ex: Alinhamento Q1" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Empresa</label>
              <input className="input-field" placeholder="Ex: Sirius Strategy" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Projeto (opcional)</label>
              <select className="input-field" value={form.projeto_id} onChange={e => setForm({ ...form, projeto_id: e.target.value })}>
                <option value="">Nenhum</option>
                {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Data</label>
              <input type="date" className="input-field" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Horário</label>
              <input type="time" className="input-field" value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Participantes (separados por vírgula)</label>
            <input className="input-field" placeholder="Ana Lima, João Silva..." value={form.participantes} onChange={e => setForm({ ...form, participantes: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Pauta</label>
            <textarea className="input-field" placeholder="O que será discutido..." value={form.pauta} onChange={e => setForm({ ...form, pauta: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Notas / Resumo</label>
            <textarea className="input-field" placeholder="Anotações da reunião..." value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving || !form.titulo}>
              {saving ? 'Salvando...' : editando ? 'Salvar' : 'Criar Reunião'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ReuniaoRow({ reuniao: r, isActive, onClick, onEdit, onDelete, past }: { reuniao: Reuniao, isActive: boolean, onClick: () => void, onEdit: () => void, onDelete: () => void, past?: boolean }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      borderRadius: 10, marginBottom: 6, cursor: 'pointer',
      background: isActive ? 'rgba(59,91,219,0.1)' : 'var(--card-bg)',
      border: `1px solid ${isActive ? 'rgba(59,91,219,0.3)' : 'var(--card-border)'}`,
      transition: 'all 0.15s',
      opacity: past ? 0.7 : 1,
    }}>
      <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: isActive ? '#93c5fd' : 'var(--text-primary)', lineHeight: 1 }}>
          {new Date(r.data + 'T00:00:00').getDate()}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          {new Date(r.data + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.titulo}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>{r.empresa}</span>
          {r.horario && <><span>·</span><span>{r.horario}</span></>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
        <button className="btn-ghost" onClick={onEdit}><Pencil size={13} /></button>
        <button className="btn-ghost" onClick={onDelete} style={{ color: '#f87171' }}><Trash2 size={13} /></button>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6,
  fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase',
}
