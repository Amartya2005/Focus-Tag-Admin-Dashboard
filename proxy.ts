import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
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
