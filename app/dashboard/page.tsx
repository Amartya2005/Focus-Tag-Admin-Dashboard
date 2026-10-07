import { createClient } from '@/utils/supabase/server'
import { getViewer } from '@/utils/auth/role'
import { Suspense } from 'react'
import { DashboardOverview } from './DashboardOverview'
import { TableSkeleton } from './loading'

type ActivityRow = {
  student_id: string
  name: string | null
  is_active: boolean
  active_since: string | null
  last_activity_at: string | null
}

export default async function DashboardPage() {
  const [supabase, viewer] = await Promise.all([createClient(), getViewer()])
  if (!viewer) return null

  const isAdmin = viewer.role === 'admin'
  const headCount = (table: 'profiles' | 'classes' | 'locations' | 'nfc_tags') =>
    supabase.from(table).select('id', { count: 'exact', head: true })
  const none = Promise.resolve({ count: null as number | null })

  const [
    { count: studentsCount },
    { count: teachersCount },
    { count: classesCount },
    { count: locationsCount },
    { count: nfcTagsCount },
    { data: recentClasses },
  ] = await Promise.all([
    isAdmin ? headCount('profiles').eq('role', 'student') : none,
    isAdmin ? headCount('profiles').eq('role', 'teacher') : none,
    headCount('classes'),
    isAdmin ? headCount('locations') : none,
    isAdmin ? headCount('nfc_tags') : none,
    supabase
      .from('classes')
      .select('id, name, is_active, locations(name), enrollments(count), teacher_class_access(count)')
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const normalizedClasses = (recentClasses ?? []).map((row) => {
    const location = Array.isArray(row.locations) ? row.locations[0] : row.locations
    const enrollments = Array.isArray(row.enrollments) ? row.enrollments[0] : row.enrollments
    const teachers = Array.isArray(row.teacher_class_access) ? row.teacher_class_access[0] : row.teacher_class_access

    return {
      id: row.id,
      name: row.name,
      is_active: row.is_active,
      location: (location as { name?: string } | null)?.name ?? 'Unassigned',
      students: (enrollments as { count?: number } | null)?.count ?? 0,
      teachers: (teachers as { count?: number } | null)?.count ?? 0,
    }
  })

  return (
    <Suspense fallback={<TableSkeleton />}>
      <ActivityAndDashboard
        isAdmin={isAdmin}
        viewerName={viewer.name || viewer.email || (isAdmin ? 'Admin' : 'Teacher')}
        institutionName={viewer.institutionName || 'Institution'}
        studentsCount={studentsCount ?? 0}
        teachersCount={teachersCount ?? 0}
        classesCount={classesCount ?? 0}
        locationsCount={locationsCount ?? 0}
        nfcTagsCount={nfcTagsCount ?? 0}
        recentClasses={normalizedClasses}
        supabase={supabase}
      />
    </Suspense>
  )
}

async function ActivityAndDashboard({
  isAdmin,
  viewerName,
  institutionName,
  studentsCount,
  teachersCount,
  classesCount,
  locationsCount,
  nfcTagsCount,
  recentClasses,
  supabase,
}: {
  isAdmin: boolean
  viewerName: string
  institutionName: string
  studentsCount: number
  teachersCount: number
  classesCount: number
  locationsCount: number
  nfcTagsCount: number
  recentClasses: {
    id: string
    name: string
    is_active: boolean
    location: string
    students: number
    teachers: number
  }[]
  supabase: Awaited<ReturnType<typeof createClient>>
}) {
  const { data: activityRows } = await supabase.rpc('get_student_activity_summary')

  return (
    <DashboardOverview
      isAdmin={isAdmin}
      viewerName={viewerName}
      institutionName={institutionName}
      studentsCount={studentsCount}
      teachersCount={teachersCount}
      classesCount={classesCount}
      locationsCount={locationsCount}
      nfcTagsCount={nfcTagsCount}
      activity={(activityRows ?? []) as ActivityRow[]}
      recentClasses={recentClasses}
    />
  )
}
