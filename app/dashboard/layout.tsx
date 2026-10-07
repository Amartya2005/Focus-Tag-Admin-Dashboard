import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getViewer } from '@/utils/auth/role'
import { logout } from './actions'
import { HeaderProfile } from './HeaderProfile'
import { ThemeToggle } from './ThemeToggle'
import { SidebarNav } from './SidebarNav'
import { navForRole } from './nav-config'
import { LiveRefresh } from './LiveRefresh'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Backend-authoritative role resolution (admin or teacher only).
  //    Admin-only segments add their own requireAdmin() guard; RLS/RPCs remain authoritative.
  const viewer = await getViewer()
  if (!viewer) {
    redirect('/unauthorized')
  }

  // 3. Fetch the institution context
  const { data: institution } = await supabase
    .from('institutions')
    .select('name')
    .eq('id', viewer.institutionId)
    .single()

  // Gracefully expand short acronyms for display
  const displayName =
    institution?.name === 'GIET'
      ? 'Gandhi Institute of Engineering and Technology'
      : institution?.name || 'Unknown Institution'

  const roleLabel = viewer.role === 'admin' ? 'Admin' : 'Teacher'

  const signOut = (
    <form action={logout}>
      <button type="submit" className="ft-btn ft-btn-ghost w-full">
        Sign out
      </button>
    </form>
  )

  return (
    <div className="flex h-screen ft-bg ft-text-primary">
      <LiveRefresh />
      <SidebarNav groups={navForRole(viewer.role)} roleLabel={roleLabel} footer={signOut} />

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden ft-bg">
        <header className="h-16 flex items-center justify-between gap-4 pl-16 pr-4 md:px-8 shrink-0 border-b ft-border ft-bg-elevated">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--ft-accent)' }} />
            <span className="text-sm font-medium truncate ft-text-secondary" title={displayName}>
              {displayName}
            </span>
            <span className={`ft-role-badge ${viewer.role === 'admin' ? 'ft-role-admin' : 'ft-role-teacher'}`}>
              {roleLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <HeaderProfile
              name={viewer.name || user.email || roleLabel}
              role={roleLabel}
              institutionName={displayName}
              logoutAction={logout}
            />
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <div className="max-w-6xl mx-auto ft-page">{children}</div>
        </div>
      </main>
    </div>
  )
}
