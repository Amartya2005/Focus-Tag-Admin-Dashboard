'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

/**
 * Keeps server-rendered dashboard data live: re-renders the current route
 * (router.refresh) when profiles / enrollments / focus_sessions change via
 * Supabase Realtime (RLS-filtered), plus a periodic fallback poll for rows
 * the viewer cannot receive over Realtime.
 */
export function LiveRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter()
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const refresh = () => {
      if (pending.current) return
      pending.current = setTimeout(() => {
        pending.current = null
        router.refresh()
      }, 500)
    }

    const channel = supabase
      .channel('dashboard-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'focus_sessions' }, refresh)
      .subscribe()

    const poll = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh()
    }, intervalMs)
    const onFocus = () => router.refresh()
    window.addEventListener('focus', onFocus)

    return () => {
      clearInterval(poll)
      window.removeEventListener('focus', onFocus)
      if (pending.current) clearTimeout(pending.current)
      supabase.removeChannel(channel)
    }
  }, [router, intervalMs])

  return null
}
