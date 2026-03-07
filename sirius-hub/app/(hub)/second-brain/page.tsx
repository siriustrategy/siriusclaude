'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Livro, NotaBrain, LivroStatus } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import {
  Brain, BookOpen, StickyNote, Sparkles, User,
  Plus, Pencil, Trash2, Send, Loader2,
  Moon, Zap, Heart, Compass, Star, ChevronDown, ChevronRight,
} from 'lucide-react'

type Tab = 'biblioteca' | 'notas' | 'pessoal' | 'espiritual' | 'chat'

const LIVROS_BRENO: Partial<Livro>[] = [
  { titulo: 'O Alquimista', autor: 'Paulo Coelho', categoria: 'Espiritual', status: 'Lido', progresso: 100, cover_color: '#F59E0B', insights: 'Seguir a Lenda Pessoal. O universo conspira a favor de quem sonha com determinação.', frases_marcantes: ['Quando você quer algo, todo o universo conspira para que você realize o seu desejo.'] },
  { titulo: 'As 48 Leis do Poder', autor: 'Robert Greene', categoria: 'Estratégia', status: 'Lido', progresso: 100, cover_color: '#374151', insights: 'Entender as dinâmicas de poder para navegar o mundo social com consciência.', frases_marcantes: ['Lei 1: Nunca ofusque o mestre.', 'Lei 48: Assuma uma forma amorfa.'] },
  { titulo: 'O Caibalion', autor: 'Três Iniciados', categoria: 'Espiritual', status: 'Lido', progresso: 100, cover_color: '#7C3AED', insights: 'Os 7 princípios herméticos: Mentalismo, Correspondência, Vibração, Polaridade, Ritmo, Causa e Efeito, Gênero.', frases_marcantes: ['O Todo é Mente; o Universo é Mental.', 'Como é em cima, é embaixo; como é embaixo, é em cima.'] },
  { titulo: 'Tao Te Ching', autor: 'Lao-Tsé', categoria: 'Espiritual', status: 'Lido', progresso: 100, cover_color: '#10B981', insights: 'Wu wei — agir sem forçar. A água é o símbolo maior: mole e irresistível.', frases_marcantes: ['Conhecer os outros é sabedoria. Conhecer a si mesmo é iluminação.'] },
  { titulo: 'A Arte da Guerra', autor: 'Sun Tzu', categoria: 'Estratégia', status: 'Lido', progresso: 100, cover_color: '#DC2626', insights: 'Vencer sem lutar é a excelência suprema. Conheça o inimigo e a si mesmo.', frases_marcantes: ['A oportunidade de vencer o inimigo é proporcionada pelo próprio inimigo.'] },
  { titulo: 'A Arte da Sedução', autor: 'Robert Greene', categoria: 'Estratégia', status: 'Lido', progresso: 100, cover_color: '#EC4899', insights: 'Sedução é criar desejo. Entender os arquétipos para influenciar com autenticidade.', frases_marcantes: ['A chave para a sedução é nunca deixar a outra pessoa adivinhar o próximo passo.'] },
  { titulo: 'O Poder do Hábito', autor: 'Charles Duhigg', categoria: 'Desenvolvimento Pessoal', status: 'Lido', progresso: 100, cover_color: '#3B5BDB', insights: 'Loop: gatilho → rotina → recompensa. Mude a rotina mantendo o gatilho e a recompensa.', frases_marcantes: ['Mude a rotina, mantenha o gatilho e a recompensa.'] },
  { titulo: 'Como Fazer Amigos e Influenciar Pessoas', autor: 'Dale Carnegie', categoria: 'Desenvolvimento Pessoal', status: 'Lido', progresso: 100, cover_color: '#059669', insights: 'O nome da pessoa é o som mais doce para ela. Interesse genuíno abre portas.', frases_marcantes: ['Fique genuinamente interessado nas outras pessoas.'] },
  { titulo: 'Manual de Persuasão do FBI', autor: 'Jack Schafer', categoria: 'Estratégia', status: 'Lido', progresso: 100, cover_color: '#1D4ED8', insights: 'Rapport, escuta ativa e o princípio da amizade como base de toda influência ética.', frases_marcantes: ['Faça as pessoas se sentirem bem consigo mesmas e elas gostarão de você.'] },
]

const STATUS_COLOR: Record<LivroStatus, string> = {
  'Quero ler': '#6B7280', 'Lendo': 'var(--accent)', 'Lido': 'var(--success)',
}

