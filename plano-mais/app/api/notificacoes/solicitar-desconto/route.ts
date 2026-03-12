import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/notificacoes/solicitar-desconto
 *
 * Atendente solicita desconto especial ao gestor.
 * Cria uma notificação tipo 'desconto_aprovacao' no Supabase,
 * que aparece em realtime no NotificacoesDropdown do gestor.
 *
 * Body: {
 *   lead_id: string
 *   desconto_solicitado: number   — ex: 25 (%)
 *   atendente_nome?: string
 * }
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { lead_id, desconto_solicitado, atendente_nome } = body

  if (!lead_id || !desconto_solicitado) {
    return NextResponse.json({ error: 'lead_id e desconto_solicitado são obrigatórios' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: lead, error: leadErr } = await supabase
    .from('leads')
    .select('nome, fase_cobranca, valor_em_aberto')
    .eq('id', lead_id)
    .single()

  if (leadErr || !lead) {
    return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
  }

  const descontoFase: Record<string, number> = { mes3: 5, mes4: 15, mes5: 20 }
  const descontoPadrao = descontoFase[lead.fase_cobranca] || 0
  const descontoExtra = Math.max(0, desconto_solicitado - descontoPadrao)

  const mensagem = `${atendente_nome || 'Atendente'} solicitou desconto de ${desconto_solicitado}% para ${lead.nome} (${lead.fase_cobranca} — padrão ${descontoPadrao}%).`

  const { error: notifErr } = await supabase
    .from('notificacoes')
    .insert({
      tipo: 'desconto_aprovacao',
      titulo: 'Aprovação de desconto solicitada',
      mensagem,
      prioridade: 'alta',
      lida: false,
      meta: {
        lead_id,
        lead_nome: lead.nome,
        lead_fase: lead.fase_cobranca,
        lead_valor: lead.valor_em_aberto,
        atendente: atendente_nome || 'Atendente',
        desconto_total: desconto_solicitado,
        desconto_extra: descontoExtra,
      },
    })

  if (notifErr) {
    console.error('[solicitar-desconto] Erro ao criar notificação:', notifErr)
    return NextResponse.json({ error: 'Erro ao criar notificação' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
