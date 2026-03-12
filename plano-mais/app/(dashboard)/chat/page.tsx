'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Bot, UserCheck, BellRing, Search, Send, Phone,
  Info, X, AlertTriangle, CheckCheck, Check,
  FileText, MessageSquare, Zap, ChevronDown, Clock,
  Paperclip, ArrowLeftRight, Headphones, Download, Mic, Square,
  Link2,
} from 'lucide-react'
import { getFaseBadge, getRiscoBadge, formatRelativeTime, getAvatarColor, formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

// ====================================================================
// TIPOS
// ====================================================================
type TipoMsg = 'mensagem' | 'nota_interna'
interface Msg { id: string; remetente: 'BOT' | 'LEAD' | 'ATENDENTE'; conteudo: string; hora: string; status?: string; tipo?: TipoMsg; arquivo_url?: string; arquivo_nome?: string }
interface Conversa { id: string; lead_id: string; atendente_id: string | null; nome: string; telefone: string; plano: string; fase: string; risco: string; tipo: 'BOT' | 'HUMANO' | 'MISTO'; status: 'aberta' | 'transferida' | 'fechada'; prioridade: boolean; hora: string; nao_lidas: number; ultima_mensagem: string; ultima_msg_remetente: 'BOT' | 'LEAD' | 'ATENDENTE'; total_msgs: number }

// ====================================================================
// HELPERS — mapear Supabase → tipos locais
// ====================================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapConversa(d: any): Conversa {
  const lead = d.lead || {}
  return {
    id: d.id,
    lead_id: d.lead_id,
    atendente_id: d.atendente_id || null,
    nome: lead.nome || 'Lead',
    telefone: lead.telefone || '',
    plano: lead.plano || '',
    fase: lead.fase_cobranca || 'mes1',
    risco: 'baixo',
    tipo: d.tipo || 'BOT',
    status: d.status || 'aberta',
    prioridade: d.prioridade || false,
    hora: formatRelativeTime(d.updated_at || d.created_at),
    nao_lidas: 0,
    ultima_mensagem: d.ultima_msg_conteudo || '',
    ultima_msg_remetente: (d.ultima_msg_remetente as 'BOT' | 'LEAD' | 'ATENDENTE') || 'BOT',
    total_msgs: Number(d.total_msgs) || 0,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMsg(d: any): Msg {
  return {
    id: d.id,
    remetente: d.remetente as 'BOT' | 'LEAD' | 'ATENDENTE',
    conteudo: d.conteudo,
    hora: new Date(d.timestamp || d.criado_em || d.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    tipo: d.tipo === 'nota_interna' ? 'nota_interna' : 'mensagem',
    arquivo_url: d.arquivo_url || undefined,
    arquivo_nome: d.arquivo_nome || undefined,
  }
}

const CONVERSA_VAZIA: Conversa = { id: '', lead_id: '', atendente_id: null, nome: '', telefone: '', plano: '', fase: 'mes1', risco: 'baixo', tipo: 'BOT', status: 'aberta', prioridade: false, hora: '', nao_lidas: 0, ultima_mensagem: '', ultima_msg_remetente: 'BOT', total_msgs: 0 }

const RESPOSTAS_RAPIDAS = [
  { id: 'r1', titulo: 'Saudação inicial', texto: 'Olá! Aqui é [seu nome] da Plano Mais Assistencial. Como posso ajudar você hoje?' },
  { id: 'r2', titulo: 'Um momento', texto: 'Só um instante, vou verificar isso para você.' },
  { id: 'r3', titulo: 'Oferta de parcelamento', texto: 'Podemos parcelar em até 3x sem juros. Deseja que eu gere o link de pagamento?' },
  { id: 'r4', titulo: 'Link de checkout', texto: 'Aqui está o link para regularização do seu plano: [link]' },
  { id: 'r5', titulo: 'Encerrar atendimento', texto: 'Foi um prazer ajudar! Qualquer dúvida, estamos aqui. Tenha um ótimo dia!' },
  { id: 'r6', titulo: 'Aguardar aprovação', texto: 'Preciso consultar com nossa equipe sobre esse desconto. Posso retornar em breve?' },
]

// ====================================================================
// COMPONENTES AUXILIARES
// ====================================================================
function Avatar({ nome, size = 38 }: { nome: string; size?: number }) {
  const color = getAvatarColor(nome)
  const initials = nome.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: `linear-gradient(135deg, ${color}, ${color}BB)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: size * 0.32, color: '#fff',
    }}>{initials}</div>
  )
}

// ====================================================================
// PAINEL DE INFORMAÇÕES DO LEAD (direita)
// ====================================================================
function InfoPanel({ conversa, userId, onClose }: { conversa: Conversa; userId: string | null; onClose: () => void }) {
  const supabase = createClient()
  const fase = getFaseBadge(conversa.fase)
  const risco = getRiscoBadge(conversa.risco)
  const [notaTexto, setNotaTexto] = useState('')
  const [salvandoNota, setSalvandoNota] = useState(false)
  const [notas, setNotas] = useState<{ id: string; conteudo: string; created_at: string }[]>([])

  // Carrega notas do lead quando abre
  useEffect(() => {
    if (!conversa.lead_id) return
    supabase.from('notas_crm')
      .select('id, conteudo, created_at')
      .eq('lead_id', conversa.lead_id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data) setNotas(data) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversa.lead_id])

  async function handleSalvarNota() {
    if (!notaTexto.trim() || !conversa.lead_id || !userId) return
    setSalvandoNota(true)
    const { data } = await supabase.from('notas_crm')
      .insert({ lead_id: conversa.lead_id, usuario_id: userId, conteudo: notaTexto.trim(), tipo: 'geral' })
      .select('id, conteudo, created_at')
      .single()
    if (data) {
      setNotas(prev => [data, ...prev])
      setNotaTexto('')
    }
    setSalvandoNota(false)
  }

  return (
    <div style={{ width: 280, borderLeft: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>Informações</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <X size={15} color="var(--text-muted)" />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <Avatar nome={conversa.nome} size={52} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14 }}>{conversa.nome}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{conversa.telefone}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className={fase.className}>{fase.label}</span>
            <span className={risco.className}>{risco.label}</span>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8 }}>DADOS DO PLANO</div>
          {[
            { label: 'Plano', value: conversa.plano },
            { label: 'Fase', value: fase.label },
            { label: 'Telefone', value: conversa.telefone },
            { label: 'Mensagens', value: `${conversa.total_msgs} trocadas` },
          ].map(i => (
            <div key={i.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>{i.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{i.value}</span>
            </div>
          ))}
        </div>

        {/* Notas do CRM — persistidas no banco */}
        <div>
          <div style={{ fontSize: 10, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8 }}>NOTAS DO LEAD</div>
          <textarea
            className="input-field"
            placeholder="Nova nota sobre este lead..."
            style={{ height: 72, resize: 'none', fontSize: 12 }}
            value={notaTexto}
            onChange={e => setNotaTexto(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSalvarNota() }}
          />
          <button
            className="btn-secondary"
            style={{ marginTop: 6, width: '100%', justifyContent: 'center', fontSize: 12 }}
            onClick={handleSalvarNota}
            disabled={salvandoNota || !notaTexto.trim()}
          >
            {salvandoNota ? 'Salvando...' : 'Salvar Nota'}
          </button>

          {/* Histórico de notas */}
          {notas.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notas.map(n => (
                <div key={n.id} style={{ padding: '8px 10px', background: 'rgba(214,137,16,0.07)', border: '1px solid rgba(214,137,16,0.18)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.conteudo}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    {new Date(n.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ====================================================================
// PÁGINA PRINCIPAL
// ====================================================================
export default function ChatPage() {
  const supabase = createClient()
  const { perfil } = useAuth()
  const isGestor = perfil?.role === 'gestor'

  const [userId, setUserId] = useState<string | null>(null)
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [conversaAtiva, setConversaAtiva] = useState<Conversa>(CONVERSA_VAZIA)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [mapaAtendentes, setMapaAtendentes] = useState<Record<string, string>>({})
  const [tabLista, setTabLista] = useState<'minhas' | 'fila' | 'historico'>('historico')
  const [mensagem, setMensagem] = useState('')
  const [tipoInput, setTipoInput] = useState<TipoMsg>('mensagem')
  const [showRapidas, setShowRapidas] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [respostas, setRespostas] = useState<{ id: string; titulo: string; texto: string }[]>([])
  const [showTransferir, setShowTransferir] = useState(false)
  const [atendentesOnline, setAtendentesOnline] = useState<{ id: string; nome: string }[]>([])
  const [busca, setBusca] = useState('')
  const [gerandoLink, setGerandoLink] = useState(false)
  const [linkGerado, setLinkGerado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [uploadando, setUploadando] = useState(false)
  const [uploadErro, setUploadErro] = useState<string | null>(null)
  const [gravando, setGravando] = useState(false)
  const [tempoGravacao, setTempoGravacao] = useState(0)
  const [arquivoPreview, setArquivoPreview] = useState<{ blob: Blob; url: string; nome: string; tipo: 'imagem' | 'audio' | 'video' | 'documento' } | null>(null)
  const [legendaArquivo, setLegendaArquivo] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cleanup: libera microfone e timer ao sair da página
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      if (timerRef.current) clearInterval(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Carregar user atual
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Carregar conversas do Supabase
  useEffect(() => {
    async function loadConversas() {
      const { data } = await supabase
        .from('conversas')
        .select(`
          id, lead_id, status, tipo, created_at, updated_at, atendente_id, prioridade,
          ultima_msg_conteudo, ultima_msg_remetente, total_msgs,
          lead:leads(nome, telefone, plano, fase_cobranca)
        `)
        .order('updated_at', { ascending: false })

      if (data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = data.map((d: any) => mapConversa(d))
        setConversas(mapped)
        if (mapped.length > 0) setConversaAtiva(mapped[0])
      }
    }
    loadConversas()

    // Realtime — nova mensagem de LEAD atualiza o preview da lista
    const chConversas = supabase
      .channel('conversas-lista')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversas',
      }, (payload) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const upd = payload.new as any
        setConversas(prev => {
          const existe = prev.find(c => c.id === upd.id)
          if (!existe) return prev
          const atualizado = { ...existe,
            status: upd.status || existe.status,
            tipo: upd.tipo || existe.tipo,
            prioridade: upd.prioridade ?? existe.prioridade,
            ultima_mensagem: upd.ultima_msg_conteudo ?? existe.ultima_mensagem,
            ultima_msg_remetente: upd.ultima_msg_remetente ?? existe.ultima_msg_remetente,
            total_msgs: upd.total_msgs ?? existe.total_msgs,
            atendente_id: upd.atendente_id ?? existe.atendente_id,
            hora: formatRelativeTime(upd.updated_at || upd.created_at),
          }
          // Move para o topo (mais recente)
          return [atualizado, ...prev.filter(c => c.id !== upd.id)]
        })
        // Sincroniza conversaAtiva se for a mesma
        setConversaAtiva(prev => prev.id === upd.id
          ? { ...prev, status: upd.status || prev.status, tipo: upd.tipo || prev.tipo, atendente_id: upd.atendente_id ?? prev.atendente_id }
          : prev
        )
      })
      .subscribe()

    return () => { supabase.removeChannel(chConversas) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Carregar mapa de atendentes (gestor precisa ver nome de quem atende cada conversa)
  useEffect(() => {
    if (!isGestor) return
    supabase.from('usuarios')
      .select('id, nome')
      .then(({ data }) => {
        if (data) {
          const mapa: Record<string, string> = {}
          data.forEach((u: { id: string; nome: string }) => { mapa[u.id] = u.nome })
          setMapaAtendentes(mapa)
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGestor])

  // Carregar respostas rápidas do banco
  useEffect(() => {
    supabase.from('respostas_rapidas')
      .select('id, titulo, texto')
      .eq('ativo', true)
      .order('ordem', { ascending: true })
      .then(({ data }) => { if (data) setRespostas(data) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Carregar mensagens quando trocar de conversa + Realtime
  useEffect(() => {
    if (!conversaAtiva.id) return

    async function loadMensagens() {
      const { data, error } = await supabase
        .from('mensagens')
        .select('id, remetente, conteudo, tipo, timestamp, arquivo_url, arquivo_nome')
        .eq('conversa_id', conversaAtiva.id)
        .order('timestamp', { ascending: true })
      if (error) console.error('[chat] loadMensagens error:', error)
      if (data) setMsgs(data.map(mapMsg))
    }
    loadMensagens()

    // Realtime — novas mensagens aparecem automaticamente
    const channel = supabase
      .channel(`chat-${conversaAtiva.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mensagens',
        filter: `conversa_id=eq.${conversaAtiva.id}`,
      }, (payload) => {
        setMsgs(prev => [...prev, mapMsg(payload.new)])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversaAtiva.id])

  // Rolar para o fim das mensagens
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [msgs])

  const isHumano = conversaAtiva.tipo === 'HUMANO' || conversaAtiva.tipo === 'MISTO'
  const isMinhaConversa = conversaAtiva.atendente_id === userId

  // Gestor: "Em Atendimento" = todas com atendente; Atendente: "Minhas" = só as suas
  const minhas = isGestor
    ? conversas.filter(c => c.atendente_id !== null && c.status !== 'fechada')
    : conversas.filter(c => c.atendente_id === userId && c.status !== 'fechada')
  // Fila = sem atendente + precisam de atendimento humano (tipo != BOT) + não fechadas
  const fila = conversas.filter(c => !c.atendente_id && c.tipo !== 'BOT' && c.status !== 'fechada')
  // Histórico = BOT ainda ativo (sem atendente humano) + todas as encerradas
  const historico = conversas.filter(c =>
    (c.tipo === 'BOT' && c.status !== 'fechada') || c.status === 'fechada'
  )

  const listaAtiva = tabLista === 'minhas' ? minhas : tabLista === 'fila' ? fila : historico

  const listaFiltrada = listaAtiva.filter(c =>
    !busca || c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca)
  )

  // Nota interna: disponível em qualquer conversa aberta ou fechada
  // Mensagem normal: só quando é minha conversa ativa
  const podeEnviarMsg = isMinhaConversa && conversaAtiva.status !== 'fechada'
  const podeEnviarNota = !!conversaAtiva.id

  async function handleEnviar() {
    const podeEnviar = tipoInput === 'nota_interna' ? podeEnviarNota : podeEnviarMsg
    if (!mensagem.trim() || enviando || !podeEnviar) return
    setEnviando(true)
    const texto = mensagem.trim()
    setMensagem('')

    // Chama API route que salva no banco E envia via WhatsApp
    const res = await fetch('/api/enviar-mensagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversa_id: conversaAtiva.id, conteudo: texto, tipo: tipoInput }),
    })
    const json = await res.json()

    if (res.ok && json.msg) {
      setMsgs(prev => [...prev, mapMsg(json.msg)])
      // Nota interna NÃO atualiza preview na lista (é interna)
      if (tipoInput === 'nota_interna') {
        setConversas(prev => prev.map(c =>
          c.id === conversaAtiva.id ? { ...c, total_msgs: c.total_msgs + 1 } : c
        ))
      } else {
        setConversas(prev => prev.map(c =>
          c.id === conversaAtiva.id ? { ...c, ultima_mensagem: texto, ultima_msg_remetente: 'ATENDENTE', total_msgs: c.total_msgs + 1 } : c
        ))
        // Avisa se Z-API falhou
        if (json._wa && json._wa.ok === false) {
          setUploadErro(`Salvo, mas NÃO enviado ao WhatsApp. Z-API: ${json._wa.response || 'erro desconhecido'}`)
        }
      }
    }
    setEnviando(false)
  }

  async function handleGerarLinkCheckout() {
    if (!conversaAtiva.lead_id || gerandoLink) return
    setGerandoLink(true)
    try {
      const res = await fetch('/api/checkout/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: conversaAtiva.lead_id, enviar_whatsapp: true }),
      })
      const data = await res.json()
      if (data.checkout_url) {
        await navigator.clipboard.writeText(data.checkout_url)
        setLinkGerado(true)
        setTimeout(() => setLinkGerado(false), 3000)
      }
    } catch {
      // silently fail
    } finally {
      setGerandoLink(false)
    }
  }

  async function handleAssumirConversa() {
    if (!conversaAtiva.id || !userId) return
    const { error } = await supabase
      .from('conversas')
      .update({ tipo: 'HUMANO', atendente_id: userId, status: 'aberta' })
      .eq('id', conversaAtiva.id)
    if (!error) {
      const updated = { ...conversaAtiva, tipo: 'HUMANO' as const, atendente_id: userId, status: 'aberta' as const }
      setConversaAtiva(updated)
      setConversas(prev => prev.map(c => c.id === conversaAtiva.id ? updated : c))
      setTabLista('minhas')
    }
  }

  async function openTransferModal() {
    const { data } = await supabase
      .from('usuarios')
      .select('id, nome')
      .eq('status_online', 'online')
      .neq('id', userId ?? '')
    setAtendentesOnline(data || [])
    setShowTransferir(true)
  }

  async function handleTransferirConversa(paraId: string | null) {
    if (!conversaAtiva.id) return
    if (paraId) {
      // Transfere para atendente online específico → vai para o "Minhas" dele
      await supabase.from('conversas')
        .update({ atendente_id: paraId, tipo: 'HUMANO', status: 'aberta' })
        .eq('id', conversaAtiva.id)
      const updated = { ...conversaAtiva, atendente_id: paraId, tipo: 'HUMANO' as const, status: 'aberta' as const }
      setConversaAtiva(updated)
      setConversas(prev => prev.map(c => c.id === conversaAtiva.id ? updated : c))
    } else {
      // Nenhum online — vai para Fila (sem atendente, tipo mantém HUMANO para aparecer na fila)
      await supabase.from('conversas')
        .update({ atendente_id: null, tipo: 'HUMANO', status: 'aberta' })
        .eq('id', conversaAtiva.id)
      const updated = { ...conversaAtiva, atendente_id: null, tipo: 'HUMANO' as const, status: 'aberta' as const }
      setConversaAtiva(updated)
      setConversas(prev => prev.map(c => c.id === conversaAtiva.id ? updated : c))
      setTabLista('fila')
    }
    setShowTransferir(false)
  }

  function handleUploadArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !conversaAtiva.id) return
    e.target.value = ''
    const tipo: 'imagem' | 'audio' | 'video' | 'documento' = file.type.startsWith('audio/') ? 'audio'
      : file.type.startsWith('image/') ? 'imagem'
      : file.type.startsWith('video/') ? 'video'
      : 'documento'
    const url = URL.createObjectURL(file)
    setArquivoPreview({ blob: file, url, nome: file.name, tipo })
    setLegendaArquivo('')
  }

  async function handleToggleGravacao() {
    if (gravando) {
      // Para gravação
      mediaRecorderRef.current?.stop()
      return
    }
    setUploadErro(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Prioriza ogg/opus (Firefox) → aceito nativamente pelo WhatsApp como voz
      // Fallback para webm/opus (Chrome) se ogg não for suportado
      // Chrome só suporta webm, Firefox suporta ogg — preferimos ogg pois WhatsApp aceita nativamente
      const mimePreferido = ['audio/ogg;codecs=opus', 'audio/ogg', 'audio/webm;codecs=opus', 'audio/webm']
        .find(m => MediaRecorder.isTypeSupported(m)) ?? ''

      const mr = new MediaRecorder(stream, mimePreferido ? { mimeType: mimePreferido } : undefined)
      streamRef.current = stream  // guarda referência para cleanup
      chunksRef.current = []

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }

      mr.onstop = () => {
        // Para todas as tracks e libera o microfone
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
        setGravando(false)
        setTempoGravacao(0)

        const mimeType = mr.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        if (blob.size < 500) return

        const ext = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'mp4' : 'webm'
        const url = URL.createObjectURL(blob)
        const nome = `audio_${Date.now()}.${ext}`
        setArquivoPreview({ blob, url, nome, tipo: 'audio' })
        setLegendaArquivo('')
      }

      mediaRecorderRef.current = mr
      // Aguarda 300ms para o microfone estabilizar antes de iniciar contador e gravação efetiva
      await new Promise(r => setTimeout(r, 300))
      mr.start(250) // coleta a cada 250ms — evita perda de chunks e melhora duração no container
      setGravando(true)
      setTempoGravacao(0)
      timerRef.current = setInterval(() => setTempoGravacao(t => t + 1), 1000)
    } catch {
      setUploadErro('Permissão de microfone negada ou não disponível.')
    }
  }

  async function handleConfirmarArquivo() {
    if (!arquivoPreview) return
    const { blob, nome, tipo } = arquivoPreview
    // Revogar object URL para liberar memória
    URL.revokeObjectURL(arquivoPreview.url)
    setArquivoPreview(null)
    // Enviar com legenda (conteúdo da mensagem que acompanha)
    await enviarArquivoBlobComLegenda(blob, nome, tipo, legendaArquivo.trim())
    setLegendaArquivo('')
  }

  function handleCancelarArquivo() {
    if (arquivoPreview) URL.revokeObjectURL(arquivoPreview.url)
    setArquivoPreview(null)
    setLegendaArquivo('')
  }

  async function enviarArquivoBlobComLegenda(blob: Blob, nome: string, tipo: string, legenda: string) {
    if (!conversaAtiva.id) return
    setUploadErro(null)
    setUploadando(true)

    // Usa o mime type real do blob para extensão e content-type corretos
    const mimeReal = blob.type || 'application/octet-stream'
    const ext = nome.split('.').pop() ?? (mimeReal.includes('ogg') ? 'ogg' : mimeReal.includes('mp4') ? 'mp4' : 'webm')
    const nomeComExt = nome.includes('.') ? nome : `${nome}.${ext}`
    const path = `${conversaAtiva.id}/${Date.now()}.${ext}`

    const { data: upload, error: upErr } = await supabase.storage
      .from('mensagens')
      .upload(path, blob, { upsert: false, contentType: mimeReal })

    if (upErr) {
      console.error('Erro upload:', upErr)
      setUploadErro(`Erro ao enviar: ${upErr.message}. Verifique se o bucket "mensagens" existe no Supabase Storage.`)
      setUploadando(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('mensagens').getPublicUrl(upload.path)

    const res = await fetch('/api/enviar-mensagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversa_id: conversaAtiva.id,
        conteudo: legenda || nomeComExt,
        tipo,
        arquivo_url: publicUrl,
        arquivo_nome: nomeComExt,
      }),
    })
    const json = await res.json()
    if (res.ok && json.msg) {
      setMsgs(prev => [...prev, mapMsg(json.msg)])
      setConversas(prev => prev.map(c =>
        c.id === conversaAtiva.id ? { ...c, ultima_mensagem: legenda || nome, ultima_msg_remetente: 'ATENDENTE', total_msgs: c.total_msgs + 1 } : c
      ))
      // Avisa se Z-API falhou (mensagem salva no banco mas NÃO chegou no WhatsApp)
      if (json._wa && json._wa.ok === false) {
        setUploadErro(`Salvo, mas NÃO enviado ao WhatsApp. Z-API retornou: ${json._wa.response || 'erro desconhecido'}`)
      }
    } else {
      setUploadErro(json.error || 'Erro ao registrar mensagem')
    }
    setUploadando(false)
  }

  const faseBadge = getFaseBadge(conversaAtiva.fase)

  return (
    // Sai do padding do layout com margens negativas e ocupa tela toda
    <div style={{ margin: '-28px -32px', height: 'calc(100vh - 60px)', display: 'flex', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ============================================================
          COLUNA ESQUERDA — Lista de conversas (340px fixo)
          ============================================================ */}
      <div style={{ width: 340, borderRight: '1px solid var(--border)', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Tabs Em Atendimento / Fila / Histórico */}
        <div style={{ padding: '12px 16px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {([
              { key: 'minhas', label: isGestor ? 'Em Atendimento' : 'Minhas', count: minhas.length },
              { key: 'fila', label: 'Fila', count: fila.length },
              { key: 'historico', label: 'Histórico', count: historico.length },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setTabLista(tab.key)}
                style={{
                  flex: 1, padding: '8px 0', background: 'none', border: 'none',
                  borderBottom: tabLista === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                  color: tabLista === tab.key ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: tabLista === tab.key ? 700 : 500,
                  fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  marginBottom: -1,
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span style={{
                    background: tab.key === 'fila'
                      ? (tabLista === 'fila' ? '#DC2626' : 'rgba(220,38,38,0.12)')
                      : (tabLista === tab.key ? 'var(--accent)' : 'var(--surface-2)'),
                    color: tab.key === 'fila'
                      ? (tabLista === 'fila' ? '#fff' : '#DC2626')
                      : (tabLista === tab.key ? '#fff' : 'var(--text-muted)'),
                    padding: '1px 6px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  }}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Busca */}
        <div style={{ padding: '10px 12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-field"
              placeholder="Buscar nome ou telefone"
              style={{ paddingLeft: 30, fontSize: 12, padding: '7px 10px 7px 30px' }}
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Aviso de fila */}
        {tabLista === 'fila' && fila.length > 0 && (
          <div style={{ padding: '6px 14px', background: 'rgba(214,137,16,0.08)', borderBottom: '1px solid rgba(214,137,16,0.18)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BellRing size={12} color="var(--warning)" />
            <span style={{ fontSize: 11, color: 'var(--warning)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{fila.length} cliente{fila.length > 1 ? 's' : ''} aguardando</span>
          </div>
        )}

        {/* Lista */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {listaFiltrada.length === 0 && (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              {tabLista === 'minhas'
                ? (isGestor ? 'Nenhuma conversa em atendimento' : 'Nenhuma conversa ativa')
                : tabLista === 'fila' ? 'Nenhum cliente na fila' : 'Sem histórico'}
            </div>
          )}
          {listaFiltrada.map(c => {
            const ativa = c.id === conversaAtiva.id
            const fBadge = getFaseBadge(c.fase)
            return (
              <div
                key={c.id}
                onClick={() => setConversaAtiva(c)}
                style={{
                  padding: '11px 14px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: ativa ? 'rgba(13,61,204,0.05)' : 'transparent',
                  borderLeft: ativa ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <Avatar nome={c.nome} size={36} />
                    <div style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 10, height: 10, borderRadius: '50%',
                      background: c.tipo === 'HUMANO' ? 'var(--teal)' : c.status === 'transferida' ? 'var(--warning)' : 'var(--accent)',
                      border: '1.5px solid var(--card-bg)',
                    }} />
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13 }}>{c.nome.split(' ').slice(0, 2).join(' ')}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{c.hora}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span className={fBadge.className} style={{ fontSize: 9, padding: '1px 6px' }}>{fBadge.label}</span>
                      {c.prioridade && <span className="badge badge-magenta" style={{ fontSize: 9, padding: '1px 6px' }}>Urgente</span>}
                      {c.status === 'fechada'
                        ? <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 5, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, letterSpacing: '0.05em', background: 'rgba(220,38,38,0.10)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.22)' }}>ENCERRADA</span>
                        : c.tipo === 'BOT'
                        ? <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 5, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, letterSpacing: '0.05em', background: 'rgba(13,61,204,0.10)', color: '#0D3DCC', border: '1px solid rgba(13,61,204,0.22)' }}>BOT</span>
                        : <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 5, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, letterSpacing: '0.05em', background: 'rgba(11,191,170,0.10)', color: '#0BBFAA', border: '1px solid rgba(11,191,170,0.22)' }}>ATENDIMENTO</span>
                      }
                      {/* Tag do atendente — visível apenas para gestor em conversas com atendente */}
                      {isGestor && c.atendente_id && mapaAtendentes[c.atendente_id] && (
                        <span style={{ fontSize: 9, padding: '1px 7px', borderRadius: 5, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, letterSpacing: '0.04em', background: 'rgba(232,27,143,0.08)', color: '#E81B8F', border: '1px solid rgba(232,27,143,0.22)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <UserCheck size={8} />
                          {mapaAtendentes[c.atendente_id].split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 185, fontStyle: c.ultima_msg_remetente !== 'LEAD' ? 'italic' : 'normal' }}>
                        {c.ultima_msg_remetente !== 'LEAD' && 'Bot: '}{c.ultima_mensagem}
                      </span>
                      {c.nao_lidas > 0 && (
                        <div style={{ minWidth: 18, height: 18, borderRadius: 9, background: 'var(--magenta)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginLeft: 4 }}>{c.nao_lidas}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ============================================================
          ÁREA PRINCIPAL — Chat + Info
          ============================================================ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        {/* Header do chat */}
        <div style={{ padding: '10px 20px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <Avatar nome={conversaAtiva.nome} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 15 }}>{conversaAtiva.nome}</span>
              {conversaAtiva.prioridade && <span className="badge badge-magenta">Urgência</span>}
              {conversaAtiva.tipo === 'HUMANO' && <span className="badge badge-teal">Em Atendimento</span>}
              {conversaAtiva.status === 'transferida' && <span className="badge badge-orange">Aguardando atendente</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Phone size={11} /> {conversaAtiva.telefone}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{conversaAtiva.plano}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{conversaAtiva.total_msgs} msgs</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => setShowInfo(p => !p)}
              className={showInfo ? 'btn-secondary' : 'btn-ghost'}
              style={{ padding: '7px 14px', fontSize: 12 }}
            >
              <Info size={13} />
              Info
            </button>
            {isMinhaConversa && conversaAtiva.status !== 'fechada' ? (
              <>
                <button
                  className={linkGerado ? 'btn-secondary' : 'btn-ghost'}
                  style={{ fontSize: 12, color: linkGerado ? 'var(--success)' : 'var(--text-secondary)' }}
                  onClick={handleGerarLinkCheckout}
                  disabled={gerandoLink}
                  title="Gerar e enviar link de checkout via WhatsApp"
                >
                  <Link2 size={13} />
                  {gerandoLink ? 'Gerando...' : linkGerado ? 'Copiado!' : 'Gerar Link'}
                </button>
                <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--text-secondary)' }}
                  onClick={async () => {
                    await supabase.from('conversas').update({ tipo: 'BOT', atendente_id: null }).eq('id', conversaAtiva.id)
                    const updated = { ...conversaAtiva, tipo: 'BOT' as const, atendente_id: null }
                    setConversaAtiva(updated)
                    setConversas(prev => prev.map(c => c.id === conversaAtiva.id ? updated : c))
                    setTabLista('historico')
                  }}
                >
                  <Bot size={13} />
                  Devolver ao Bot
                </button>
                <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--text-secondary)' }}
                  onClick={openTransferModal}
                >
                  <ArrowLeftRight size={13} />
                  Transferir
                </button>
                <button className="btn-danger" style={{ fontSize: 12, padding: '7px 14px' }}
                  onClick={async () => {
                    const { error } = await supabase.from('conversas').update({
                      status: 'fechada',
                      tipo: 'BOT',
                      atendente_id: null,
                    }).eq('id', conversaAtiva.id)
                    if (!error) {
                      const updated = { ...conversaAtiva, status: 'fechada' as const, tipo: 'BOT' as const, atendente_id: null }
                      setConversas(prev => prev.map(c => c.id === conversaAtiva.id ? updated : c))
                      setConversaAtiva(updated)
                      setTabLista('historico')
                    }
                  }}
                >
                  <X size={13} />
                  Finalizar
                </button>
              </>
            ) : (
              // Assumir sempre disponível — funciona para BOT, de outro atendente, ou encerrada (reabre)
              <button className="btn-primary" style={{ fontSize: 12, padding: '7px 16px' }}
                onClick={handleAssumirConversa}
                disabled={!conversaAtiva.id}
              >
                <UserCheck size={13} />
                {conversaAtiva.status === 'fechada' ? 'Reabrir Conversa' : 'Assumir Conversa'}
              </button>
            )}
          </div>
        </div>

        {/* Área de mensagens + info panel */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Banner para conversas sem atendente (na fila) */}
            {!isMinhaConversa && conversaAtiva.id && conversaAtiva.tipo === 'BOT' && (
              <div style={{ padding: '12px 20px', background: 'rgba(13,61,204,0.05)', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={13} color="var(--accent)" />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Bot ativo — assuma para responder ao cliente</span>
                </div>
                <button className="btn-primary" style={{ fontSize: 12, padding: '6px 14px', flexShrink: 0 }} onClick={handleAssumirConversa}>
                  <Zap size={12} />
                  Assumir
                </button>
              </div>
            )}

            {/* Alerta urgente */}
            {conversaAtiva.prioridade && (
              <div style={{ padding: '8px 20px', background: 'rgba(232,27,143,0.06)', borderBottom: '1px solid rgba(232,27,143,0.15)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={13} color="var(--magenta)" />
                <span style={{ fontSize: 12, color: 'var(--magenta)', fontWeight: 600 }}>Lead sinalizou intenção de cancelar — Atendente B recomendado</span>
              </div>
            )}

            {/* Mensagens */}
            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {msgs.map((msg, i) => {
                const isLead = msg.remetente === 'LEAD'
                const isBot = msg.remetente === 'BOT'
                const isNotaInterna = msg.tipo === 'nota_interna'

                // Nota interna — estilo especial amarelo
                if (isNotaInterna) {
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                      <div style={{ maxWidth: '70%', padding: '8px 14px', background: 'rgba(214,137,16,0.10)', border: '1px solid rgba(214,137,16,0.25)', borderRadius: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <FileText size={13} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--warning)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 3 }}>NOTA INTERNA</div>
                          <div style={{ fontSize: 12, color: '#4A3000' }}>{msg.conteudo}</div>
                        </div>
                      </div>
                    </div>
                  )
                }

                // Lead = esquerda, Bot/Atendente = direita
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isLead ? 'flex-start' : 'flex-end', marginBottom: 2 }}>
                    <div style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: isLead ? 'flex-start' : 'flex-end' }}>

                      {/* Label do remetente não-lead */}
                      {!isLead && (i === 0 || msgs[i - 1]?.remetente !== msg.remetente) && (
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: 1 }}>
                          {isBot ? 'Bot' : 'Atendente'}
                        </span>
                      )}

                      <div style={{
                        padding: '9px 13px',
                        borderRadius: isLead ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                        background: isLead ? 'var(--card-bg)' : isBot ? '#F0F2F8' : 'var(--accent)',
                        color: isLead ? 'var(--text-primary)' : isBot ? 'var(--text-primary)' : '#fff',
                        border: isLead ? '1px solid var(--card-border)' : isBot ? '1px solid rgba(13,61,204,0.10)' : 'none',
                        fontSize: 13.5,
                        boxShadow: isLead ? 'var(--card-shadow)' : 'none',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                        minWidth: msg.arquivo_url ? 180 : undefined,
                      }}>
                        {msg.arquivo_url ? (
                          // Áudio
                          msg.arquivo_url.match(/\.(mp3|ogg|mp4|aac|webm|wav)$/i) || msg.arquivo_nome?.match(/\.(mp3|ogg|mp4|aac|webm|wav)$/i) ? (
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                <Headphones size={13} color={isLead ? 'var(--accent)' : '#fff'} />
                                <span style={{ fontSize: 11, opacity: 0.8 }}>{msg.arquivo_nome || 'Áudio'}</span>
                              </div>
                              <audio controls src={msg.arquivo_url} style={{ width: '100%', height: 32 }} />
                              {msg.conteudo && msg.conteudo !== msg.arquivo_nome && (
                                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>{msg.conteudo}</div>
                              )}
                            </div>
                          // Imagem
                          ) : msg.arquivo_url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i) || msg.arquivo_nome?.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i) || (msg.arquivo_nome && !msg.arquivo_nome.includes('.')) ? (
                            <div>
                              <img
                                src={msg.arquivo_url}
                                alt={msg.arquivo_nome || 'Imagem'}
                                style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8, display: 'block', cursor: 'pointer' }}
                                onClick={() => window.open(msg.arquivo_url, '_blank')}
                              />
                              {msg.conteudo && msg.conteudo !== msg.arquivo_nome && (
                                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>{msg.conteudo}</div>
                              )}
                            </div>
                          // Documento
                          ) : (
                            <div>
                              <a href={msg.arquivo_url} target="_blank" rel="noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: 8, color: isLead ? 'var(--accent)' : '#fff', textDecoration: 'none' }}
                              >
                                <Download size={14} />
                                <span style={{ fontSize: 12, textDecoration: 'underline' }}>{msg.arquivo_nome || 'Arquivo'}</span>
                              </a>
                              {msg.conteudo && msg.conteudo !== msg.arquivo_nome && (
                                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>{msg.conteudo}</div>
                              )}
                            </div>
                          )
                        ) : msg.conteudo.startsWith('http') ? (
                          <a href={msg.conteudo} target="_blank" rel="noreferrer"
                            style={{ color: isLead ? 'var(--accent)' : '#B8D4FF', fontSize: 12, textDecoration: 'underline' }}>
                            {msg.conteudo}
                          </a>
                        ) : msg.conteudo}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: isLead ? 2 : 0, paddingRight: isLead ? 0 : 2 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{msg.hora}</span>
                        {isLead && msg.status === 'lido' && <CheckCheck size={11} color="var(--teal)" />}
                        {isLead && !msg.status && <Check size={11} color="var(--text-muted)" />}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input de mensagem */}
            <div style={{ padding: '12px 20px', background: 'var(--card-bg)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              {/* Tabs Mensagem | Nota Interna */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                <button
                  onClick={() => setTipoInput('mensagem')}
                  style={{
                    padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    background: tipoInput === 'mensagem' ? 'var(--accent)' : 'transparent',
                    color: tipoInput === 'mensagem' ? '#fff' : 'var(--text-muted)',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <MessageSquare size={12} />Mensagem
                </button>
                <button
                  onClick={() => setTipoInput('nota_interna')}
                  style={{
                    padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                    background: tipoInput === 'nota_interna' ? 'rgba(214,137,16,0.12)' : 'transparent',
                    color: tipoInput === 'nota_interna' ? 'var(--warning)' : 'var(--text-muted)',
                    fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <FileText size={12} />Nota Interna
                </button>
                {/* Respostas rápidas */}
                <div style={{ marginLeft: 'auto', position: 'relative' }}>
                  <button
                    onClick={() => setShowRapidas(p => !p)}
                    style={{
                      padding: '5px 12px', borderRadius: 7, border: '1px solid var(--border)', cursor: 'pointer',
                      background: showRapidas ? 'rgba(13,61,204,0.08)' : 'transparent',
                      color: showRapidas ? 'var(--accent)' : 'var(--text-muted)',
                      fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12,
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    <Zap size={12} />Rápidas
                    <ChevronDown size={11} />
                  </button>
                  {/* Dropdown de respostas rápidas */}
                  {showRapidas && (
                    <div style={{
                      position: 'absolute', bottom: '110%', right: 0,
                      width: 340, background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: 12, boxShadow: '0 8px 28px rgba(13,61,204,0.14)',
                      zIndex: 50, overflow: 'hidden',
                    }}>
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                        RESPOSTAS RÁPIDAS
                      </div>
                      {(respostas.length > 0 ? respostas : []).map(r => (
                        <div
                          key={r.id}
                          onClick={() => { setMensagem(r.texto); setShowRapidas(false) }}
                          style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.1s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{r.titulo}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.texto}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview de arquivo/áudio antes de enviar */}
              {arquivoPreview && (
                <div style={{
                  marginBottom: 10, padding: '12px 14px',
                  background: 'var(--surface-2)', border: '1px solid var(--card-border)',
                  borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      {/* Preview de imagem */}
                      {arquivoPreview.tipo === 'imagem' && (
                        <img
                          src={arquivoPreview.url}
                          alt={arquivoPreview.nome}
                          style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, display: 'block' }}
                        />
                      )}
                      {/* Preview de vídeo */}
                      {arquivoPreview.tipo === 'video' && (
                        <video
                          src={arquivoPreview.url}
                          controls
                          style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, display: 'block' }}
                        />
                      )}
                      {/* Preview de áudio */}
                      {arquivoPreview.tipo === 'audio' && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <Headphones size={14} color="var(--accent)" />
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600 }}>{arquivoPreview.nome}</span>
                          </div>
                          <audio controls src={arquivoPreview.url} style={{ width: '100%', height: 32 }} />
                        </div>
                      )}
                      {/* Preview de documento */}
                      {arquivoPreview.tipo === 'documento' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--card-bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                          <FileText size={20} color="var(--accent)" />
                          <div>
                            <div style={{ fontSize: 12, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 600, color: 'var(--text-primary)' }}>{arquivoPreview.nome}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{(arquivoPreview.blob.size / 1024).toFixed(0)} KB</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleCancelarArquivo}
                      style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: 6, cursor: 'pointer', flexShrink: 0 }}
                    >
                      <X size={14} color="#DC2626" />
                    </button>
                  </div>
                  {/* Legenda (opcional para todos os tipos) */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="input-field"
                      placeholder={arquivoPreview.tipo === 'audio' ? 'Legenda opcional...' : 'Adicionar legenda...'}
                      value={legendaArquivo}
                      onChange={e => setLegendaArquivo(e.target.value)}
                      style={{ flex: 1, fontSize: 12, height: 36 }}
                      onKeyDown={e => { if (e.key === 'Enter') handleConfirmarArquivo() }}
                    />
                    <button
                      className="btn-primary"
                      onClick={handleConfirmarArquivo}
                      disabled={uploadando}
                      style={{ padding: '8px 16px', height: 36, fontSize: 12, flexShrink: 0 }}
                    >
                      {uploadando ? '...' : <><Send size={13} /> Enviar</>}
                    </button>
                  </div>
                </div>
              )}

              {/* Erro de upload */}
              {uploadErro && (
                <div style={{ marginBottom: 8, padding: '8px 12px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <AlertTriangle size={13} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: '#DC2626', flex: 1 }}>{uploadErro}</span>
                  <button onClick={() => setUploadErro(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <X size={13} color="#DC2626" />
                  </button>
                </div>
              )}

              {/* Campo de texto + envio */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                {/* Botões de anexo e gravação — só para mensagens normais */}
                {tipoInput !== 'nota_interna' && podeEnviarMsg && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.mp3,.ogg,.aac"
                      style={{ display: 'none' }}
                      onChange={handleUploadArquivo}
                    />
                    <button
                      className="btn-ghost"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadando || gravando}
                      style={{ padding: '10px', flexShrink: 0, height: 44, borderRadius: 10 }}
                      title="Enviar arquivo"
                    >
                      <Paperclip size={16} color={uploadando ? 'var(--text-muted)' : 'var(--text-secondary)'} />
                    </button>
                    <button
                      onClick={handleToggleGravacao}
                      disabled={uploadando}
                      style={{
                        padding: '10px', flexShrink: 0, height: 44, borderRadius: 10, cursor: 'pointer',
                        background: gravando ? 'rgba(220,38,38,0.12)' : 'transparent',
                        border: gravando ? '1px solid rgba(220,38,38,0.3)' : '1px solid transparent',
                        display: 'flex', alignItems: 'center', gap: 6,
                        color: gravando ? '#DC2626' : 'var(--text-secondary)',
                      }}
                      title={gravando ? 'Parar gravação' : 'Gravar áudio'}
                    >
                      {gravando ? <Square size={14} color="#DC2626" fill="#DC2626" /> : <Mic size={16} />}
                      {gravando && (
                        <span style={{ fontSize: 11, fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, minWidth: 28 }}>
                          {String(Math.floor(tempoGravacao / 60)).padStart(2, '0')}:{String(tempoGravacao % 60).padStart(2, '0')}
                        </span>
                      )}
                    </button>
                  </>
                )}
                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea
                    className="input-field"
                    placeholder={
                      tipoInput === 'nota_interna'
                        ? 'Nota interna (visível apenas para a equipe)...'
                        : !podeEnviarMsg
                        ? conversaAtiva.status === 'fechada' ? 'Conversa encerrada — use Nota Interna para registrar' : 'Assuma a conversa para poder responder'
                        : 'Digite sua mensagem...'
                    }
                    disabled={(tipoInput === 'nota_interna' ? !podeEnviarNota : !podeEnviarMsg) || gravando || uploadando}
                    value={gravando ? '● Gravando áudio...' : mensagem}
                    onChange={e => { if (!gravando) setMensagem(e.target.value) }}
                    style={{ resize: 'none', height: 44, paddingRight: 12, lineHeight: 1.5, paddingTop: 10, color: gravando ? '#DC2626' : undefined }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEnviar() }
                    }}
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={handleEnviar}
                  disabled={!mensagem.trim() || enviando || gravando || uploadando || (tipoInput === 'nota_interna' ? !podeEnviarNota : !podeEnviarMsg)}
                  style={{ padding: '10px 14px', flexShrink: 0, height: 44, borderRadius: 10 }}
                >
                  <Send size={16} />
                </button>
              </div>
              {(podeEnviarMsg || (tipoInput === 'nota_interna' && podeEnviarNota)) && (
                <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  Enter para enviar · Shift+Enter para nova linha
                </div>
              )}
            </div>
          </div>

          {/* Info panel lateral */}
          {showInfo && <InfoPanel conversa={conversaAtiva} userId={userId} onClose={() => setShowInfo(false)} />}
        </div>
      </div>

      {/* ============================================================
          MODAL — Transferir Conversa
          ============================================================ */}
      {showTransferir && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setShowTransferir(false)}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: 16, padding: '24px', minWidth: 320, maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 800, fontSize: 15 }}>Transferir Conversa</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                  {atendentesOnline.length > 0
                    ? `${atendentesOnline.length} atendente${atendentesOnline.length > 1 ? 's' : ''} online`
                    : 'Nenhum atendente online — voltará para a fila'}
                </div>
              </div>
              <button onClick={() => setShowTransferir(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {atendentesOnline.length === 0 ? (
                <button className="btn-primary" style={{ justifyContent: 'center' }}
                  onClick={() => handleTransferirConversa(null)}
                >
                  Enviar para a fila (Bot assume)
                </button>
              ) : (
                <>
                  {atendentesOnline.map(a => (
                    <button key={a.id}
                      onClick={() => handleTransferirConversa(a.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 9,
                        background: 'rgba(11,191,170,0.15)', border: '1px solid rgba(11,191,170,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 12, color: '#0BBFAA',
                      }}>
                        {a.nome.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 700, fontSize: 13 }}>{a.nome}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0BBFAA' }} />
                          <span style={{ fontSize: 11, color: '#0BBFAA', fontWeight: 600 }}>Online</span>
                        </div>
                      </div>
                      <ArrowLeftRight size={14} color="var(--text-muted)" />
                    </button>
                  ))}
                  <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--text-muted)', justifyContent: 'center', marginTop: 4 }}
                    onClick={() => handleTransferirConversa(null)}
                  >
                    Ou enviar para a fila
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
