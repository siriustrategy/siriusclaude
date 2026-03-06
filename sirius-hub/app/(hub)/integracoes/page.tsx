'use client'

import { useState } from 'react'
import {
  Plug2, Calendar, MessageCircle, LayoutList, Mic,
  CheckCircle2, Circle, ExternalLink, ChevronRight, Zap,
  Bot, FileText, Bell, RefreshCw,
} from 'lucide-react'

type Status = 'conectado' | 'pendente' | 'desconectado'

interface Integration {
  id: string
  nome: string
  desc: string
  status: Status
  icon: typeof Calendar
  cor: string
  recursos: string[]
  instrucoes: string[]
  envVar: string
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'google-calendar',
    nome: 'Google Calendar',
    desc: 'Sincronize suas reuniões automaticamente. Eventos do Google aparecem no módulo Reuniões em tempo real.',
    status: 'pendente',
    icon: Calendar,
    cor: '#4285F4',
    recursos: [
      'Importar eventos automaticamente',
      'Criar reuniões no Hub sincroniza com Google',
      'Notificações antes das reuniões',
      'Suporte a múltiplos calendários',
    ],
    instrucoes: [
      'Crie um projeto no Google Cloud Console',
      'Ative a API Google Calendar',
      'Crie credenciais OAuth 2.0',
      'Copie Client ID e Client Secret para o .env.local',
    ],
    envVar: 'GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET',
  },
  {
    id: 'telegram',
    nome: 'Telegram Bot',
    desc: 'Controle o Sirius Hub pelo Telegram. Fale em português natural e o bot organiza tudo automaticamente.',
    status: 'pendente',
    icon: MessageCircle,
    cor: '#229ED9',
    recursos: [
      '"Tive ideia de X" → cria card no Kanban',
      '"Reunião com Fulano amanhã 15h" → cadastra reunião',
      '"Status do projeto Y" → responde com % progresso',
      'Jogar áudio/PDF → extrai action items com IA',
      'Daily briefing automático toda manhã',
    ],
    instrucoes: [
      'Abra o Telegram e fale com @BotFather',
      'Digite /newbot e siga as instruções',
      'Copie o token gerado para TELEGRAM_BOT_TOKEN',
      'Configure o webhook: /api/telegram/webhook',
    ],
    envVar: 'TELEGRAM_BOT_TOKEN',
  },
  {
    id: 'clickup',
    nome: 'ClickUp',
    desc: 'Sincronize projetos e tarefas da empresa diretamente no Hub. Veja o backlog e atualize status sem sair do Sirius.',
    status: 'pendente',
    icon: LayoutList,
    cor: '#7B68EE',
    recursos: [
      'Importar workspaces e listas da empresa',
      'Ver tasks por projeto com status atualizado',
      'Criar tasks no Hub que aparecem no ClickUp',
      'Sincronização bidirecional (em breve)',
    ],
    instrucoes: [
      'Acesse clickup.com → Configurações → Apps',
      'Gere uma API Key pessoal',
      'Copie para CLICKUP_API_KEY no .env.local',
      'Configure CLICKUP_WORKSPACE_ID com o ID do seu workspace',
    ],
    envVar: 'CLICKUP_API_KEY + CLICKUP_WORKSPACE_ID',
  },
  {
    id: 'plaud',
    nome: 'Plaud / Áudio',
    desc: 'Jogue transcrições, áudios e resumos do Plaud. A IA extrai action items e cria reuniões automaticamente.',
    status: 'pendente',
    icon: Mic,
    cor: '#F59E0B',
    recursos: [
      'Suporte a PDF, TXT e arquivos de áudio',
      'Transcrição automática via Whisper API (OpenAI)',
      'Extração de action items com IA',
      'Criação automática de reunião com notas preenchidas',
      'Via Telegram (arraste o arquivo) ou upload direto',
    ],
    instrucoes: [
      'Configure OPENAI_API_KEY para transcrição de áudio',
      'Arquivos PDF/TXT já funcionam sem chave extra',
      'Pelo Telegram: envie o arquivo direto no chat com o bot',
      'Pelo Hub: use o módulo Reuniões > "Importar do Plaud"',
    ],
    envVar: 'OPENAI_API_KEY (para áudio)',
  },
]

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  conectado: { label: 'Conectado', color: 'var(--success)', icon: CheckCircle2 },
  pendente: { label: 'Configurar', color: 'var(--warning)', icon: Circle },
  desconectado: { label: 'Desconectado', color: 'var(--danger)', icon: Circle },
}

