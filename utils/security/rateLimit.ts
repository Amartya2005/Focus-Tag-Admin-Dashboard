/**
 * Minimal in-memory token bucket keyed by string (e.g. "login:<ip>").
 * NOTE: per server instance only (Vercel runs several), so this is a speed
 * bump, not a global limit. Supabase Auth applies its own server-side limits.
 */
type Bucket = { tokens: number; updated: number }

const buckets = new Map<string, Bucket>()
const MAX_KEYS = 10_000

export function takeToken(key: string, capacity: number, refillPerSec: number): boolean {
  const now = Date.now()
  let b = buckets.get(key)
  if (!b) {
    if (buckets.size >= MAX_KEYS) {
      const oldest = buckets.keys().next().value
      if (oldest !== undefined) buckets.delete(oldest)
    }
    b = { tokens: capacity, updated: now }
    buckets.set(key, b)
  }
  b.tokens = Math.min(capacity, b.tokens + ((now - b.updated) / 1000) * refillPerSec)
  b.updated = now
  if (b.tokens < 1) return false
  b.tokens -= 1
  return true
}
