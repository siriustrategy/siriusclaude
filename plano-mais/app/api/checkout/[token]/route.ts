import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/checkout/[token]
// Busca o token de checkout no banco e retorna os dados para a página pública
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  // ── Token especial de demonstração (sem banco) ──────────────────────────────
  if (token === 'demo') {
    const valor_original = 320.00
    const desconto_percentual = 15
    const valor_desconto = valor_original * desconto_percentual / 100
    const valor_final = +(valor_original - valor_desconto).toFixed(2)
    return NextResponse.json({
      token_id: 'demo',
      token: 'demo',
      expira_em: new Date(Date.now() + 7 * 86400000).toISOString(),
      lead: { nome: 'Maria Silva (demo)', telefone: '(11) 9 9999-9999', plano: 'Plano Mais Família' },
      fase: 'mes4',
      valor_original,
      desconto_percentual,
      valor_desconto,
      valor_final,
      parcelamento_disponivel: true,
      parcelas: [
        { num: 1, valor: valor_final, label: 'À vista' },
        { num: 2, valor: +(valor_final / 2).toFixed(2), label: `2x de R$ ${(valor_final / 2).toFixed(2).replace('.', ',')}` },
        { num: 3, valor: +(valor_final / 3).toFixed(2), label: `3x de R$ ${(valor_final / 3).toFixed(2).replace('.', ',')}` },
      ],
    })
  }
  // ───────────────────────────────────────────────────────────────────────────

  const supabase = await createClient()

  // Busca o token com join no lead
  const { data, error } = await supabase
    .from('checkout_tokens')
    .select(`
      id, token, usado, expira_em, valor, desconto, created_at,
      lead:leads(
        id, nome, telefone, plano, fase_cobranca, valor_em_aberto,
        valor_mensalidade, dias_atraso, status
      )
    `)
    .eq('token', token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Link inválido ou não encontrado' }, { status: 404 })
  }

  // Verifica expiração
  if (new Date(data.expira_em) < new Date()) {
    return NextResponse.json({ error: 'Este link de pagamento expirou. Solicite um novo link ao atendente.' }, { status: 410 })
  }

  // Verifica se já foi pago
  if (data.usado) {
    return NextResponse.json({ error: 'Este link já foi utilizado. Seu plano está regularizado!' }, { status: 409 })
  }

  // Calcula valores
  const lead = Array.isArray(data.lead) ? data.lead[0] : data.lead
  const valor_original = Number(data.valor)
  const desconto_percentual = Number(data.desconto)
  const valor_desconto = valor_original * desconto_percentual / 100
  const valor_final = valor_original - valor_desconto
  const fase = lead?.fase_cobranca || 'mes1'

  // Regras de parcelamento por fase
  const parcelamento = getParcelamento(fase, valor_final)

  return NextResponse.json({
    token_id: data.id,
    token: data.token,
    expira_em: data.expira_em,
    lead: {
      nome: lead?.nome || 'Cliente',
      telefone: lead?.telefone || '',
      plano: lead?.plano || 'Plano Mais',
    },
    fase,
    valor_original,
    desconto_percentual,
    valor_desconto,
    valor_final,
    parcelamento_disponivel: parcelamento.length > 1,
    parcelas: parcelamento,
  })
}

/**
 * Retorna as opções de parcelamento conforme fase do lead
 * Regras:
 * - pre, mes1, mes2: somente à vista
 * - mes3: somente à vista (desconto 5%)
 * - mes4: à vista, 2x, 3x sem juros (desconto 15%)
 * - mes5: à vista, 2x, 3x sem juros (desconto 20%)
 * - pos: somente à vista
 */
function getParcelamento(fase: string, valor_final: number) {
  const avista = { num: 1, valor: valor_final, label: 'À vista' }

  if (fase === 'mes4') {
    return [
      avista,
      { num: 2, valor: +(valor_final / 2).toFixed(2), label: `2x de R$ ${(valor_final / 2).toFixed(2).replace('.', ',')}` },
      { num: 3, valor: +(valor_final / 3).toFixed(2), label: `3x de R$ ${(valor_final / 3).toFixed(2).replace('.', ',')}` },
    ]
  }

  if (fase === 'mes5') {
    return [
      avista,
      { num: 2, valor: +(valor_final / 2).toFixed(2), label: `2x de R$ ${(valor_final / 2).toFixed(2).replace('.', ',')}` },
      { num: 3, valor: +(valor_final / 3).toFixed(2), label: `3x de R$ ${(valor_final / 3).toFixed(2).replace('.', ',')}` },
    ]
  }

  // pre, mes1, mes2, mes3, pos → apenas à vista
  return [avista]
}
