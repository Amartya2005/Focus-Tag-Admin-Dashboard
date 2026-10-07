'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { LiveRefresh } from './LiveRefresh'

type ActivityRow = {
  student_id: string
  name: string | null
  is_active: boolean
  active_since: string | null
  last_activity_at: string | null
}

type DashboardClass = {
  id: string
  name: string
  is_active: boolean
  location: string
  students: number
  teachers: number
}

type DashboardOverviewProps = {
  isAdmin: boolean
  viewerName: string
  institutionName: string
  studentsCount: number
  teachersCount: number
  classesCount: number
  locationsCount: number
  nfcTagsCount: number
  activity: ActivityRow[]
  recentClasses: DashboardClass[]
}

function Icon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const paths: Record<string, string> = {
    spark: 'M12 3v3m0 12v3M5.64 5.64l2.12 2.12m8.48 8.48l2.12 2.12M3 12h3m12 0h3M5.64 18.36l2.12-2.12m8.48-8.48l2.12-2.12',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m7-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-5a3 3 0 1 1 0 6m3 9v-2a4 4 0 0 0-3-3.87',
    teacher: 'M4 7.5 12 3l8 4.5-8 4.5L4 7.5Zm0 0V16m4.5-2.5L12 16l3.5-2.5M6 18.5c3.5 2 8.5 2 12 0',
    class: 'M4 19V6.8a1.8 1.8 0 0 1 1.8-1.8h11.4A1.8 1.8 0 0 1 19 6.8V19m-15 0h15M7 8h10M7 11h6',
    pin: 'M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    tag: 'm20 12-8 8-8-8V5a2 2 0 0 1 2-2h7l7 7a2 2 0 0 1 0 2Z',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    plus: 'M12 5v14M5 12h14',
    pulse: 'M3 12h3l2-6 4 12 2-6h7',
    clock: 'M12 7v5l3 2m7-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    check: 'm5 12 4 4L19 6',
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name] ?? paths.spark} />
    </svg>
  )
}

function formatActivity(iso: string | null) {
  if (!iso) return 'No activity yet'
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return minutes + 'm ago'
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours + 'h ago'
  const days = Math.floor(hours / 24)
  if (days < 7) return days + 'd ago'
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ST'
}

