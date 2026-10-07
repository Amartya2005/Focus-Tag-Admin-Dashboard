import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export type DashboardRole = 'admin' | 'teacher'

export type Viewer = {
  userId: string
  email: string | null
  name: string | null
  role: DashboardRole
  institutionId: string
  institutionName: string | null
}

/**
 * Resolves the signed-in user's dashboard role (cached per request).
 * UI-only gate: RLS + RPCs remain the source of truth for authorization.
 */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient()
  // Verified JWT claims (local check with asymmetric keys; falls back to
  // Auth server verification otherwise). The proxy already refreshed the session.
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims
  if (!claims?.sub) return null

  // Profile + institution name in a single round trip.
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name, role, institution_id, institutions ( name )')
    .eq('id', claims.sub)
    .single()

  if (!profile || !profile.institution_id) return null
  if (profile.role !== 'admin' && profile.role !== 'teacher') return null

  return {
    userId: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
    name: profile.name ?? null,
    role: profile.role,
    institutionId: profile.institution_id,
    institutionName:
      (Array.isArray(profile.institutions) ? profile.institutions[0] : profile.institutions)?.name ?? null,
  }
})

/** Server-side guard for admin-only route segments. */
export async function requireAdmin(): Promise<Viewer> {
  const viewer = await getViewer()
  if (!viewer) redirect('/login')
  if (viewer.role !== 'admin') redirect('/unauthorized')
  return viewer
}
