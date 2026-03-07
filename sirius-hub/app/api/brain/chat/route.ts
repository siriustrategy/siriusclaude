export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json()
    if (!userId || !message) return NextResponse.json({ error: 'userId e message obrigatórios' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply: 'Configure ANTHROPIC_API_KEY ou OPENAI_API_KEY em Integrações para ativar o Chat IA do Second Brain.'
      })
    }

    // Buscar contexto do Second Brain do usuário
    const [{ data: livros }, { data: notas }] = await Promise.all([
      supabase.from('livros').select('titulo, autor, insights, frases_marcantes').eq('user_id', userId).eq('status', 'Lido'),
      supabase.from('notas_brain').select('titulo, conteudo, categoria, tags').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    ])

    const context = `
Você é o Second Brain de Breno Nobre. Você tem acesso ao que ele leu, anotou e refletiu.

BIBLIOTECA (livros lidos):
${(livros || []).map(l => `- "${l.titulo}" por ${l.autor}: ${l.insights || ''}`).join('\n')}

NOTAS RECENTES:
${(notas || []).map(n => `[${n.categoria}] ${n.titulo}: ${n.conteudo?.slice(0, 200)}`).join('\n')}

Responda em português, de forma profunda e personalizada para Breno. Conecte conceitos dos livros com a pergunta dele. Seja direto e perspicaz.
    `.trim()

    // Chamada para Claude (Anthropic)
    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          system: context,
          messages: [{ role: 'user', content: message }],
        }),
      })
      const data = await res.json()
      return NextResponse.json({ reply: data.content?.[0]?.text || 'Sem resposta da IA.' })
    }

    // Fallback: OpenAI
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: message },
        ],
      }),
    })
    const data = await res.json()
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || 'Sem resposta da IA.' })

  } catch (error) {
    console.error('Brain chat error:', error)
    return NextResponse.json({ error: 'Erro no chat da IA' }, { status: 500 })
  }
}
