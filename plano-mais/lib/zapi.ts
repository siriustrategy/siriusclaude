// lib/zapi.ts
// Helper Z-API compartilhado entre routes (checkout, enviar-mensagem, etc.)

export function zapiBase(): string | null {
  const id    = process.env.ZAPI_INSTANCE_ID
  const token = process.env.ZAPI_INSTANCE_TOKEN
  if (!id || !token) return null
  return `https://api.z-api.io/instances/${id}/token/${token}`
}

export function zapiHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (process.env.ZAPI_CLIENT_TOKEN) headers['Client-Token'] = process.env.ZAPI_CLIENT_TOKEN
  return headers
}

/**
 * Envia mensagem de texto via WhatsApp (Z-API).
 * Retorna true se enviado com sucesso.
 */
export async function zapiEnviarTexto(phone: string, message: string): Promise<boolean> {
  const base = zapiBase()
  if (!base) {
    console.warn('[Z-API] ZAPI_INSTANCE_ID ou ZAPI_INSTANCE_TOKEN não configurados')
    return false
  }
  const phoneClean = phone.replace(/\D/g, '')
  try {
    const res = await fetch(`${base}/send-text`, {
      method: 'POST',
      headers: zapiHeaders(),
      body: JSON.stringify({ phone: phoneClean, message }),
    })
    if (!res.ok) {
      const body = await res.text()
      console.error(`[Z-API] Erro ${res.status}:`, body)
    }
    return res.ok
  } catch (e) {
    console.error('[Z-API] Exceção ao enviar texto:', e)
    return false
  }
}
