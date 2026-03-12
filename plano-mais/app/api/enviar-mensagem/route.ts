import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// ─── Z-API helpers ────────────────────────────────────────────────────────────
function zapiBase() {
  const id    = process.env.ZAPI_INSTANCE_ID
  const token = process.env.ZAPI_INSTANCE_TOKEN
  if (!id || !token) return null
  return `https://api.z-api.io/instances/${id}/token/${token}`
}

function zapiHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (process.env.ZAPI_CLIENT_TOKEN) headers['Client-Token'] = process.env.ZAPI_CLIENT_TOKEN
  return headers
}

// ─── Route ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { conversa_id, conteudo, tipo, arquivo_url, arquivo_nome } = await req.json()

  if (!conversa_id || (!conteudo?.trim() && !arquivo_url)) {
    return NextResponse.json({ error: 'conversa_id e conteudo/arquivo obrigatorios' }, { status: 400 })
  }

  // Busca conversa + telefone do lead
  const { data: conversa, error: convErr } = await supabase
    .from('conversas')
    .select('id, lead_id, lead:leads(telefone, nome)')
    .eq('id', conversa_id)
    .single()

  if (convErr || !conversa) {
    return NextResponse.json({ error: 'Conversa nao encontrada' }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lead = (Array.isArray(conversa.lead) ? conversa.lead[0] : conversa.lead) as { telefone: string; nome: string } | null

  // Determina tipo final
  const tipoFinal = tipo === 'nota_interna' ? 'nota_interna'
    : tipo === 'audio'     ? 'audio'
    : tipo === 'imagem'    ? 'imagem'
    : tipo === 'video'     ? 'video'
    : tipo === 'documento' ? 'documento'
    : 'texto'

  // Salva mensagem no banco
  const { data: msg, error: msgErr } = await supabase
    .from('mensagens')
    .insert({
      conversa_id,
      lead_id:      conversa.lead_id,
      remetente:    'ATENDENTE',
      conteudo:     conteudo?.trim() || arquivo_nome || '',
      tipo:         tipoFinal,
      arquivo_url:  arquivo_url  || null,
      arquivo_nome: arquivo_nome || null,
    })
    .select('id, remetente, conteudo, tipo, timestamp, arquivo_url, arquivo_nome')
    .single()

  if (msgErr) {
    console.error('[DB] Erro ao salvar mensagem:', msgErr)
    return NextResponse.json({ error: 'Erro ao salvar mensagem' }, { status: 500 })
  }

  // ─── Envio via Z-API ────────────────────────────────────────────────────────
  let waDebug: Record<string, unknown> | null = null

  if (tipoFinal !== 'nota_interna' && lead?.telefone) {
    const base = zapiBase()

    if (!base) {
      waDebug = { error: 'ZAPI_INSTANCE_ID ou ZAPI_INSTANCE_TOKEN não configurados' }
    } else {
      const phone = lead.telefone.replace(/\D/g, '')
      const hdrs  = zapiHeaders()

      try {
        let endpoint = ''
        let body: Record<string, unknown> = {}

        if (tipoFinal === 'audio' && arquivo_url) {
          // Z-API /send-audio: envia URL pública diretamente (mais confiável que base64)
          // O bucket "mensagens" deve ser público no Supabase Storage
          endpoint = `${base}/send-audio`
          body = { phone, audio: arquivo_url }

        } else if (tipoFinal === 'imagem' && arquivo_url) {
          endpoint = `${base}/send-image`
          body = { phone, image: arquivo_url, caption: conteudo?.trim() || '' }

        } else if (tipoFinal === 'video' && arquivo_url) {
          endpoint = `${base}/send-video`
          body = { phone, video: arquivo_url, caption: conteudo?.trim() || '' }

        } else if (tipoFinal === 'documento' && arquivo_url) {
          // Extensão do arquivo para o endpoint Z-API
          const ext = (arquivo_nome || 'arquivo').split('.').pop()?.toLowerCase() ?? 'pdf'
          endpoint = `${base}/send-document/${ext}`
          body = { phone, document: arquivo_url, fileName: arquivo_nome || `arquivo.${ext}` }

        } else {
          // Texto simples (ou link)
          endpoint = `${base}/send-text`
          body = { phone, message: conteudo?.trim() }
        }

        const waRes  = await fetch(endpoint, {
          method:  'POST',
          headers: hdrs,
          body:    JSON.stringify(body),
        })
        const waBody = await waRes.text()

        waDebug = {
          status:   waRes.status,
          ok:       waRes.ok,
          endpoint,
          response: waBody,
        }

        if (!waRes.ok) {
          console.error(`[Z-API] ERRO ${waRes.status}:`, waBody)
          waDebug = { ...waDebug, ok: false }
        } else {
          console.log(`[Z-API] OK tipo=${tipoFinal} → ${phone}`)
        }

      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e)
        waDebug = { error: errMsg }
        console.error('[Z-API] Exceção:', e)
      }
    }
  }

  return NextResponse.json({ ok: true, msg, _wa: waDebug })
}