export function DashboardOverview(props: DashboardOverviewProps) {
  const {
    isAdmin,
    viewerName,
    institutionName,
    studentsCount,
    teachersCount,
    classesCount,
    locationsCount,
    nfcTagsCount,
    activity,
    recentClasses,
  } = props

  const [activityFilter, setActivityFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [classView, setClassView] = useState<'list' | 'compact'>('list')

  const activeStudents = activity.filter((row) => row.is_active).length
  const inactiveStudents = Math.max(0, activity.length - activeStudents)
  const activityRate = activity.length ? Math.round((activeStudents / activity.length) * 100) : 0

  const filteredActivity = useMemo(() => {
    if (activityFilter === 'active') return activity.filter((row) => row.is_active)
    if (activityFilter === 'inactive') return activity.filter((row) => !row.is_active)
    return activity
  }, [activity, activityFilter])

  const quickActions = isAdmin
    ? [
        { href: '/dashboard/students', label: 'Add student', hint: 'Create account', icon: 'users' },
        { href: '/dashboard/teachers', label: 'Add teacher', hint: 'Assign staff', icon: 'teacher' },
        { href: '/dashboard/classes', label: 'Create class', hint: 'Set up roster', icon: 'class' },
        { href: '/dashboard/nfc-tags', label: 'Register tag', hint: 'Connect a room', icon: 'tag' },
      ]
    : [{ href: '/dashboard/classes', label: 'View my classes', hint: 'Open rosters', icon: 'class' }]

  return (
    <div className="ft-dashboard-shell space-y-8">
      <LiveRefresh tables={['profiles', 'enrollments', 'focus_sessions']} minIntervalMs={5000} pollMs={60000} />

      <section className="ft-hero-grid overflow-hidden rounded-3xl border ft-border">
        <div className="relative p-7 sm:p-9">
          <div className="absolute inset-0 pointer-events-none ft-hero-grid-lines" />
          <div className="relative max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="ft-live-pill">
                <span className="ft-live-dot" />
                Live operations
              </span>
              <span className="ft-soft-pill">{institutionName}</span>
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] ft-text-muted mb-2">Good afternoon, {viewerName || 'Admin'}</p>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] ft-text-primary">
              Keep every classroom in focus.
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 ft-text-secondary">
              Monitor live student activity, manage your classroom infrastructure, and move from insight to action without digging through five different screens.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/dashboard/classes" className="ft-btn ft-btn-primary ft-btn-large group">
                Open classes
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href={isAdmin ? '/dashboard/students' : '/dashboard/classes'} className="ft-btn ft-btn-ghost ft-btn-large">
                {isAdmin ? 'Manage people' : 'Manage rosters'}
              </Link>
            </div>
          </div>
        </div>

        <div className="relative hidden xl:flex items-center justify-center min-h-[260px] overflow-hidden">
          <div className="ft-orbit ft-orbit-one" />
          <div className="ft-orbit ft-orbit-two" />
          <div className="ft-hero-signal">
            <div className="ft-signal-core">
              <Icon name="pulse" className="h-7 w-7" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">Focus engine online</span>
            <span className="text-3xl font-semibold tracking-tight">{activityRate}%</span>
            <span className="text-xs ft-text-muted">of visible students active</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard label="Students" value={studentsCount} icon="users" accent />
        {isAdmin && <MetricCard label="Teachers" value={teachersCount} icon="teacher" />}
        <MetricCard label="Classes" value={classesCount} icon="class" />
        {isAdmin && <MetricCard label="Locations" value={locationsCount} icon="pin" />}
        {isAdmin && <MetricCard label="NFC & QR" value={nfcTagsCount} icon="tag" />}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,.7fr)] gap-6">
        <div className="ft-card overflow-hidden">
          <div className="p-5 sm:p-6 border-b ft-border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold ft-text-primary">Student activity</h2>
                  <span className="ft-live-pill ft-live-pill-subtle"><span className="ft-live-dot" /> Live</span>
                </div>
                <p className="mt-1 text-sm ft-text-muted">A room-level view of who is currently in focus mode.</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg border p-1 ft-border ft-bg">
                {(['all', 'active', 'inactive'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActivityFilter(filter)}
                    className={activityFilter === filter ? 'ft-segment ft-segment-active' : 'ft-segment'}
                  >
                    {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Inactive'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b ft-border">
            <ActivityStat label="Total visible" value={activity.length} />
            <ActivityStat label="Active now" value={activeStudents} accent />
            <ActivityStat label="Inactive" value={inactiveStudents} />
          </div>

          <div className="max-h-[430px] overflow-auto">
            {filteredActivity.length ? (
              filteredActivity.map((row) => (
                <div key={row.student_id} className="ft-activity-row">
                  <div className={row.is_active ? 'ft-avatar ft-avatar-active' : 'ft-avatar'}>
                    {initials(row.name || row.student_id)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium truncate ft-text-primary">{row.name || row.student_id}</p>
                      <span className={row.is_active ? 'ft-status ft-status-active' : 'ft-status ft-status-inactive'}>
                        <span className="ft-status-dot" />
                        {row.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs ft-text-muted">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      {row.is_active ? 'Focus started ' : 'Last activity '}{formatActivity(row.is_active ? row.active_since : row.last_activity_at)}
                    </div>
                  </div>
                  <span className="hidden sm:block text-xs ft-text-muted">{row.is_active ? 'Focus session' : 'Waiting'}</span>
                </div>
              ))
            ) : (
              <div className="ft-empty">
                <Icon name="users" className="h-6 w-6" />
                <span className="ft-empty-title">No students in this view</span>
                <span>Try another filter.</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="ft-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] ft-text-muted">Operations</p>
                <h2 className="mt-1 text-lg font-semibold ft-text-primary">Quick actions</h2>
              </div>
              <div className="ft-brand-mark"><Icon name="spark" className="h-4 w-4" /></div>
            </div>
            <div className="mt-5 space-y-2">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href} className="ft-action-row group">
                  <span className="ft-action-icon"><Icon name={action.icon} className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium ft-text-primary">{action.label}</span>
                    <span className="block text-xs ft-text-muted">{action.hint}</span>
                  </span>
                  <Icon name="arrow" className="h-4 w-4 ft-text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="ft-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] ft-text-muted">System pulse</p>
                <h2 className="mt-1 text-lg font-semibold ft-text-primary">Everything healthy</h2>
              </div>
              <div className="ft-health-ring">
                <Icon name="check" className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <HealthRow label="Student activity" detail={activity.length ? 'Receiving events' : 'Waiting for events'} healthy={activity.length > 0} />
              <HealthRow label="Class infrastructure" detail={classesCount + ' classes tracked'} healthy={classesCount > 0} />
              {isAdmin && <HealthRow label="Physical tags" detail={nfcTagsCount + ' tags registered'} healthy={nfcTagsCount > 0} />}
            </div>
          </div>
        </div>
      </section>

      <section className="ft-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b ft-border">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] ft-text-muted">Classrooms</p>
              <h2 className="mt-1 text-lg font-semibold ft-text-primary">Recent class activity</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border p-1 ft-border ft-bg">
                <button type="button" onClick={() => setClassView('list')} className={classView === 'list' ? 'ft-segment ft-segment-active' : 'ft-segment'}>List</button>
                <button type="button" onClick={() => setClassView('compact')} className={classView === 'compact' ? 'ft-segment ft-segment-active' : 'ft-segment'}>Compact</button>
              </div>
              <Link href="/dashboard/classes" className="ft-btn ft-btn-ghost ft-btn-sm group">
                View all
                <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {recentClasses.length ? (
          <div className={classView === 'compact' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px ft-bg-surface' : 'divide-y ft-divider'}>
            {recentClasses.map((item, index) => (
              <Link
                href={`/dashboard/classes/${item.id}`}
                key={item.id}
                className={classView === 'compact' ? 'ft-class-card ft-bg-elevated p-5' : 'ft-class-row'}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="ft-index-pill">{String(index + 1).padStart(2, '0')}</span>
                      <span className={item.is_active ? 'ft-status ft-status-active' : 'ft-status ft-status-inactive'}>
                        <span className="ft-status-dot" />
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h3 className="mt-3 font-semibold ft-text-primary truncate">{item.name}</h3>
                    <p className="mt-1 text-xs ft-text-muted flex items-center gap-1.5">
                      <Icon name="pin" className="h-3.5 w-3.5" />
                      {item.location}
                    </p>
                  </div>
                  <Icon name="arrow" className="h-4 w-4 ft-text-muted group-hover:translate-x-0.5 transition-transform" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniStat label="Students" value={item.students} />
                  <MiniStat label="Teachers" value={item.teachers} />
                </div>

                <div className="mt-5 h-1.5 rounded-full ft-progress-track overflow-hidden">
                  <div className="ft-progress-fill" style={{ width: Math.min(100, Math.max(8, item.students * 4)) + '%' }} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="ft-empty">
            <Icon name="class" className="h-7 w-7" />
            <span className="ft-empty-title">No classes yet</span>
            <span>Create your first classroom to get the dashboard moving.</span>
            {isAdmin && <Link href="/dashboard/classes" className="ft-btn ft-btn-primary ft-btn-sm mt-2">Create class</Link>}
          </div>
        )}
      </section>
    </div>
  )
}

function MetricCard({ label, value, icon, accent = false }: { label: string; value: number; icon: string; accent?: boolean }) {
  return (
    <div className="ft-metric-card group">
      <div className={accent ? 'ft-metric-icon ft-metric-icon-accent' : 'ft-metric-icon'}>
        <Icon name={icon} className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.15em] font-semibold ft-text-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight ft-text-primary">{value}</p>
      </div>
      <div className="ml-auto text-xs ft-text-muted opacity-0 group-hover:opacity-100 transition-opacity">View</div>
    </div>
  )
}

function ActivityStat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="p-4 sm:p-5">
      <p className="text-[11px] uppercase tracking-[0.14em] font-semibold ft-text-muted">{label}</p>
      <p className={accent ? 'mt-1 text-2xl font-semibold ft-accent' : 'mt-1 text-2xl font-semibold ft-text-primary'}>{value}</p>
    </div>
  )
}

function HealthRow({ label, detail, healthy }: { label: string; detail: string; healthy: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={healthy ? 'ft-health-dot ft-health-dot-good' : 'ft-health-dot'} />
      <div className="min-w-0">
        <p className="text-sm font-medium ft-text-primary">{label}</p>
        <p className="text-xs ft-text-muted truncate">{detail}</p>
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-3 ft-border ft-bg">
      <p className="text-[10px] uppercase tracking-[0.13em] font-semibold ft-text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold ft-text-primary">{value}</p>
    </div>
  )
}
