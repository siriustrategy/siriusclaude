'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Livro, NotaBrain, LivroStatus } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import {
  Brain, BookOpen, StickyNote, Sparkles, User, Star,
  Plus, Pencil, Trash2, Send, Loader2, ChevronDown, ChevronRight,
  Moon, Zap, Heart, Compass,
} from 'lucide-react'

type Tab = 'biblioteca' | 'notas' | 'pessoal' | 'espiritual' | 'chat'

const LIVROS_BRENO: Partial<Livro>[] = [
  { titulo: 'O Alquimista', autor: 'Paulo Coelho', categoria: 'Espiritual', subcategoria: 'Autoconhecimento', status: 'Lido', progresso: 100, cover_color: '#F59E0B', insights: 'Seguir a Lenda Pessoal. O universo conspira a favor de quem sonha com determinação.', frases_marcantes: ['Quando você quer algo, todo o universo conspira para que você realize o seu desejo.'] },
  { titulo: 'As 48 Leis do Poder', autor: 'Robert Greene', categoria: 'Estratégia', subcategoria: 'Poder e Influência', status: 'Lido', progresso: 100, cover_color: '#1F2937', insights: 'Entender as dinâmicas de poder para navegar o mundo social com consciência.', frases_marcantes: ['Lei 1: Nunca ofusque o mestre.', 'Lei 48: Assuma uma forma amorfa.'] },
  { titulo: 'O Caibalion', autor: 'Três Iniciados', categoria: 'Espiritual', subcategoria: 'Hermetismo', status: 'Lido', progresso: 100, cover_color: '#7C3AED', insights: 'Os 7 princípios herméticos: Mentalismo, Correspondência, Vibração, Polaridade, Ritmo, Causa e Efeito, Gênero.', frases_marcantes: ['O Todo é Mente; o Universo é Mental.', 'Como é em cima, é embaixo; como é embaixo, é em cima.'] },
  { titulo: 'Tao Te Ching', autor: 'Lao-Tsé', categoria: 'Espiritual', subcategoria: 'Taoísmo', status: 'Lido', progresso: 100, cover_color: '#10B981', insights: 'Wu wei — agir sem forçar. A água é o símbolo maior: mole e irresistível.', frases_marcantes: ['Conhecer os outros é sabedoria. Conhecer a si mesmo é iluminação.'] },
  { titulo: 'A Arte da Guerra', autor: 'Sun Tzu', categoria: 'Estratégia', subcategoria: 'Tática', status: 'Lido', progresso: 100, cover_color: '#DC2626', insights: 'Vencer sem lutar é a excelência suprema. Conheça o inimigo e a si mesmo.', frases_marcantes: ['A oportunidade de vencer o inimigo é proporcionada pelo próprio inimigo.'] },
  { titulo: 'A Arte da Sedução', autor: 'Robert Greene', categoria: 'Estratégia', subcategoria: 'Persuasão', status: 'Lido', progresso: 100, cover_color: '#EC4899', insights: 'Sedução é criar desejo. Entender os arquétipos para influenciar com autenticidade.', frases_marcantes: ['A chave para a sedução é nunca deixar a outra pessoa adivinhar o próximo passo.'] },
  { titulo: 'O Poder do Hábito', autor: 'Charles Duhigg', categoria: 'Desenvolvimento Pessoal', subcategoria: 'Produtividade', status: 'Lido', progresso: 100, cover_color: '#3B5BDB', insights: 'Loop do hábito: gatilho → rotina → recompensa. Mudar a rotina mantendo o gatilho e a recompensa.', frases_marcantes: ['Mude a rotina, mantenha o gatilho e a recompensa.'] },
  { titulo: 'Como Fazer Amigos e Influenciar Pessoas', autor: 'Dale Carnegie', categoria: 'Desenvolvimento Pessoal', subcategoria: 'Relacionamentos', status: 'Lido', progresso: 100, cover_color: '#059669', insights: 'O nome da pessoa é o som mais doce para ela. Interesse genuíno abre portas.', frases_marcantes: ['Fique genuinamente interessado nas outras pessoas.'] },
  { titulo: 'Manual de Persuasão do FBI', autor: 'Jack Schafer', categoria: 'Estratégia', subcategoria: 'Persuasão', status: 'Lido', progresso: 100, cover_color: '#1D4ED8', insights: 'Rapport, escuta ativa e o princípio da amizade como base de toda influência ética.', frases_marcantes: ['Faça as pessoas se sentirem bem consigo mesmas e elas gostarão de você.'] },
]

