import { getViewer, type Viewer } from '@/utils/auth/role'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}

/** Throws if any value is not a UUID. Server actions are public endpoints. */
export function assertUuids(...values: unknown[]): void {
  for (const v of values) {
    if (!isUuid(v)) throw new Error('Invalid identifier')
  }
}

/**
 * Server-side auth gate for admin-only server actions. Never trusts form input
 * for identity or institution: role/institution come from the verified JWT +
 * profiles row. The RPCs re-check this in Postgres as the final authority.
 */
export async function requireAdminAction(): Promise<Viewer> {
  const viewer = await getViewer()
  if (!viewer || viewer.role !== 'admin') throw new Error('Unauthorized')
  return viewer
}
