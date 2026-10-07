export type StudentActivity = {
  student_id: string
  is_active: boolean
  active_since: string | null
  last_activity_at: string | null
}

export function ActivityBadge({ active }: { active: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-semibold border"
      style={active ? {
        backgroundColor: 'var(--ft-badge-active-bg)',
        borderColor: 'var(--ft-badge-active-border)',
        color: 'var(--ft-badge-active-text)',
      } : {
        backgroundColor: 'var(--ft-badge-inactive-bg)',
        borderColor: 'var(--ft-badge-inactive-border)',
        color: 'var(--ft-badge-inactive-text)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

export function formatActivityTime(iso: string | null): string {
  if (!iso) return 'Never'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' IST'
}
