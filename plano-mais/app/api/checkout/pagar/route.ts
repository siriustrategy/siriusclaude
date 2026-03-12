import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { zapiEnviarTexto } from '@/lib/zapi'

/**
 * POST /api/checkout/pagar
 *
 * Integração Cell Coin API para processar pagamento.
 *
 * Body: {
 *   token: string           — token do checkout (uuid hex)
 *   metodo: 'pix' | 'cartao' | 'boleto'
 *   parcelas: number        — 1, 2 ou 3
 *   // Para cartão:
 *   cartao_numero?: string
 *   cartao_validade?: string
 *   cartao_cvv?: string
 *   cartao_nome?: string
 * }
 *
 * Cell Coin Docs: https://developers.cellcoin.com.br
 * Endpoints utilizados:
 *   PIX:    POST /v1/payment-collection/pix
 *   Cartão: POST /v1/payment-collection/card
 *   Boleto: POST /v1/payment-collection/boleto
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, metodo, parcelas = 1, cartao_numero, cartao_validade, cartao_cvv, cartao_nome } = body

  if (!token || !metodo) {
    return NextResponse.json({ error: 'token e metodo são obrigatórios' }, { status: 400 })
  }

  const supabase = await createClient()

  // Busca o token no banco
  const { data: ct, error: ctErr } = await supabase
    .from('checkout_tokens')
    .select('id, lead_id, usado, expira_em, valor, desconto')
    .eq('token', token)
    .single()

  if (ctErr || !ct) return NextResponse.json({ error: 'Token inválido' }, { status: 404 })
  if (ct.usado) return NextResponse.json({ error: 'Token já utilizado' }, { status: 409 })
  if (new Date(ct.expira_em) < new Date()) return NextResponse.json({ error: 'Token expirado' }, { status: 410 })

  // Busca lead para montar payload Cell Coin
  const { data: lead } = await supabase
    .from('leads')
    .select('nome, telefone, email, cpf')
    .eq('id', ct.lead_id)
    .single()

  const valor_original = Number(ct.valor)
  const desconto_percentual = Number(ct.desconto)
  const valor_final = +(valor_original - (valor_original * desconto_percentual / 100)).toFixed(2)
  const valor_parcela = +(valor_final / parcelas).toFixed(2)

  // ============================================================
  // INTEGRAÇÃO CELL COIN API
  // ============================================================
  const CELLCOIN_URL = process.env.CELLCOIN_API_URL || 'https://api.cellcoin.com.br'
  const CELLCOIN_TOKEN = process.env.CELLCOIN_API_TOKEN

  if (!CELLCOIN_TOKEN) {
    return NextResponse.json({ error: 'Configuração Cell Coin ausente. Configure CELLCOIN_API_TOKEN no .env' }, { status: 500 })
  }

  let cellcoinResult: { qr_code?: string; boleto_url?: string; boleto_codigo?: string; transaction_id?: string; status?: string } = {}
  let cellcoinOk = false

  try {
    if (metodo === 'pix') {
      // Cell Coin PIX — gera QR code
      const res = await fetch(`${CELLCOIN_URL}/v1/payment-collection/pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CELLCOIN_TOKEN}`,
        },
        body: JSON.stringify({
          amount: valor_final,
          description: `Plano Mais — regularização ${lead?.nome || ''}`,
          payer: {
            name: lead?.nome || 'Cliente',
            document: lead?.cpf || '',
            phone: lead?.telefone || '',
          },
          external_id: ct.id,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        cellcoinOk = true
        cellcoinResult = {
          qr_code: data.qr_code || data.qrCode || data.emv,
          transaction_id: data.transaction_id || data.id,
          status: 'pending',
        }
      }

    } else if (metodo === 'cartao') {
      // Cell Coin Cartão de Crédito
      const [mes, ano] = (cartao_validade || '').split('/')
      const res = await fetch(`${CELLCOIN_URL}/v1/payment-collection/card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CELLCOIN_TOKEN}`,
        },
        body: JSON.stringify({
          amount: valor_final,
          installments: parcelas,
          card: {
            number: (cartao_numero || '').replace(/\s/g, ''),
            expiration_month: mes,
            expiration_year: ano ? (ano.length === 2 ? `20${ano}` : ano) : '',
            cvv: cartao_cvv,
            holder_name: cartao_nome,
          },
          payer: {
            name: lead?.nome || cartao_nome || 'Cliente',
            document: lead?.cpf || '',
            email: lead?.email || '',
          },
          external_id: ct.id,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        cellcoinOk = true
        cellcoinResult = {
          transaction_id: data.transaction_id || data.id,
          status: data.status || 'approved',
        }
      }

    } else if (metodo === 'boleto') {
      // Cell Coin Boleto
      const res = await fetch(`${CELLCOIN_URL}/v1/payment-collection/boleto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CELLCOIN_TOKEN}`,
        },
        body: JSON.stringify({
          amount: valor_final,
          due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
          payer: {
            name: lead?.nome || 'Cliente',
            document: lead?.cpf || '',
            phone: lead?.telefone || '',
          },
          description: `Plano Mais — regularização ${lead?.nome || ''}`,
          external_id: ct.id,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        cellcoinOk = true
        cellcoinResult = {
          boleto_url: data.url || data.boleto_url,
          boleto_codigo: data.barcode || data.codigo_barras,
          transaction_id: data.transaction_id || data.id,
          status: 'pending',
        }
      }
    }
  } catch (err) {
    console.error('[checkout/pagar] Cell Coin error:', err)
  }

  // ============================================================
  // PÓS-PROCESSAMENTO POR MÉTODO
  // ============================================================

  if (cellcoinOk) {

    // ── PIX gerado: envia WhatsApp + salva para régua de lembretes ──
    if (metodo === 'pix' && cellcoinResult.qr_code && lead?.telefone) {
      const valorFormatado = `R$ ${valor_final.toFixed(2).replace('.', ',')}`

      // 1. Envia código PIX via WhatsApp
      await zapiEnviarTexto(lead.telefone, [
        `✅ *PIX gerado para seu Plano Mais!*`,
        ``,
        `Valor: *${valorFormatado}*`,
        ``,
        `Copie o código abaixo e pague via *Pix Copia e Cola*:`,
        ``,
        cellcoinResult.qr_code,
        ``,
        `Ou acesse seu link de pagamento para escanear o QR Code.`,
        ``,
        `⏰ Este código expira em 30 minutos.`,
        `Dúvidas? Responda esta mensagem.`,
      ].join('\n'))

      // 2. Salva na régua de lembretes (n8n processará os follow-ups)
      await supabase.from('cobrancas_pendentes').insert({
        lead_id: ct.lead_id,
        checkout_token_id: ct.id,
        metodo: 'pix',
        valor: valor_final,
        telefone: lead.telefone,
        pix_codigo: cellcoinResult.qr_code,
        transaction_id: cellcoinResult.transaction_id || null,
      })
    }

    // ── Boleto gerado: envia WhatsApp + salva para régua de lembretes ──
    if (metodo === 'boleto' && lead?.telefone) {
      const valorFormatado = `R$ ${valor_final.toFixed(2).replace('.', ',')}`
      const vencimento = new Date(Date.now() + 3 * 86400000).toLocaleDateString('pt-BR')

      const linhas = [
        `📄 *Boleto gerado para seu Plano Mais!*`,
        ``,
        `Valor: *${valorFormatado}*`,
        `Vencimento: *${vencimento}*`,
        ``,
      ]
      if (cellcoinResult.boleto_codigo) {
        linhas.push(`*Código de barras:*`, cellcoinResult.boleto_codigo, ``)
      }
      if (cellcoinResult.boleto_url) {
        linhas.push(`📎 Ver boleto completo:`, cellcoinResult.boleto_url, ``)
      }
      linhas.push(`⏰ Prazo: 1 a 3 dias úteis para compensação.`, `Dúvidas? Responda esta mensagem.`)

      // 1. Envia boleto via WhatsApp
      await zapiEnviarTexto(lead.telefone, linhas.join('\n'))

      // 2. Salva na régua de lembretes (n8n processará os follow-ups)
      await supabase.from('cobrancas_pendentes').insert({
        lead_id: ct.lead_id,
        checkout_token_id: ct.id,
        metodo: 'boleto',
        valor: valor_final,
        telefone: lead.telefone,
        boleto_url: cellcoinResult.boleto_url || null,
        boleto_codigo: cellcoinResult.boleto_codigo || null,
        transaction_id: cellcoinResult.transaction_id || null,
      })
    }

    // ── Cartão aprovado: marca como pago + notificação de venda ──
    if (metodo === 'cartao') {
      await supabase
        .from('checkout_tokens')
        .update({ usado: true, metodo_pagamento: 'cartao', parcelas })
        .eq('id', ct.id)

      await supabase
        .from('leads')
        .update({ status: 'pago' })
        .eq('id', ct.lead_id)

      await supabase.from('pagamentos').insert({
        lead_id: ct.lead_id,
        valor: valor_final,
        valor_original: valor_original,
        desconto_aplicado: desconto_percentual,
        metodo: 'cartao',
        status: 'confirmado',
        referencia: cellcoinResult.transaction_id || null,
        data_pagamento: new Date().toISOString(),
      })

      // Notificação de venda para o gestor no dashboard
      const valorFormatado = `R$ ${valor_final.toFixed(2).replace('.', ',')}`
      await supabase.from('notificacoes').insert({
        tipo: 'venda_robo',
        titulo: 'Venda confirmada via checkout',
        mensagem: `${lead?.nome || 'Lead'} regularizou o plano — ${valorFormatado} via cartão${parcelas > 1 ? ` em ${parcelas}x` : ' à vista'}.`,
        prioridade: 'normal',
        meta: {
          lead_id: ct.lead_id,
          lead_nome: lead?.nome || '',
          valor: valor_final,
          metodo: 'cartao',
          parcelas,
        },
      })
    }
  }

  return NextResponse.json({
    ok: cellcoinOk,
    metodo,
    valor_final,
    valor_parcela,
    parcelas,
    ...cellcoinResult,
    _dev: !cellcoinOk ? 'Cell Coin não processou. Verifique CELLCOIN_API_TOKEN e CELLCOIN_API_URL.' : undefined,
  })
}
