'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

type LiveTable = 'profiles' | 'enrollments' | 'focus_sessions'

/**
 * Keeps a server-rendered section live. Mounted only on pages that show live
 * data (Overview activity, class roster). Realtime changes (RLS-filtered) are
 * coalesced into at most one router.refresh() per `minIntervalMs`; a slow
 * fallback poll (visible tab only) covers rows the viewer can't receive over
 * Realtime. No refresh on window focus.
 */
export function LiveRefresh({
  tables = ['profiles', 'enrollments', 'focus_sessions'],
  minIntervalMs = 4000,
  pollMs = 60000,
}: {
  tables?: LiveTable[]
  minIntervalMs?: number
  pollMs?: number
}) {
  const router = useRouter()
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastRefresh = useRef(0)
  const tableKey = tables.join(',')

  useEffect(() => {
    const supabase = createClient()
    lastRefresh.current = Date.now()

    const doRefresh = () => {
      timer.current = null
      lastRefresh.current = Date.now()
      router.refresh()
    }
    // Leading-edge throttle with trailing call: never more than one refresh per window.
    const schedule = () => {
      if (timer.current) return
      const wait = Math.max(0, lastRefresh.current + minIntervalMs - Date.now())
      timer.current = setTimeout(doRefresh, Math.max(wait, 300))
    }

    let channel = supabase.channel(`dashboard-live-${tableKey}`)
    for (const table of tableKey.split(',')) {
      channel = channel.on('postgres_changes', { event: '*', schema: 'public', table }, schedule)
    }
    channel.subscribe()

    const poll = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastRefresh.current >= pollMs) schedule()
    }, pollMs)

    return () => {
      clearInterval(poll)
      if (timer.current) clearTimeout(timer.current)
      supabase.removeChannel(channel)
    }
  }, [router, tableKey, minIntervalMs, pollMs])

  return null
}
