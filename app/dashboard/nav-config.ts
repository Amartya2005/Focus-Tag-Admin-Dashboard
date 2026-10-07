import type { DashboardRole } from '@/utils/auth/role'

export type NavIcon = 'overview' | 'students' | 'teachers' | 'classes' | 'locations' | 'tags'

export type NavItem = { href: string; label: string; icon: NavIcon; roles: DashboardRole[] }
export type NavGroup = { label: string | null; items: NavItem[] }

export const NAV_GROUPS: NavGroup[] = [
  { label: null, items: [{ href: '/dashboard', label: 'Overview', icon: 'overview', roles: ['admin', 'teacher'] }] },
  {
    label: 'People',
    items: [
      { href: '/dashboard/students', label: 'Students', icon: 'students', roles: ['admin'] },
      { href: '/dashboard/teachers', label: 'Teachers', icon: 'teachers', roles: ['admin'] },
    ],
  },
  {
    label: 'Space',
    items: [
      { href: '/dashboard/locations', label: 'Locations', icon: 'locations', roles: ['admin'] },
      { href: '/dashboard/nfc-tags', label: 'NFC & QR Tags', icon: 'tags', roles: ['admin'] },
    ],
  },
  {
    label: 'Teaching',
    items: [{ href: '/dashboard/classes', label: 'Classes', icon: 'classes', roles: ['admin', 'teacher'] }],
  },
]

export function navForRole(role: DashboardRole): NavGroup[] {
  return NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) })).filter(
    (g) => g.items.length > 0,
  )
}
