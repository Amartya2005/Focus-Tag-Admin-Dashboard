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
}

/**
 * Resolves the signed-in user's dashboard role (cached per request).
 * UI-only gate: RLS + RPCs remain the source of truth for authorization.
 */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name, role, institution_id')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.institution_id) return null
  if (profile.role !== 'admin' && profile.role !== 'teacher') return null

  return {
    userId: user.id,
    email: user.email ?? null,
    name: profile.name ?? null,
    role: profile.role,
    institutionId: profile.institution_id,
  }
})

/** Server-side guard for admin-only route segments. */
export async function requireAdmin(): Promise<Viewer> {
  const viewer = await getViewer()
  if (!viewer) redirect('/login')
  if (viewer.role !== 'admin') redirect('/unauthorized')
  return viewer
}
