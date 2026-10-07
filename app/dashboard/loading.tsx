/** Instant skeleton while a dashboard route streams in. */
export default function DashboardLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="space-y-3">
        <div className="h-9 w-56 rounded-md" style={{ backgroundColor: 'var(--ft-bg-surface)' }} />
        <div className="h-5 w-96 max-w-full rounded-md" style={{ backgroundColor: 'var(--ft-bg-surface)' }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 rounded-xl border" style={{ backgroundColor: 'var(--ft-bg-elevated)', borderColor: 'var(--ft-border)' }} />
        ))}
      </div>
      <TableSkeleton />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--ft-bg-elevated)', borderColor: 'var(--ft-border)' }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-12 border-t first:border-t-0" style={{ borderColor: 'var(--ft-table-divider)' }}>
          <div className="h-3 w-1/3 rounded mt-4 ml-6" style={{ backgroundColor: 'var(--ft-bg-surface)' }} />
        </div>
      ))}
    </div>
  )
}
