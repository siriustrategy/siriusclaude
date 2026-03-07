export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect('https://sirius-hub-production.up.railway.app/integracoes?google=error')
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'https://sirius-hub-production.up.railway.app/api/google-calendar/callback'

  // Trocar code por tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenRes.json()

  if (!tokens.refresh_token) {
    return NextResponse.redirect('https://sirius-hub-production.up.railway.app/integracoes?google=no_refresh_token')
  }

  // Salvar refresh token no Supabase (usando service role para bypass RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const userId = process.env.SUPABASE_DEFAULT_USER_ID
  if (userId) {
    await supabase.from('user_integrations').upsert({
      user_id: userId,
      google_refresh_token: tokens.refresh_token,
      google_connected: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  }

  return NextResponse.redirect('https://sirius-hub-production.up.railway.app/integracoes?google=success')
}