const PRINCIPIOS = [
  { num: 'I',   nome: 'Mentalismo',     desc: 'O Todo é Mente. O universo é mental. Sua realidade começa no pensamento.',             icon: Brain,   cor: '#7C3AED' },
  { num: 'II',  nome: 'Correspondência',desc: 'Como é em cima, é embaixo. Os padrões se repetem em todas as escalas.',              icon: Compass, cor: '#3B5BDB' },
  { num: 'III', nome: 'Vibração',       desc: 'Nada está em repouso. Tudo vibra em frequências. Eleve a sua.',                       icon: Zap,     cor: '#F59E0B' },
  { num: 'IV',  nome: 'Polaridade',     desc: 'Tudo tem dois pólos. Opostos são idênticos em natureza, diferentes em grau.',         icon: Moon,    cor: '#6366F1' },
  { num: 'V',   nome: 'Ritmo',          desc: 'Tudo tem maré, fluxo e refluxo. Aprenda a dançar com os ciclos da vida.',             icon: Heart,   cor: '#EC4899' },
  { num: 'VI',  nome: 'Causa e Efeito', desc: 'Toda causa tem seu efeito. Seja a causa consciente, não apenas o efeito.',            icon: Star,    cor: '#10B981' },
  { num: 'VII', nome: 'Gênero',         desc: 'O gênero está em tudo. Masculino e feminino se manifestam em todos os planos.',       icon: Sparkles,cor: '#F97316' },
]

