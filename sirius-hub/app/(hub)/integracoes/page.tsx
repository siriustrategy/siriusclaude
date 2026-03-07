'use client'

import { useState } from 'react'
import {
  Calendar, MessageCircle, LayoutList, Mic,
  CheckCircle2, ExternalLink, ChevronDown, Zap, ArrowRight,
} from 'lucide-react'

type Status = 'conectado' | 'pendente'

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
  link: string
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'google-calendar',
    nome: 'Google Calendar',
    desc: 'Reuniões do Google aparecem automaticamente no Hub.',
    status: 'pendente',
    icon: Calendar,
    cor: '#4285F4',
    recursos: ['Importar eventos automaticamente', 'Notificações antes das reuniões', 'Suporte a múltiplos calendários'],
    instrucoes: ['Crie um projeto no Google Cloud Console', 'Ative a API Google Calendar', 'Crie credenciais OAuth 2.0', 'Cole Client ID e Client Secret no .env.local'],
    envVar: 'GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET',
    link: 'https://console.cloud.google.com',
  },
  {
    id: 'telegram',
    nome: 'Telegram Bot',
    desc: 'Fale em português natural e o bot organiza tudo no Hub.',
    status: 'pendente',
    icon: MessageCircle,
    cor: '#229ED9',
    recursos: ['"Tive ideia de X" → cria card no Kanban', '"Reunião amanhã 15h" → cadastra reunião', '"Status do projeto Y" → responde com progresso', 'Envia áudio/PDF → extrai action items com IA'],
    instrucoes: ['Abra o Telegram e fale com @BotFather', 'Digite /newbot e siga as instruções', 'Copie o token para TELEGRAM_BOT_TOKEN', 'Configure o webhook: /api/telegram/webhook'],
    envVar: 'TELEGRAM_BOT_TOKEN',
    link: 'https://t.me/BotFather',
  },
  {
    id: 'clickup',
    nome: 'ClickUp',
    desc: 'Projetos e tarefas da empresa direto no Hub.',
    status: 'pendente',
    icon: LayoutList,
    cor: '#7B68EE',
    recursos: ['Importar workspaces e listas da empresa', 'Ver tasks com status atualizado', 'Criar tasks no Hub que vão pro ClickUp'],
    instrucoes: ['Acesse clickup.com → Configurações → Apps', 'Gere uma API Key pessoal', 'Cole em CLICKUP_API_KEY no .env.local', 'Adicione CLICKUP_WORKSPACE_ID'],
    envVar: 'CLICKUP_API_KEY + CLICKUP_WORKSPACE_ID',
    link: 'https://app.clickup.com/settings/apps',
  },
  {
    id: 'plaud',
    nome: 'Plaud / Áudio',
    desc: 'Transcrições e resumos do Plaud viram reuniões com action items.',
    status: 'pendente',
    icon: Mic,
    cor: '#F59E0B',
    recursos: ['Suporte a PDF, TXT e áudio', 'Transcrição via Whisper (OpenAI)', 'Extração automática de action items', 'Via Telegram ou upload direto no Hub'],
    instrucoes: ['Configure OPENAI_API_KEY para áudio', 'PDF/TXT já funcionam sem chave extra', 'Pelo Telegram: envie o arquivo no chat', 'Pelo Hub: Reuniões > Importar do Plaud'],
    envVar: 'OPENAI_API_KEY (para áudio)',
    link: '#',
  },
]

export default function IntegracoesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const conectadas = INTEGRATIONS.filter(i => i.status === 'conectado').length

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span className="section-label" style={{ marginBottom: 12, display: 'inline-flex' }}>INTEGRAÇÕES</span>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
          Conecte o Hub ao seu mundo
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          {conectadas}/{INTEGRATIONS.length} conectadas — Configure para ativar o Sirius Hub completo.
        </p>
      </div>

      {/* Banner como funciona */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,91,219,0.15) 0%, rgba(124,58,237,0.08) 100%)',
        border: '1px solid rgba(59,91,219,0.3)',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}>
        <div style={{
          width: 44, height: 44, flexShrink: 0,
          background: 'rgba(59,91,219,0.2)',
          border: '1px solid rgba(59,91,219,0.35)',
          borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={20} color="#93c5fd" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 6 }}>
            COMO TUDO SE CONECTA
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {['Telegram', '→', 'IA interpreta', '→', 'Supabase', '→', 'Sirius Hub'].map((item, i) => (
              item === '→'
                ? <ArrowRight key={i} size={13} color="var(--text-muted)" />
                : <span key={i} style={{
                    background: 'rgba(59,91,219,0.15)',
                    border: '1px solid rgba(59,91,219,0.25)',
                    color: '#93c5fd',
                    borderRadius: 6,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                  }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Cards de integração */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {INTEGRATIONS.map(integ => {
          const Icon = integ.icon
          const isOpen = expanded === integ.id
          const connected = integ.status === 'conectado'

          return (
            <div key={integ.id} className="glass-card" style={{ overflow: 'hidden' }}>
              {/* Header do card */}
              <button
                onClick={() => setExpanded(isOpen ? null : integ.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: 16, padding: '18px 22px',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 44, height: 44, flexShrink: 0, borderRadius: 11,
                  background: `${integ.cor}18`, border: `1px solid ${integ.cor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={integ.cor} />
                </div>

                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
                      {integ.nome}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
                      padding: '2px 9px', borderRadius: 20,
                      background: connected ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.1)',
                      color: connected ? '#34d399' : '#fbbf24',
                      border: `1px solid ${connected ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                    }}>
                      {connected ? 'Conectado' : 'Configurar'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{integ.desc}</div>
                </div>

                <ChevronDown size={16} color="var(--text-muted)" style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
              </button>

              {/* Expandido */}
              {isOpen && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '22px 22px 22px 82px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10 }}>
                        O que você pode fazer
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {integ.recursos.map((r, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <CheckCircle2 size={13} color="var(--success)" style={{ marginTop: 2, flexShrink: 0 }} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 10 }}>
                        Como configurar
                      </div>
                      <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {integ.instrucoes.map((inst, i) => (
                          <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{i + 1}.</span>
                            {inst}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 18 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Adicione ao{' '}
                        <code style={{ background: 'rgba(59,91,219,0.12)', color: '#93c5fd', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>.env.local</code>
                        {' '}→{' '}
                        <code style={{ color: '#f59e0b', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{integ.envVar}</code>
                      </span>
                    </div>
                    {integ.link !== '#' && (
                      <a href={integ.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', fontSize: 13, padding: '8px 18px' }}>
                        <ExternalLink size={13} />
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

      {/* Endpoints */}
      <div className="glass-card" style={{ padding: '20px 24px', marginTop: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 14 }}>
          Endpoints disponíveis
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { path: 'POST /api/telegram/webhook', desc: 'Recebe mensagens do bot Telegram' },
            { path: 'POST /api/google-calendar/sync', desc: 'Sincronização de eventos' },
            { path: 'POST /api/clickup/sync', desc: 'Importa projetos e tasks do ClickUp' },
            { path: 'POST /api/brain/chat', desc: 'Chat com a IA do Second Brain' },
          ].map(ep => (
            <div key={ep.path} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#93c5fd', background: 'rgba(59,91,219,0.1)', padding: '3px 10px', borderRadius: 6 }}>
                {ep.path}
              </code>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
