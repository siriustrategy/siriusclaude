import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas públicas (não precisam de login)
const PUBLIC_ROUTES = ['/login', '/checkout']

// Rotas protegidas (precisam de login)
const PROTECTED_PREFIXES = ['/dashboard', '/chat', '/crm', '/campanhas', '/analytics', '/custos', '/admin']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se é rota pública
  const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  // Verificar se é rota protegida
  const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))

  // Se não é nem pública nem protegida, deixar passar (ex: /, api routes, assets)
  if (!isPublic && !isProtected) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Se está em rota protegida sem estar logado → redireciona para login
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se está em /login mas já está logado → redireciona para dashboard ou chat
  if (pathname.startsWith('/login') && user) {
    // Buscar o role do usuário para redirecionar corretamente
    const { data: userData } = await supabase
      .from('usuarios')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role === 'gestor') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/chat', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas EXCETO:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
