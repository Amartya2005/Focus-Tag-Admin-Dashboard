import { requireAdmin } from '@/utils/auth/role'

/** Admin-only segment: teachers are redirected to /unauthorized. */
export default async function AdminOnlyLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <>{children}</>
}