const STATUS_COLOR: Record<LivroStatus, string> = {
  'Quero ler': '#6B7280',
  'Lendo': 'var(--accent)',
  'Lido': 'var(--success)',
}

const PRINCIPIOS_HERMETICOS = [
  { num: 'I', nome: 'Mentalismo', desc: 'O Todo é Mente. O universo é mental. Sua realidade começa no pensamento.', icon: Brain },
  { num: 'II', nome: 'Correspondência', desc: 'Como é em cima, é embaixo. Os padrões se repetem em todas as escalas.', icon: Compass },
  { num: 'III', nome: 'Vibração', desc: 'Nada está em repouso. Tudo vibra. Eleve sua frequência.', icon: Zap },
  { num: 'IV', nome: 'Polaridade', desc: 'Tudo tem dois pólos. Opostos são idênticos em natureza, diferentes em grau.', icon: Moon },
  { num: 'V', nome: 'Ritmo', desc: 'Tudo tem maré, fluxo e refluxo. Aprenda a dançar com os ciclos.', icon: Heart },
  { num: 'VI', nome: 'Causa e Efeito', desc: 'Toda causa tem seu efeito. Seja a causa, não apenas o efeito.', icon: Star },
  { num: 'VII', nome: 'Gênero', desc: 'O gênero está em tudo. Masculino e feminino se manifestam em todos os planos.', icon: Sparkles },
]

