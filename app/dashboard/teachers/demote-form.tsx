'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { demoteTeacherToStudent } from './actions'

export function DemoteForm({ 
  userId, 
  assignmentCount 
}: { 
  userId: string
  assignmentCount: number 
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function handleDemote() {
    let message = ''
    if (assignmentCount > 0) {
      message = `Demote this teacher to student?\nThey are currently assigned to ${assignmentCount} class${assignmentCount === 1 ? '' : 'es'}.\nDemoting them will remove those teacher assignments.`
    } else {
      message = `Demote this teacher to student?\nThey have no current class assignments.`
    }

    if (!window.confirm(message)) {
      return
    }

    startTransition(async () => {
      const result = await demoteTeacherToStudent(userId)
      if (result.success) {
        router.push(`/dashboard/teachers?demoted=${userId}`)
      } else {
        router.push(`/dashboard/teachers?error=${encodeURIComponent(result.error || 'Unknown error')}`)
      }
    })
  }

  return (
    <button
      onClick={handleDemote}
      disabled={isPending}
      className="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors focus:outline-none focus:ring-2 hover:bg-red-600 hover:text-white disabled:opacity-50"
      style={{
        backgroundColor: 'var(--ft-bg-elevated)',
        borderColor: 'var(--ft-border)',
        color: 'var(--ft-text-primary)',
      }}
    >
      {isPending ? 'Demoting...' : 'Demote to Student'}
    </button>
  )
}