// ── Biblioteca ─────────────────────────────────────────────────────────────────
function BibliotecaTab() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Livro | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [filtro, setFiltro] = useState<LivroStatus | 'Todos'>('Todos')

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('livros').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setLivros(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function seedLibrary() {
    setSeeding(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSeeding(false); return }
    for (const livro of LIVROS_BRENO) {
      await supabase.from('livros').insert({ ...livro, user_id: user.id })
    }
    setSeeding(false); load()
  }

  const filtered = filtro === 'Todos' ? livros : livros.filter(l => l.status === filtro)

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['Todos', 'Lido', 'Lendo', 'Quero ler'] as const).map(s => (
            <button key={s} onClick={() => setFiltro(s)} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              fontFamily: 'Space Grotesk, sans-serif', cursor: 'pointer', border: 'none',
              background: filtro === s ? 'var(--accent)' : 'rgba(59,91,219,0.08)',
              color: filtro === s ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
        {livros.length === 0 && (
          <button className="btn-primary" onClick={seedLibrary} disabled={seeding} style={{ fontSize: 13, padding: '8px 18px' }}>
            {seeding ? <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> : <BookOpen size={14} />}
            Importar minha biblioteca
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 14 }}>
        {filtered.map(livro => (
          <div key={livro.id} onClick={() => setSelected(livro)} style={{
            borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
            border: '1px solid var(--card-border)',
            transition: 'transform 0.15s, border-color 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,91,219,0.35)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)' }}
          >
            <div style={{ height: 110, background: livro.cover_color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <BookOpen size={28} color="rgba(255,255,255,0.5)" />
              {livro.status === 'Lido' && (
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(16,185,129,0.9)', borderRadius: 4, padding: '2px 6px', fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>LIDO</div>
              )}
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--card-bg)' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                {livro.titulo}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{livro.autor}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <BookOpen size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p style={{ fontSize: 14 }}>Nenhum livro encontrado.</p>
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.titulo || ''}>
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 70, borderRadius: 8, background: selected.cover_color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={20} color="rgba(255,255,255,0.7)" />
              </div>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 4 }}>{selected.titulo}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>{selected.autor}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge badge-blue">{selected.categoria}</span>
                  <span className="badge" style={{ background: STATUS_COLOR[selected.status] + '20', color: STATUS_COLOR[selected.status], borderColor: STATUS_COLOR[selected.status] + '40' }}>{selected.status}</span>
                </div>
              </div>
            </div>
            {selected.insights && (
              <div style={{ background: 'rgba(59,91,219,0.06)', border: '1px solid rgba(59,91,219,0.15)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.07em', marginBottom: 6 }}>INSIGHTS</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.insights}</p>
              </div>
            )}
            {selected.frases_marcantes?.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.07em', marginBottom: 10 }}>FRASES MARCANTES</div>
                {selected.frases_marcantes.map((f, i) => (
                  <blockquote key={i} style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 14, fontStyle: 'italic', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>"{f}"</blockquote>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

// ── Notas ──────────────────────────────────────────────────────────────────────
function NotasTab() {
  const [notas, setNotas] = useState<NotaBrain[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<NotaBrain | null>(null)
  const [form, setForm] = useState({ titulo: '', conteudo: '', categoria: 'Geral', tags: '' })
  const CATS = ['Geral', 'Insight', 'Estratégia', 'Aprendizado', 'Ideia', 'Reflexão', 'Espiritual', 'Pessoal']

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('notas_brain').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setNotas(data || []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setForm({ titulo: '', conteudo: '', categoria: 'Geral', tags: '' }); setModal(true) }
  function openEdit(n: NotaBrain) { setEditing(n); setForm({ titulo: n.titulo, conteudo: n.conteudo, categoria: n.categoria, tags: n.tags?.join(', ') || '' }); setModal(true) }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    if (editing) await supabase.from('notas_brain').update({ ...form, tags }).eq('id', editing.id)
    else await supabase.from('notas_brain').insert({ ...form, tags, user_id: user.id })
    setModal(false); load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir nota?')) return
    await supabase.from('notas_brain').delete().eq('id', id); load()
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn-primary" onClick={openNew} style={{ gap: 8 }}><Plus size={15} />Nova Nota</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {notas.map(nota => (
          <div key={nota.id} className="glass-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{nota.titulo}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openEdit(nota)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3 }}><Pencil size={12} color="var(--text-muted)" /></button>
                <button onClick={() => remove(nota.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3 }}><Trash2 size={12} color="var(--danger)" /></button>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', marginBottom: 12 }}>{nota.conteudo}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              <span className="badge badge-blue" style={{ fontSize: 10 }}>{nota.categoria}</span>
              {nota.tags?.map(t => <span key={t} className="badge" style={{ fontSize: 10, background: 'rgba(124,58,237,0.1)', color: '#c4b5fd', borderColor: 'rgba(124,58,237,0.2)' }}>#{t}</span>)}
            </div>
          </div>
        ))}
        {notas.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <StickyNote size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p style={{ fontSize: 14 }}>Nenhuma nota ainda. Capture seus insights!</p>
          </div>
        )}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Nota' : 'Nova Nota'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label className="label">Título</label><input className="input-field" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Título da nota..." /></div>
          <div><label className="label">Conteúdo</label><textarea className="input-field" rows={5} value={form.conteudo} onChange={e => setForm({ ...form, conteudo: e.target.value })} placeholder="Escreva livremente..." /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label className="label">Categoria</label><select className="input-field" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="label">Tags (vírgula)</label><input className="input-field" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="ia, poder..." /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={save} disabled={!form.titulo}>Salvar</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ── Pessoal ────────────────────────────────────────────────────────────────────
function PessoalTab() {
  const reflexoes = [
    { area: 'Missão de Vida', pergunta: 'Qual é o propósito maior pelo qual estou aqui?', icon: Compass, cor: '#3B5BDB' },
    { area: 'Valores Centrais', pergunta: 'O que é inegociável para mim? Quais princípios guiam minhas decisões?', icon: Heart, cor: '#EC4899' },
    { area: 'Zona de Genialidade', pergunta: 'Em que momentos o tempo passa voando e produzo algo extraordinário?', icon: Zap, cor: '#F59E0B' },
    { area: 'Legado', pergunta: 'Daqui a 20 anos, que impacto quero ter deixado no mundo?', icon: Star, cor: '#8B5CF6' },
    { area: 'Padrões que Percebo', pergunta: 'Que padrões de comportamento e pensamento se repetem na minha vida?', icon: Brain, cor: '#10B981' },
  ]
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(59,91,219,0.12) 0%, rgba(124,58,237,0.08) 100%)', border: '1px solid rgba(59,91,219,0.25)', borderRadius: 14, padding: '18px 22px', marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.08em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>MAPA DO EU</div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Reflexões profundas que formam seu perfil no Second Brain. Quanto mais você responde, mais o sistema te entende.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {reflexoes.map(r => {
          const Icon = r.icon
          const isOpen = expanded === r.area
          return (
            <div key={r.area} className="glass-card" style={{ overflow: 'hidden' }}>
              <button onClick={() => setExpanded(isOpen ? null : r.area)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: r.cor + '18', border: `1px solid ${r.cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={r.cor} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{r.area}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.pergunta}</div>
                </div>
                {isOpen ? <ChevronDown size={15} color="var(--text-muted)" /> : <ChevronRight size={15} color="var(--text-muted)" />}
              </button>
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
                  <textarea className="input-field" rows={4} placeholder="Escreva sua reflexão aqui..." value={respostas[r.area] || ''} onChange={e => setRespostas({ ...respostas, [r.area]: e.target.value })} />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Em breve estas respostas alimentarão o seu perfil de IA personalizado.</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Espiritual ─────────────────────────────────────────────────────────────────
function EspiritualTab() {
  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,91,219,0.06) 100%)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, padding: '20px 24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Moon size={18} color="#c4b5fd" />
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Dimensão Espiritual</div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          A espiritualidade no Sirius Hub não é dogma — é autoconhecimento profundo, conexão com propósito superior e entendimento das leis universais que você já estudou.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span className="section-label purple">OS 7 PRINCÍPIOS HERMÉTICOS — O CAIBALION</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        {PRINCIPIOS.map(p => {
          const Icon = p.icon
          return (
            <div key={p.num} className="glass-card" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: p.cor + '18', border: `1px solid ${p.cor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={p.cor} />
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: p.cor, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.1em' }}>PRINCÍPIO {p.num}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{p.nome}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{p.desc}</p>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span className="section-label">DIÁRIO DE PRÁTICAS E SINCRONICIDADES</span>
      </div>
      <div className="glass-card" style={{ padding: '20px 22px' }}>
        <textarea className="input-field" rows={4} placeholder="Registre sonhos, sincronicidades, insights meditativos, percepções espirituais do dia..." style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="input-field" style={{ flex: 1 }}>
            <option>Sincronicidade</option><option>Sonho</option><option>Meditação</option>
            <option>Insight</option><option>Manifestação</option><option>Ritual</option>
          </select>
          <button className="btn-primary" style={{ padding: '10px 24px' }}>Registrar</button>
        </div>
      </div>
    </div>
  )
}

// ── Chat IA ────────────────────────────────────────────────────────────────────
function ChatTab() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Olá, Breno. Sou a IA do seu Second Brain. Tenho acesso a tudo que você registrou — livros, notas, reflexões e princípios espirituais. Me pergunte qualquer coisa sobre você mesmo ou peça insights baseados no que estudou.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim(); setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setMessages(prev => [...prev, { role: 'ai', text: `Baseado no seu Second Brain: configure ANTHROPIC_API_KEY em Integrações para ativar respostas personalizadas baseadas nos seus livros e notas.` }])
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 560, maxWidth: 740 }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(59,91,219,0.12) 0%, rgba(124,58,237,0.08) 100%)', border: '1px solid rgba(59,91,219,0.25)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(59,91,219,0.2)', border: '1px solid rgba(59,91,219,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={16} color="#93c5fd" />
        </div>
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Sirius Brain — IA Personalizada</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Responde com base nos seus livros, notas e reflexões</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '12px 16px', borderRadius: 12, fontSize: 14, lineHeight: 1.6,
              background: m.role === 'user' ? 'var(--accent)' : 'var(--card-bg)',
              color: m.role === 'user' ? '#fff' : 'var(--text-secondary)',
              border: m.role === 'ai' ? '1px solid var(--card-border)' : 'none',
            }}>
              {m.role === 'ai' && <div style={{ fontSize: 10, fontWeight: 700, color: '#93c5fd', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.07em', marginBottom: 6 }}>SIRIUS BRAIN</div>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <Loader2 size={16} color="var(--accent)" style={{ animation: 'spin 0.7s linear infinite' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input className="input-field" style={{ flex: 1 }} placeholder="Pergunte sobre seus padrões, livros, missão de vida..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
        <button className="btn-primary" onClick={send} disabled={!input.trim() || loading} style={{ padding: '10px 18px' }}><Send size={16} /></button>
      </div>
    </div>
  )
}

// ── Página principal ────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string; icon: typeof Brain }[] = [
  { key: 'biblioteca', label: 'Biblioteca', icon: BookOpen },
  { key: 'notas',      label: 'Notas',      icon: StickyNote },
  { key: 'pessoal',    label: 'Pessoal',    icon: User },
  { key: 'espiritual', label: 'Espiritual', icon: Moon },
  { key: 'chat',       label: 'Chat IA',    icon: Sparkles },
]

export default function SecondBrainPage() {
  const [tab, setTab] = useState<Tab>('biblioteca')

  return (
    <div style={{ padding: '40px 48px', maxWidth: 980, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span className="section-label" style={{ marginBottom: 12, display: 'inline-flex' }}>SEGUNDO CÉREBRO</span>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Second Brain
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Sua memória expandida — livros, notas, reflexões pessoais, dimensão espiritual e IA personalizada.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: active ? 600 : 500,
              fontFamily: 'Space Grotesk, sans-serif',
              cursor: 'pointer', border: 'none',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}>
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Conteúdo */}
      {tab === 'biblioteca' && <BibliotecaTab />}
      {tab === 'notas'      && <NotasTab />}
      {tab === 'pessoal'    && <PessoalTab />}
      {tab === 'espiritual' && <EspiritualTab />}
      {tab === 'chat'       && <ChatTab />}
    </div>
  )
}
