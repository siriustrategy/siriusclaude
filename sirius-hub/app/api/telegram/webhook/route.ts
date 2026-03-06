import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

async function sendTelegram(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
}

function parseIntent(text: string): { intent: string; data: Record<string, string> } {
  const lower = text.toLowerCase()

  // Reunião
  if (lower.includes('reunião') || lower.includes('reuniao') || lower.includes('meeting')) {
    return { intent: 'reuniao', data: { titulo: text } }
  }
  // Ideia
  if (lower.includes('ideia') || lower.includes('tive uma') || lower.includes('pensei em') || lower.includes('e se')) {
    return { intent: 'ideia', data: { titulo: text } }
  }
  // Tarefa / task
  if (lower.includes('tarefa') || lower.includes('task') || lower.includes('fazer') || lower.includes('lembrar')) {
    return { intent: 'nota', data: { titulo: 'Task: ' + text, categoria: 'Aprendizado' } }
  }
  // Status
  if (lower.includes('status') || lower.includes('como está') || lower.includes('progresso')) {
    return { intent: 'status', data: {} }
  }
  // Nota genérica
  return { intent: 'nota', data: { titulo: text, categoria: 'Geral' } }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId: number = message.chat.id
    const text: string = message.text || ''
    const userId = process.env.TELEGRAM_ALLOWED_USER_ID

    // Verificar usuário autorizado (segurança)
    if (userId && String(message.from?.id) !== userId) {
      await sendTelegram(chatId, '⛔ Acesso não autorizado.')
      return NextResponse.json({ ok: true })
    }

    const { intent, data } = parseIntent(text)

    if (intent === 'status') {
      // Buscar resumo rápido
      const [{ count: projetos }, { count: ideias }] = await Promise.all([
        supabase.from('projetos').select('*', { count: 'exact', head: true }),
        supabase.from('ideias').select('*', { count: 'exact', head: true }),
      ])
      await sendTelegram(chatId, `📊 *Sirius Hub — Status*\n\n• Projetos: ${projetos || 0}\n• Ideias: ${ideias || 0}\n\nAcesse o Hub para mais detalhes.`)
      return NextResponse.json({ ok: true })
    }

    if (intent === 'reuniao') {
      // Criar reunião básica
      const hoje = new Date().toISOString().split('T')[0]
      await supabase.from('reunioes').insert({
        titulo: data.titulo.slice(0, 100),
        empresa: 'Via Telegram',
        data: hoje,
        horario: '',
        participantes: [],
        pauta: text,
        notas: '',
        user_id: process.env.SUPABASE_DEFAULT_USER_ID || '',
      })
      await sendTelegram(chatId, `✅ *Reunião registrada!*\n\n"${data.titulo.slice(0, 60)}..."\n\nAcesse o módulo Reuniões para completar os detalhes.`)
    } else if (intent === 'ideia') {
      // Criar ideia
      await supabase.from('ideias').insert({
        titulo: data.titulo.slice(0, 100),
        descricao: text,
        categoria: 'Produto',
        prioridade: 'Média',
        status: 'Rascunho',
        user_id: process.env.SUPABASE_DEFAULT_USER_ID || '',
      })
      await sendTelegram(chatId, `💡 *Ideia capturada!*\n\n"${data.titulo.slice(0, 60)}"\n\nJogada no Kanban de Ideias como Rascunho.`)
    } else {
      // Nota genérica no Second Brain
      await supabase.from('notas_brain').insert({
        titulo: (data.titulo || text).slice(0, 100),
        conteudo: text,
        categoria: data.categoria || 'Geral',
        tags: ['telegram'],
        user_id: process.env.SUPABASE_DEFAULT_USER_ID || '',
      })
      await sendTelegram(chatId, `📝 *Nota salva no Second Brain!*\n\n"${text.slice(0, 80)}"\n\nCategorizada como: ${data.categoria || 'Geral'}`)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
