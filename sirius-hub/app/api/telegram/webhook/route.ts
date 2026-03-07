export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

async function sendTelegram(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
}

// ─── PARSERS ────────────────────────────────────────────────

function parseDate(text: string): { date: string; time: string } {
  const lower = text.toLowerCase()
  const now = new Date()
  let d = new Date()

  if (lower.includes('amanhã') || lower.includes('amanha')) {
    d.setDate(d.getDate() + 1)
  } else if (lower.includes('depois de amanhã') || lower.includes('depois de amanha')) {
    d.setDate(d.getDate() + 2)
  } else {
    const dias = ['domingo', 'segunda', 'terça', 'terca', 'quarta', 'quinta', 'sexta', 'sábado', 'sabado']
    const nums = [0, 1, 2, 2, 3, 4, 5, 6, 6]
    for (let i = 0; i < dias.length; i++) {
      if (lower.includes(dias[i])) {
        const diff = ((nums[i] - d.getDay()) + 7) % 7 || 7
        d.setDate(d.getDate() + diff)
        break
      }
    }
  }

  const timeMatch = lower.match(/(\d{1,2})h(\d{2})?/) || lower.match(/(\d{1,2}):(\d{2})/)
  let time = ''
  if (timeMatch) {
    time = `${timeMatch[1].padStart(2, '0')}:${(timeMatch[2] || '00').padStart(2, '0')}`
  }

  return { date: d.toISOString().split('T')[0], time }
}

function parseReminder(text: string): number {
  const lower = text.toLowerCase()
  const horaMatch = lower.match(/(\d+)\s*h(?:ora)?/)
  if (horaMatch && lower.includes('antes')) return parseInt(horaMatch[1]) * 60
  const minMatch = lower.match(/(\d+)\s*min/)
  if (minMatch && lower.includes('antes')) return parseInt(minMatch[1])
  const diaMatch = lower.match(/(\d+)\s*dia/)
  if (diaMatch && lower.includes('antes')) return parseInt(diaMatch[1]) * 24 * 60
  return 60 // padrão: 1 hora
}

function parseIntent(text: string) {
  const lower = text.toLowerCase()

  // AJUDA
  if (lower === '/start' || lower === 'ajuda' || lower === '/ajuda' || lower === 'help' || lower === 'o que você faz' || lower === 'o que voce faz') {
    return { intent: 'ajuda', data: {} }
  }

  // STATUS geral
  if (lower.includes('status') || lower === 'resumo' || lower === 'dashboard') {
    return { intent: 'status', data: {} }
  }

  // LISTAR reuniões
  if ((lower.includes('reunião') || lower.includes('reuniao') || lower.includes('reuniões') || lower.includes('reunioes')) && (lower.includes('hoje') || lower.includes('amanhã') || lower.includes('amanha') || lower.includes('semana') || lower.includes('próxima') || lower.includes('proxima') || lower.startsWith('listar') || lower.startsWith('ver'))) {
    return { intent: 'listar_reunioes', data: { filtro: lower } }
  }

  // CRIAR reunião
  if (lower.includes('reunião') || lower.includes('reuniao') || lower.includes('meeting') || lower.includes('call') || lower.includes('alinhamento')) {
    const reminder = parseReminder(lower)
    const { date, time } = parseDate(lower)
    return { intent: 'reuniao', data: { titulo: text, date, time, reminder } }
  }

  // PROJETO — atualizar progresso
  if ((lower.includes('projeto') || lower.includes('project')) && lower.match(/\d+%/)) {
    const percent = lower.match(/(\d+)%/)
    const nameMatch = text.match(/projeto\s+["']?([^"'\d%]+?)["']?\s+(?:está|esta|em|a)\s*\d+%/i)
    return { intent: 'update_projeto', data: { texto: text, percent: percent ? parseInt(percent[1]) : 50, nome: nameMatch?.[1]?.trim() || '' } }
  }

  // PROJETO — criar novo
  if ((lower.includes('novo projeto') || lower.includes('criar projeto') || lower.includes('adicionar projeto'))) {
    return { intent: 'criar_projeto', data: { titulo: text } }
  }

  // ESTUDO — novo
  if (lower.includes('comecei a estudar') || lower.includes('novo curso') || lower.includes('novo estudo') || lower.includes('estou estudando')) {
    return { intent: 'criar_estudo', data: { titulo: text } }
  }

  // ESTUDO — atualizar progresso
  if ((lower.includes('curso') || lower.includes('estudo')) && lower.match(/\d+%/)) {
    const percent = lower.match(/(\d+)%/)
    return { intent: 'update_estudo', data: { texto: text, percent: percent ? parseInt(percent[1]) : 50 } }
  }

  // IDEIA — urgente / alta prioridade
  if ((lower.includes('ideia') || lower.includes('e se') || lower.includes('tive uma') || lower.includes('pensei em') || lower.includes('e se')) ) {
    const prioridade = lower.includes('urgente') || lower.includes('importante') ? 'Alta' : lower.includes('baixa') ? 'Baixa' : 'Média'
    return { intent: 'ideia', data: { titulo: text, prioridade } }
  }

  // INSIGHT / APRENDI
  if (lower.includes('aprendi') || lower.includes('insight') || lower.includes('descobri') || lower.includes('percebi')) {
    return { intent: 'insight', data: { titulo: text } }
  }

  // FRASE MARCANTE
  if (lower.includes('frase') || lower.includes('citação') || lower.includes('citacao') || lower.startsWith('"') || lower.startsWith('"')) {
    return { intent: 'frase', data: { titulo: text } }
  }

  // NOTA genérica
  if (lower.includes('lembrar') || lower.includes('lembre') || lower.includes('anotar') || lower.includes('nota') || lower.includes('tarefa') || lower.includes('task') || lower.includes('fazer')) {
    return { intent: 'nota', data: { titulo: text, categoria: 'Tarefas' } }
  }

  // Default: nota no Second Brain
  return { intent: 'nota', data: { titulo: text, categoria: 'Geral' } }
}

