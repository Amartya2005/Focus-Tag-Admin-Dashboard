import { requireAdmin } from '@/utils/auth/role'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Admin-only segment: teachers are redirected to /unauthorized. */
export default async function AdminOnlyLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <>{children}</>
}
