import { type NextRequest } from 'next/server'
import PROXY_ROUTES from './proxy-routes.json'

// ── 代理配置 ────────────────────────────────────────────────────────────────
// 新增子站：只需编辑 proxy-routes.json，然后运行 npm run cf:rebuild
// ──────────────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const route = PROXY_ROUTES.find(
    r => pathname === r.prefix || pathname.startsWith(r.prefix + '/')
  )
  if (!route) return

  let upstream = route.upstream + pathname + search

  // redirect:'manual' — CF Workers 跨 Zone 时 redirect:'follow' 会把 301 透传给浏览器
  let res = await fetch(upstream, {
    method: request.method,
    headers: {
      'user-agent': request.headers.get('user-agent') ?? '',
      'accept': request.headers.get('accept') ?? '*/*',
      'accept-language': request.headers.get('accept-language') ?? '',
      'accept-encoding': 'identity',
    },
    redirect: 'manual',
  })

  for (let i = 0; i < 5 && res.status >= 300 && res.status < 400; i++) {
    const loc = res.headers.get('location')
    if (!loc) break
    upstream = new URL(loc, upstream).href
    res = await fetch(upstream, {
      headers: {
        'user-agent': request.headers.get('user-agent') ?? '',
        'accept': request.headers.get('accept') ?? '*/*',
        'accept-language': request.headers.get('accept-language') ?? '',
        'accept-encoding': 'identity',
      },
      redirect: 'manual',
    })
  }

  const headers = new Headers(res.headers)
  headers.delete('transfer-encoding')
  headers.delete('content-encoding')
  headers.delete('location') // 绝不把上游跳转暴露给浏览器

  return new Response(res.body, { status: res.status, headers })
}

export const config = {
  matcher: [
    '/monitor', '/monitor/:path*',
    '/research', '/research/:path*',
    '/wallet', '/wallet/:path*',
    '/library', '/library/:path*',
  ],
}
