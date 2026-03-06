import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CLICKUP_API = 'https://api.clickup.com/api/v2'
const CLICKUP_KEY = process.env.CLICKUP_API_KEY

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    if (!CLICKUP_KEY) {
      return NextResponse.json({ error: 'CLICKUP_API_KEY não configurada.' }, { status: 401 })
    }

    const workspaceId = process.env.CLICKUP_WORKSPACE_ID
    if (!workspaceId) {
      return NextResponse.json({ error: 'CLICKUP_WORKSPACE_ID não configurado.' }, { status: 400 })
    }

    // Buscar spaces do workspace
    const spacesRes = await fetch(`${CLICKUP_API}/team/${workspaceId}/space`, {
      headers: { Authorization: CLICKUP_KEY },
    })
    const spacesData = await spacesRes.json()
    const spaces = spacesData.spaces || []

    const synced: { nome: string; tasks: number }[] = []

    for (const space of spaces.slice(0, 5)) {
      // Buscar listas do space
      const listsRes = await fetch(`${CLICKUP_API}/space/${space.id}/list`, {
        headers: { Authorization: CLICKUP_KEY },
      })
      const listsData = await listsRes.json()
      const lists = listsData.lists || []

      for (const list of lists.slice(0, 3)) {
        // Buscar tasks da lista
        const tasksRes = await fetch(`${CLICKUP_API}/list/${list.id}/task?statuses[]=to do&statuses[]=in progress`, {
          headers: { Authorization: CLICKUP_KEY },
        })
        const tasksData = await tasksRes.json()
        const tasks = tasksData.tasks || []

        // Upsert projeto no Hub (baseado no space)
        const { data: projeto } = await supabase
          .from('projetos')
          .upsert({
            nome: space.name,
            empresa: 'ClickUp',
            descricao: `Sincronizado do ClickUp — ${list.name}`,
            status: 'Em andamento',
            score: 50,
            horas_investidas: 0,
            data_inicio: new Date().toISOString().split('T')[0],
            tags: ['clickup', space.name.toLowerCase()],
            user_id: userId,
          }, { onConflict: 'nome' })
          .select()
          .single()

        synced.push({ nome: space.name, tasks: tasks.length })
      }
    }

    return NextResponse.json({ synced, spaces: spaces.length })
  } catch (error) {
    console.error('ClickUp sync error:', error)
    return NextResponse.json({ error: 'Erro ao sincronizar ClickUp' }, { status: 500 })
  }
}
