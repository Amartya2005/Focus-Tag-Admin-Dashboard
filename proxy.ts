import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { takeToken } from '@/utils/security/rateLimit'

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for')
  return (fwd?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim()
}

export async function proxy(request: NextRequest) {
  // Server actions (incl. login) are POSTs. Rate limit per IP, per instance.
  if (request.method === 'POST') {
    const ip = clientIp(request)
    const isLogin = request.nextUrl.pathname.startsWith('/login')
    const ok = isLogin
      ? takeToken(`login:${ip}`, 10, 10 / 60) // burst 10, ~10/min
      : takeToken(`mut:${ip}`, 60, 1) // burst 60, 1/s sustained
    if (!ok) {
      return new NextResponse('Too many requests', {
        status: 429,
        headers: { 'Retry-After': isLogin ? '30' : '5' },
      })
    }
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run only for real page/action requests. Skip:
     * - _next/static, _next/image, _next/data (build assets / image optimizer)
     * - favicon, robots, sitemap, manifest
     * - any file with a static asset extension
     */
    '/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|woff2?|ttf)$).*)',
  ],
}