// ─── GOOGLE CALENDAR ────────────────────────────────────────

async function getGoogleAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const json = await res.json()
  return json.access_token || null
}

async function createGoogleCalendarEvent(accessToken: string, title: string, date: string, time: string, reminderMinutes: number): Promise<string | null> {
  const startDateTime = time
    ? `${date}T${time}:00`
    : `${date}T09:00:00`
  const endDateTime = time
    ? `${date}T${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:${time.split(':')[1]}:00`
    : `${date}T10:00:00`

  const timeZone = 'America/Sao_Paulo'

  const body = {
    summary: title,
    start: time
      ? { dateTime: startDateTime, timeZone }
      : { date },
    end: time
      ? { dateTime: endDateTime, timeZone }
      : { date },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: reminderMinutes },
        { method: 'email', minutes: reminderMinutes },
      ],
    },
  }

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = await res.json()
  return json.id || null
}

// ─── HANDLER ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const body = await req.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId: number = message.chat.id
    const text: string = message.text || ''
    const allowedId = process.env.TELEGRAM_ALLOWED_USER_ID

    if (allowedId && String(message.from?.id) !== allowedId) {
      await sendTelegram(chatId, '⛔ Acesso não autorizado.')
      return NextResponse.json({ ok: true })
    }

    const userId = process.env.SUPABASE_DEFAULT_USER_ID || ''
    const { intent, data } = parseIntent(text)

    // ── AJUDA ──
    if (intent === 'ajuda') {
      await sendTelegram(chatId, `*Sirius Hub Bot — O que posso fazer:*

*Reunioes:*
• "Reunião amanhã 15h com equipe" → cria reunião
• "Call sexta 10h me lembre 30 min antes" → cria com lembrete
• "Ver reuniões de amanhã" → lista reuniões

*Projetos:*
• "Novo projeto Landing Page para Sirius" → cria projeto
• "Projeto X está 70% concluído" → atualiza progresso

*Estudos:*
• "Comecei a estudar Next.js na Udemy" → cria estudo
• "Curso de IA está 60%" → atualiza progresso

*Ideias:*
• "Ideia: criar app de X" → salva no Kanban
• "Ideia urgente: X" → salva com alta prioridade

*Aprendizado:*
• "Aprendi que X" → salva no Second Brain
• "Insight: X" → salva com categoria Insight
• "Frase marcante: X" → salva frase

*Outros:*
• "status" → resumo geral do Hub
• "lembrar de fazer X" → cria nota/tarefa`)
      return NextResponse.json({ ok: true })
    }

    // ── STATUS ──
    if (intent === 'status') {
      const [{ count: projetos }, { count: ideias }, { count: estudos }, { count: reunioes }] = await Promise.all([
        supabase.from('projetos').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('ideias').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('estudos').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('reunioes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      ])
      await sendTelegram(chatId, `*Sirius Hub — Resumo*\n\n• Projetos: ${projetos || 0}\n• Estudos: ${estudos || 0}\n• Reuniões: ${reunioes || 0}\n• Ideias: ${ideias || 0}`)
      return NextResponse.json({ ok: true })
    }

    // ── LISTAR REUNIÕES ──
    if (intent === 'listar_reunioes') {
      const hoje = new Date().toISOString().split('T')[0]
      const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0]
      const filtro = data.filtro || ''
      const dataFiltro = filtro.includes('amanhã') || filtro.includes('amanha') ? amanha : hoje

      const { data: reunioes } = await supabase
        .from('reunioes')
        .select('titulo, data, horario, empresa')
        .eq('user_id', userId)
        .eq('data', dataFiltro)
        .order('horario')

      if (!reunioes || reunioes.length === 0) {
        await sendTelegram(chatId, `Nenhuma reunião para ${filtro.includes('amanhã') || filtro.includes('amanha') ? 'amanhã' : 'hoje'}.`)
      } else {
        const lista = reunioes.map(r => `• ${r.horario || '?'} — ${r.titulo}${r.empresa ? ` (${r.empresa})` : ''}`).join('\n')
        await sendTelegram(chatId, `*Reuniões:*\n\n${lista}`)
      }
      return NextResponse.json({ ok: true })
    }

    // ── REUNIÃO ──
    if (intent === 'reuniao') {
      const titulo = text.slice(0, 100)
      const { data: dataStr, time, reminder } = data as { date: string; time: string; reminder: number; titulo: string }

      // Salvar no Supabase
      const { data: reuniao } = await supabase.from('reunioes').insert({
        titulo,
        empresa: 'Via Telegram',
        data: dataStr,
        horario: time || '',
        participantes: [],
        pauta: text,
        notas: '',
        user_id: userId,
      }).select().single()

      // Tentar criar no Google Calendar
      let googleMsg = ''
      const { data: integration } = await supabase
        .from('user_integrations')
        .select('google_refresh_token, google_connected')
        .eq('user_id', userId)
        .single()

      if (integration?.google_connected && integration?.google_refresh_token) {
        const accessToken = await getGoogleAccessToken(integration.google_refresh_token)
        if (accessToken) {
          const eventId = await createGoogleCalendarEvent(accessToken, titulo, dataStr, time, reminder)
          if (eventId && reuniao?.id) {
            await supabase.from('reunioes').update({ google_event_id: eventId }).eq('id', reuniao.id)
          }
          const reminderLabel = reminder >= 60
            ? `${reminder / 60}h antes`
            : `${reminder} min antes`
          googleMsg = `\nCalendário Google: adicionado ✓\nLembrete: ${reminderLabel}`
        }
      } else {
        googleMsg = `\n_Google Calendar não conectado ainda. Vá em Integrações para conectar._`
      }

      const dataFormatada = dataStr ? new Date(dataStr + 'T12:00:00').toLocaleDateString('pt-BR') : ''
      await sendTelegram(chatId, `*Reunião criada!*\n\n"${titulo.slice(0, 60)}"\nData: ${dataFormatada}${time ? ` às ${time}` : ''}${googleMsg}`)
      return NextResponse.json({ ok: true })
    }

    // ── CRIAR PROJETO ──
    if (intent === 'criar_projeto') {
      const nomeParsed = text.replace(/novo projeto|criar projeto|adicionar projeto/gi, '').trim()
      await supabase.from('projetos').insert({
        nome: nomeParsed.slice(0, 100) || text.slice(0, 100),
        empresa: '',
        status: 'Planejamento',
        score: 0,
        user_id: userId,
      })
      await sendTelegram(chatId, `*Projeto criado!*\n\n"${nomeParsed.slice(0, 60)}"\nVeja em Projetos no Hub.`)
      return NextResponse.json({ ok: true })
    }

    // ── ATUALIZAR PROJETO ──
    if (intent === 'update_projeto') {
      const { percent, nome } = data as { percent: number; nome: string; texto: string }
      if (nome) {
        await supabase.from('projetos').update({ score: percent }).eq('user_id', userId).ilike('nome', `%${nome}%`)
      }
      await sendTelegram(chatId, `*Projeto atualizado!*\n\n${nome ? `"${nome}" → ` : ''}${percent}% concluído.`)
      return NextResponse.json({ ok: true })
    }

    // ── CRIAR ESTUDO ──
    if (intent === 'criar_estudo') {
      const titulo = text.replace(/comecei a estudar|novo curso|novo estudo|estou estudando/gi, '').trim()
      const plataformaMatch = text.match(/(?:na|no|em|pela)\s+([A-Za-z]+)/i)
      await supabase.from('estudos').insert({
        titulo: titulo.slice(0, 100) || text.slice(0, 100),
        plataforma: plataformaMatch?.[1] || '',
        status: 'Em andamento',
        progresso: 0,
        categoria: 'IA',
        user_id: userId,
      })
      await sendTelegram(chatId, `*Estudo criado!*\n\n"${titulo.slice(0, 60)}"\nVeja em Estudos no Hub.`)
      return NextResponse.json({ ok: true })
    }

    // ── ATUALIZAR ESTUDO ──
    if (intent === 'update_estudo') {
      const { percent } = data as { percent: number; texto: string }
      await sendTelegram(chatId, `*Progresso salvo!* ${percent}%\n\nAbra Estudos no Hub para confirmar qual curso atualizar.`)
      return NextResponse.json({ ok: true })
    }

    // ── IDEIA ──
    if (intent === 'ideia') {
      const { prioridade } = data as { prioridade: string; titulo: string }
      const titulo = text.replace(/ideia:|ideia urgente:|ideia:/gi, '').trim()
      await supabase.from('ideias').insert({
        titulo: titulo.slice(0, 100),
        descricao: text,
        categoria: 'Produto',
        prioridade,
        status: 'Rascunho',
        user_id: userId,
      })
      await sendTelegram(chatId, `*Ideia capturada!*\n\n"${titulo.slice(0, 60)}"\nPrioridade: ${prioridade}\nJogada no Kanban.`)
      return NextResponse.json({ ok: true })
    }

    // ── INSIGHT ──
    if (intent === 'insight') {
      const titulo = text.replace(/aprendi que|aprendi:|insight:|descobri:|percebi:/gi, '').trim()
      await supabase.from('notas_brain').insert({
        titulo: titulo.slice(0, 100),
        conteudo: text,
        categoria: 'Insights',
        tags: ['telegram', 'insight'],
        user_id: userId,
      })
      await sendTelegram(chatId, `*Insight salvo no Second Brain!*\n\n"${titulo.slice(0, 80)}"`)
      return NextResponse.json({ ok: true })
    }

    // ── FRASE MARCANTE ──
    if (intent === 'frase') {
      await supabase.from('notas_brain').insert({
        titulo: text.slice(0, 100),
        conteudo: text,
        categoria: 'Frases',
        tags: ['telegram', 'frase'],
        user_id: userId,
      })
      await sendTelegram(chatId, `*Frase salva!*\n\n"${text.slice(0, 80)}"`)
      return NextResponse.json({ ok: true })
    }

    // ── NOTA / TAREFA ──
    await supabase.from('notas_brain').insert({
      titulo: text.slice(0, 100),
      conteudo: text,
      categoria: (data as { categoria?: string }).categoria || 'Geral',
      tags: ['telegram'],
      user_id: userId,
    })
    await sendTelegram(chatId, `*Anotado no Second Brain!*\n\n"${text.slice(0, 80)}"`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
