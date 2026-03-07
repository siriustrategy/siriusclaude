export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    googleCalendar: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    telegram: !!process.env.TELEGRAM_BOT_TOKEN,
    clickup: !!(process.env.CLICKUP_API_KEY && process.env.CLICKUP_WORKSPACE_ID),
    plaud: !!(process.env.OPENAI_API_KEY),
  })
}