export default function IntegracoesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  const conectadas = INTEGRATIONS.filter(i => i.status === 'conectado').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Plug2 size={24} color="var(--accent)" />
          Integrações
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {conectadas}/{INTEGRATIONS.length} conectadas — Configure para ativar o Sirius Hub completo
        </p>
      </div>

      {/* Visão geral do fluxo */}
      <div className="p-5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Zap size={14} color="var(--accent)" />
          Como tudo se conecta
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label: 'Telegram', icon: MessageCircle, color: '#229ED9' },
            { label: '→', icon: null, color: '' },
            { label: 'IA interpreta', icon: Bot, color: 'var(--accent)' },
            { label: '→', icon: null, color: '' },
            { label: 'Supabase', icon: null, color: '#3ECF8E' },
            { label: '→', icon: null, color: '' },
            { label: 'Sirius Hub', icon: null, color: 'var(--accent)' },
          ].map((item, i) => item.label === '→' ? (
            <ChevronRight key={i} size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
              background: (item.color || 'var(--accent)') + '20',
              color: item.color || 'var(--accent)',
            }}>
              {item.icon && <item.icon size={12} />}
              {item.label}
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          Você fala no Telegram → a IA interpreta a intenção → salva no Supabase → aparece no Hub automaticamente.
        </p>
      </div>

      {/* Cards de Integração */}
      <div className="space-y-3">
        {INTEGRATIONS.map(integ => {
          const Icon = integ.icon
          const statusCfg = STATUS_CONFIG[integ.status]
          const StatusIcon = statusCfg.icon
          const isOpen = expanded === integ.id

          return (
            <div key={integ.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {/* Card Header */}
              <button
                className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-white/5"
                style={{ background: 'var(--surface)' }}
                onClick={() => setExpanded(isOpen ? null : integ.id)}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: integ.cor + '20' }}>
                  <Icon size={24} style={{ color: integ.cor }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-white">{integ.nome}</p>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{
                      background: statusCfg.color + '20',
                      color: statusCfg.color,
                    }}>
                      <StatusIcon size={10} />
                      {statusCfg.label}
                    </div>
                  </div>
                  <p className="text-sm mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{integ.desc}</p>
                </div>

                {/* Chevron */}
                <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  {isOpen ? <ChevronRight size={18} style={{ transform: 'rotate(90deg)' }} /> : <ChevronRight size={18} />}
                </div>
              </button>

              {/* Expanded Content */}
              {isOpen && (
                <div className="p-5 space-y-5" style={{ background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* O que faz */}
                    <div>
                      <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={12} color="var(--success)" />
                        O que você pode fazer
                      </p>
                      <ul className="space-y-1.5">
                        {integ.recursos.map((r, i) => (
                          <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }}>•</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Como configurar */}
                    <div>
                      <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                        <RefreshCw size={12} color="var(--accent)" />
                        Como configurar
                      </p>
                      <ol className="space-y-1.5">
                        {integ.instrucoes.map((inst, i) => (
                          <li key={i} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <span className="font-bold flex-shrink-0" style={{ color: 'var(--accent)' }}>{i + 1}.</span>
                            {inst}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Variável de ambiente */}
                  <div className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                    <p className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
                      <FileText size={12} style={{ color: 'var(--text-muted)' }} />
                      Adicione ao <code className="ml-1 px-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--accent)', fontSize: 11 }}>.env.local</code>
                    </p>
                    <code className="text-xs" style={{ color: '#F59E0B' }}>{integ.envVar}</code>
                  </div>

                  {/* Action */}
                  <div className="flex gap-3">
                    {integ.status === 'conectado' ? (
                      <button className="btn-secondary text-sm flex items-center gap-2">
                        <RefreshCw size={14} />
                        Sincronizar agora
                      </button>
                    ) : (
                      <a
                        href={
                          integ.id === 'google-calendar' ? 'https://console.cloud.google.com' :
                          integ.id === 'telegram' ? 'https://t.me/BotFather' :
                          integ.id === 'clickup' ? 'https://app.clickup.com/settings/apps' :
                          '#'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm flex items-center gap-2"
                        style={{ textDecoration: 'none' }}
                      >
                        <ExternalLink size={14} />
                        Ir configurar
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Webhook Info */}
      <div className="p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
          <Bell size={13} color="var(--accent)" />
          Endpoints disponíveis para configurar
        </p>
        <div className="space-y-1.5">
          {[
            { path: '/api/telegram/webhook', desc: 'Recebe mensagens do bot Telegram' },
            { path: '/api/google-calendar/sync', desc: 'Sincronização manual de eventos' },
            { path: '/api/clickup/sync', desc: 'Importa projetos e tasks do ClickUp' },
            { path: '/api/brain/chat', desc: 'Chat com IA do Second Brain' },
          ].map(ep => (
            <div key={ep.path} className="flex items-center gap-3 text-xs">
              <code className="px-2 py-0.5 rounded font-mono" style={{ background: 'var(--bg-elevated)', color: 'var(--accent)' }}>
                POST {ep.path}
              </code>
              <span style={{ color: 'var(--text-muted)' }}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
