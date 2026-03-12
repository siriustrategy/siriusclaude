import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { zapiEnviarTexto } from '@/lib/zapi'
import { randomUUID } from 'crypto'

// Desconto padrão por fase
function getDescontoPorFase(fase: string): number {
  const map: Record<string, number> = {
    pre: 0, mes1: 0, mes2: 0,
    mes3: 5, mes4: 15, mes5: 20,
    pos: 0,
  }
  return map[fase] ?? 0
}

/**
 * POST /api/checkout/gerar
 *
 * Gera um token de checkout para um lead e (opcionalmente) envia via WhatsApp.
 *
 * Body: {
 *   lead_id: string
 *   desconto_override?: number   — sobrescreve o desconto da fase (aprovação de desconto especial)
 *   enviar_whatsapp?: boolean    — padrão: true
 * }
 *
 * Retorna: { token, checkout_url, desconto, valor_final }
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { lead_id, desconto_override, enviar_whatsapp = true } = body

  if (!lead_id) {
    return NextResponse.json({ error: 'lead_id é obrigatório' }, { status: 400 })
  }

  const supabase = await createClient()

  // Busca lead
  const { data: lead, error: leadErr } = await supabase
    .from('leads')
    .select('id, nome, telefone, plano, fase_cobranca, valor_em_aberto, status')
    .eq('id', lead_id)
    .single()

  if (leadErr || !lead) {
    return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
  }

  const desconto = desconto_override !== undefined
    ? Number(desconto_override)
    : getDescontoPorFase(lead.fase_cobranca)

  const valor = Number(lead.valor_em_aberto)
  const valor_final = +(valor - (valor * desconto / 100)).toFixed(2)

  // Gera token único
  const tokenValue = randomUUID().replace(/-/g, '')

  // Expira em 7 dias
  const expira_em = new Date(Date.now() + 7 * 86400000).toISOString()

  // Cria token no banco
  const { data: ct, error: ctErr } = await supabase
    .from('checkout_tokens')
    .insert({
      lead_id: lead.id,
      token: tokenValue,
      valor,
      desconto,
      expira_em,
      usado: false,
    })
    .select('id, token')
    .single()

  if (ctErr || !ct) {
    console.error('[checkout/gerar] Erro ao criar token:', ctErr)
    return NextResponse.json({ error: 'Erro ao gerar link de checkout' }, { status: 500 })
  }

  // Monta URL de checkout
  const origin = req.nextUrl.origin
  const checkout_url = `${origin}/checkout/${ct.token}`

  // Envia via WhatsApp se solicitado e lead tem telefone
  let whatsapp_enviado = false
  if (enviar_whatsapp && lead.telefone) {
    const valorFormatado = `R$ ${valor_final.toFixed(2).replace('.', ',')}`
    const descontoTexto = desconto > 0 ? `*${desconto}% de desconto aplicado!*\n` : ''

    whatsapp_enviado = await zapiEnviarTexto(lead.telefone, [
      `Ola, ${lead.nome.split(' ')[0]}! Preparamos um link especial para regularizar seu ${lead.plano}:`,
      ``,
      descontoTexto + `Valor: *${valorFormatado}*`,
      ``,
      `Acesse agora para pagar via PIX, Boleto ou Cartao:`,
      checkout_url,
      ``,
      `Este link expira em 7 dias. Qualquer duvida, responda esta mensagem.`,
    ].join('\n'))
  }

  return NextResponse.json({
    ok: true,
    token: ct.token,
    checkout_url,
    desconto,
    valor,
    valor_final,
    whatsapp_enviado,
  })
}
