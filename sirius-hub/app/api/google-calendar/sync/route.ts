import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Busca token de acesso Google usando o refresh token salvo no Supabase
async function getGoogleAccessToken(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('user_integrations')
    .select('google_refresh_token')
    .eq('user_id', userId)
    .single()

  if (!data?.google_refresh_token) return null

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: data.google_refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const json = await res.json()
  return json.access_token || null
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const accessToken = await getGoogleAccessToken(userId)
    if (!accessToken) {
      return NextResponse.json({ error: 'Google Calendar não conectado. Configure em Integrações.' }, { status: 401 })
    }

    // Buscar eventos dos próximos 30 dias
    const now = new Date().toISOString()
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&timeMax=${future}&singleEvents=true&orderBy=startTime&maxResults=50`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    const gcal = await res.json()
    if (!gcal.items) return NextResponse.json({ synced: 0 })

    let synced = 0
    for (const event of gcal.items) {
      const eventId = event.id
      const titulo = event.summary || 'Sem título'
      const dataHora = event.start?.dateTime || event.start?.date
      const data = dataHora ? dataHora.split('T')[0] : new Date().toISOString().split('T')[0]
      const horario = dataHora?.includes('T') ? dataHora.split('T')[1].substring(0, 5) : ''
      const participantes = (event.attendees || []).map((a: { email: string }) => a.email)

      // Upsert: se já existe (por google_event_id), atualiza; se não, cria
      const { error } = await supabase.from('reunioes').upsert({
        titulo,
        data,
        horario,
        participantes,
        empresa: 'Google Calendar',
        google_event_id: eventId,
        user_id: userId,
        pauta: event.description || '',
      }, { onConflict: 'google_event_id' })

      if (!error) synced++
    }

    return NextResponse.json({ synced, total: gcal.items.length })
  } catch (error) {
    console.error('Google Calendar sync error:', error)
    return NextResponse.json({ error: 'Erro ao sincronizar' }, { status: 500 })
  }
}
