import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/checkout/webhook-cellcoin
 *
 * Webhook recebido da Cell Coin quando PIX ou Boleto é pago.
 * Atualiza o CRM: lead → 'pago', checkout_token → usado, cobranca_pendente → pago.
 *
 * Cell Coin envia no header: x-cellcoin-secret (configurar no painel deles)
 * Configure CELLCOIN_WEBHOOK_SECRET no .env com o mesmo valor.
 *
 * Payload esperado da Cell Coin:
 * {
 *   event: 'payment.paid' | 'payment.confirmed',
 *   transaction_id: string,
 *   external_id: string,   ← é o checkout_token.id que enviamos no /pagar
 *   status: 'paid' | 'confirmed',
 *   amount: number,
 *   payment_method: 'pix' | 'boleto',
 *   paid_at: string        ← ISO 8601
 * }
 */
export async function POST(req: NextRequest) {
  // ── Verificação do segredo ──────────────────────────────────────────────────
  const WEBHOOK_SECRET = process.env.CELLCOIN_WEBHOOK_SECRET
  if (WEBHOOK_SECRET) {
    const headerSecret = req.headers.get('x-cellcoin-secret')
    if (headerSecret !== WEBHOOK_SECRET) {
      console.warn('[webhook-cellcoin] Segredo inválido — requisição rejeitada')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: {
    event?: string
    transaction_id?: string
    external_id?: string
    status?: string
    amount?: number
    payment_method?: string
    paid_at?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { event, transaction_id, external_id, status, amount, payment_method, paid_at } = body

  // Só processa eventos de pagamento confirmado
  const isPaid = event === 'payment.paid' || event === 'payment.confirmed'
  const isStatusPaid = status === 'paid' || status === 'confirmed'

  if (!isPaid && !isStatusPaid) {
    // Outros eventos (ex: payment.created) → apenas confirma recebimento
    return NextResponse.json({ received: true, action: 'ignored', event })
  }

  if (!external_id) {
    console.error('[webhook-cellcoin] external_id ausente no payload:', body)
    return NextResponse.json({ error: 'external_id obrigatório' }, { status: 400 })
  }

  const supabase = await createClient()

  // ── Busca o checkout_token pelo external_id ─────────────────────────────────
  const { data: ct, error: ctErr } = await supabase
    .from('checkout_tokens')
    .select('id, lead_id, usado, valor, desconto, metodo_pagamento, parcelas')
    .eq('id', external_id)
    .single()

  if (ctErr || !ct) {
    console.error('[webhook-cellcoin] Token não encontrado para external_id:', external_id)
    return NextResponse.json({ error: 'Token não encontrado' }, { status: 404 })
  }

  // Idempotência: se já foi marcado como pago, retorna 200 sem reprocessar
  if (ct.usado) {
    return NextResponse.json({ received: true, action: 'already_processed' })
  }

  const valor_original = Number(ct.valor)
  const desconto_percentual = Number(ct.desconto)
  const valor_final = amount ?? +(valor_original - (valor_original * desconto_percentual / 100)).toFixed(2)
  const metodo = payment_method || ct.metodo_pagamento || 'pix'
  const data_pago = paid_at ? new Date(paid_at).toISOString() : new Date().toISOString()

  // ── 1. Marca checkout_token como usado ──────────────────────────────────────
  await supabase
    .from('checkout_tokens')
    .update({
      usado: true,
      metodo_pagamento: metodo,
    })
    .eq('id', ct.id)

  // ── 2. Atualiza lead para 'pago' ────────────────────────────────────────────
  await supabase
    .from('leads')
    .update({ status: 'pago' })
    .eq('id', ct.lead_id)

  // ── 3. Marca cobrança pendente como paga ────────────────────────────────────
  await supabase
    .from('cobrancas_pendentes')
    .update({
      status: 'pago',
      pago_em: data_pago,
    })
    .eq('checkout_token_id', ct.id)
    .eq('status', 'pendente')

  // ── 4. Registra em pagamentos ───────────────────────────────────────────────
  await supabase.from('pagamentos').insert({
    lead_id: ct.lead_id,
    valor: valor_final,
    valor_original,
    desconto_aplicado: desconto_percentual,
    metodo,
    status: 'confirmado',
    referencia: transaction_id || null,
    data_pagamento: data_pago,
  })

  // ── 5. Busca lead para montar notificação ───────────────────────────────────
  const { data: lead } = await supabase
    .from('leads')
    .select('nome')
    .eq('id', ct.lead_id)
    .single()

  const valorFormatado = `R$ ${Number(valor_final).toFixed(2).replace('.', ',')}`
  const metodoLabel = metodo === 'pix' ? 'PIX' : metodo === 'boleto' ? 'Boleto' : metodo

  // ── 6. Cria notificação no dashboard ────────────────────────────────────────
  await supabase.from('notificacoes').insert({
    tipo: 'venda_robo',
    titulo: 'Venda confirmada via checkout',
    mensagem: `${lead?.nome || 'Lead'} regularizou o plano — ${valorFormatado} via ${metodoLabel}.`,
    prioridade: 'normal',
    meta: {
      lead_id: ct.lead_id,
      lead_nome: lead?.nome || '',
      valor: valor_final,
      metodo,
      transaction_id: transaction_id || null,
    },
  })

  console.log(`[webhook-cellcoin] Pagamento confirmado — lead ${ct.lead_id} — ${valorFormatado} via ${metodoLabel}`)

  return NextResponse.json({ received: true, action: 'payment_confirmed' })
}