function BibliotecaTab() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
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
    setSeeding(false)
    load()
  }

  const filtered = filtro === 'Todos' ? livros : livros.filter(l => l.status === filtro)

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['Todos', 'Lido', 'Lendo', 'Quero ler'] as const).map(s => (
            <button key={s} onClick={() => setFiltro(s)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{
              background: filtro === s ? 'var(--accent)' : 'var(--surface)',
              color: filtro === s ? '#fff' : 'var(--text-muted)',
            }}>{s}</button>
          ))}
        </div>
        {livros.length === 0 && (
          <button className="btn-primary text-sm flex items-center gap-2" onClick={seedLibrary} disabled={seeding}>
            {seeding ? <Loader2 size={14} className="animate-spin" /> : <BookOpen size={14} />}
            Importar minha biblioteca
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map(livro => (
          <div key={livro.id} className="rounded-xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-1" style={{ border: '1px solid var(--border)' }} onClick={() => { setSelected(livro); setModal(true) }}>
            <div className="h-32 flex items-center justify-center relative" style={{ background: livro.cover_color || 'var(--accent)' }}>
              <BookOpen size={32} color="rgba(255,255,255,0.6)" />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                {livro.progresso}%
              </div>
            </div>
            <div className="p-3" style={{ background: 'var(--surface)' }}>
              <p className="font-semibold text-xs text-white leading-tight line-clamp-2">{livro.titulo}</p>
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{livro.autor}</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[livro.status] }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{livro.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Detail Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={selected?.titulo || ''}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-16 rounded-lg flex items-center justify-center" style={{ background: selected.cover_color }}>
                <BookOpen size={20} color="rgba(255,255,255,0.8)" />
              </div>
              <div>
                <p className="font-bold text-white">{selected.titulo}</p>
                <p style={{ color: 'var(--text-muted)' }}>{selected.autor}</p>
                <div className="flex gap-2 mt-1">
                  <span className="badge">{selected.categoria}</span>
                  <span className="badge">{selected.status}</span>
                </div>
              </div>
            </div>

            {selected.insights && (
              <div className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                <p className="text-xs font-semibold text-white mb-1">Insights Principais</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selected.insights}</p>
              </div>
            )}

            {selected.frases_marcantes?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-white mb-2">Frases Marcantes</p>
                <div className="space-y-2">
                  {selected.frases_marcantes.map((f, i) => (
                    <blockquote key={i} className="pl-3 italic text-sm" style={{ borderLeft: '2px solid var(--accent)', color: 'var(--text-secondary)' }}>
                      "{f}"
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

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
    setNotas(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setForm({ titulo: '', conteudo: '', categoria: 'Geral', tags: '' }); setModal(true) }
  function openEdit(n: NotaBrain) { setEditing(n); setForm({ titulo: n.titulo, conteudo: n.conteudo, categoria: n.categoria, tags: n.tags?.join(', ') || '' }); setModal(true) }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    if (editing) {
      await supabase.from('notas_brain').update({ ...form, tags }).eq('id', editing.id)
    } else {
      await supabase.from('notas_brain').insert({ ...form, tags, user_id: user.id })
    }
    setModal(false); load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir nota?')) return
    await supabase.from('notas_brain').delete().eq('id', id)
    load()
  }

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="btn-primary flex items-center gap-2" onClick={openNew}>
          <Plus size={16} /> Nova Nota
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notas.map(nota => (
          <div key={nota.id} className="rounded-xl p-4 space-y-2 group" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between">
              <p className="font-semibold text-sm text-white">{nota.titulo}</p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(nota)} className="p-1 rounded hover:bg-white/10"><Pencil size={12} style={{ color: 'var(--text-muted)' }} /></button>
                <button onClick={() => remove(nota.id)} className="p-1 rounded hover:bg-white/10"><Trash2 size={12} color="var(--danger)" /></button>
              </div>
            </div>
            <p className="text-xs line-clamp-4" style={{ color: 'var(--text-secondary)' }}>{nota.conteudo}</p>
            <div className="flex flex-wrap gap-1">
              <span className="badge text-xs">{nota.categoria}</span>
              {nota.tags?.map(t => <span key={t} className="badge text-xs" style={{ background: 'var(--accent)20', color: 'var(--accent)' }}>#{t}</span>)}
            </div>
          </div>
        ))}
        {notas.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
            <StickyNote size={32} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Nenhuma nota ainda. Capture seus insights!</p>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Editar Nota' : 'Nova Nota'}>
        <div className="space-y-4">
          <div>
            <label className="label">Título *</label>
            <input className="input" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Título da nota..." />
          </div>
          <div>
            <label className="label">Conteúdo</label>
            <textarea className="input" rows={6} value={form.conteudo} onChange={e => setForm({ ...form, conteudo: e.target.value })} placeholder="Escreva livremente..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Categoria</label>
              <select className="input" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tags (separadas por vírgula)</label>
              <input className="input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="ia, estratégia, poder..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-secondary flex-1" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary flex-1" onClick={save} disabled={!form.titulo}>Salvar</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function PessoalTab() {
  const reflexoes = [
    { area: 'Missão de Vida', pergunta: 'Qual é o propósito maior pelo qual estou aqui?', icon: Compass, color: 'var(--accent)' },
    { area: 'Valores Centrais', pergunta: 'O que é inegociável para mim? Quais princípios guiam minhas decisões?', icon: Heart, color: '#EC4899' },
    { area: 'Zona de Genialidade', pergunta: 'Em que momentos o tempo passa voando e eu produzo algo extraordinário?', icon: Zap, color: '#F59E0B' },
    { area: 'Legado', pergunta: 'Daqui a 20 anos, o que quero que digam sobre o impacto que causei?', icon: Star, color: '#8B5CF6' },
    { area: 'Padrões que Percebo', pergunta: 'Que padrões de comportamento e pensamento se repetem na minha vida?', icon: Brain, color: '#10B981' },
  ]

  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-sm font-semibold text-white mb-1">Mapa do Eu</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Reflexões profundas que formam o seu perfil no Second Brain. Quanto mais você responde, mais o sistema te entende.
        </p>
      </div>

      {reflexoes.map(r => {
        const Icon = r.icon
        const isOpen = expanded === r.area
        return (
          <div key={r.area} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <button className="w-full flex items-center gap-3 p-4 text-left" style={{ background: 'var(--surface)' }} onClick={() => setExpanded(isOpen ? null : r.area)}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: r.color + '20' }}>
                <Icon size={16} style={{ color: r.color }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-white">{r.area}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.pergunta}</p>
              </div>
              {isOpen ? <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
            </button>

            {isOpen && (
              <div className="p-4" style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                <textarea
                  className="input w-full"
                  rows={4}
                  placeholder="Escreva sua reflexão aqui..."
                  value={respostas[r.area] || ''}
                  onChange={e => setRespostas({ ...respostas, [r.area]: e.target.value })}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Em breve estas respostas alimentarao o seu perfil de IA personalizado.
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function EspiritualTab() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Intro */}
      <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d1225 100%)', border: '1px solid #4C1D9560' }}>
        <div className="flex items-center gap-3 mb-3">
          <Moon size={20} color="#8B5CF6" />
          <p className="font-semibold text-white">Dimensão Espiritual</p>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          A espiritualidade no contexto do Sirius Hub não é dogma — é a dimensão do autoconhecimento profundo, da conexão com propósito superior e do entendimento das leis universais que você já estudou.
        </p>
      </div>

      {/* 7 Principios Herméticos */}
      <div>
        <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Star size={14} color="#8B5CF6" />
          Os 7 Princípios Herméticos — O Caibalion
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRINCIPIOS_HERMETICOS.map(p => {
            const Icon = p.icon
            return (
              <div key={p.num} className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold" style={{ color: '#8B5CF6' }}>Princípio {p.num}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} color="#8B5CF6" />
                  <p className="font-bold text-sm text-white">{p.nome}</p>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Diário Espiritual */}
      <div>
        <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Sparkles size={14} color="#F59E0B" />
          Diário de Práticas e Sincronicidades
        </p>
        <div className="p-4 rounded-xl space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <textarea className="input w-full" rows={4} placeholder="Registre sonhos, sincronicidades, insights meditativos, percepções espirituais do dia..." />
          <div className="flex gap-3">
            <select className="input flex-1">
              <option>Sincronicidade</option>
              <option>Sonho</option>
              <option>Meditação</option>
              <option>Insight</option>
              <option>Manifestação</option>
              <option>Ritual</option>
            </select>
            <button className="btn-primary px-6">Registrar</button>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Em breve: histórico de registros e padrões de sincronicidade detectados por IA.</p>
        </div>
      </div>
    </div>
  )
}

function ChatIATab() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Olá, Breno. Sou a IA do seu Second Brain. Tenho acesso a tudo que você registrou aqui — seus livros, notas, reflexões pessoais e princípios espirituais. Me pergunte qualquer coisa sobre você mesmo, sua jornada, seus padrões ou peça insights baseados no que você estudou.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    // Simulated AI response - in production, connect to /api/brain/chat
    await new Promise(r => setTimeout(r, 1200))
    const aiResponse = `Baseado no seu Second Brain: "${userMsg}" — Esta funcionalidade conectará ao seu histórico completo de livros, notas e reflexões para gerar insights personalizados. Configure a chave de API da IA em Integrações para ativar.`
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }])
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed" style={{
              background: m.role === 'user' ? 'var(--accent)' : 'var(--surface)',
              color: m.role === 'user' ? '#fff' : 'var(--text-secondary)',
              border: m.role === 'ai' ? '1px solid var(--border)' : 'none',
            }}>
              {m.role === 'ai' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Brain size={12} color="var(--accent)" />
                  <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Sirius Brain</span>
                </div>
              )}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          className="input flex-1"
          placeholder="Pergunte algo sobre você, seus padrões, seus livros..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
        />
        <button className="btn-primary px-4" onClick={send} disabled={!input.trim() || loading}>
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

const TABS: { key: Tab; label: string; icon: typeof Brain }[] = [
  { key: 'biblioteca', label: 'Biblioteca', icon: BookOpen },
  { key: 'notas', label: 'Notas', icon: StickyNote },
  { key: 'pessoal', label: 'Pessoal', icon: User },
  { key: 'espiritual', label: 'Espiritual', icon: Moon },
  { key: 'chat', label: 'Chat IA', icon: Sparkles },
]

export default function SecondBrainPage() {
  const [tab, setTab] = useState<Tab>('biblioteca')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain size={24} color="var(--accent)" />
          Second Brain
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Sua memória expandida — livros, notas, reflexões pessoais, dimensão espiritual e IA personalizada
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: 'var(--surface)' }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0" style={{
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? '#fff' : 'var(--text-muted)',
            }}>
              <Icon size={15} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {tab === 'biblioteca' && <BibliotecaTab />}
      {tab === 'notas' && <NotasTab />}
      {tab === 'pessoal' && <PessoalTab />}
      {tab === 'espiritual' && <EspiritualTab />}
      {tab === 'chat' && <ChatIATab />}
    </div>
  )
}
