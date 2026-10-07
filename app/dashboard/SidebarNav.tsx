'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { NavGroup, NavIcon } from './nav-config'

const ICONS: Record<NavIcon, string> = {
  overview:
    'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  students:
    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  teachers:
    'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  classes:
    'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  locations:
    'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  tags: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
}

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavList({ groups, pathname, onNavigate }: { groups: NavGroup[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5" aria-label="Main">
      {groups.map((group, gi) => (
        <div key={group.label ?? gi}>
          {group.label && <p className="ft-nav-label">{group.label}</p>}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`ft-nav-link ${active ? 'ft-nav-link-active' : ''}`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={ICONS[item.icon]} />
                    </svg>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function SidebarNav({
  groups,
  roleLabel,
  footer,
}: {
  groups: NavGroup[]
  roleLabel: string
  footer: React.ReactNode
}) {
  const pathname = usePathname() || '/dashboard'
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const brand = (
    <div className="h-16 px-5 flex items-center gap-3 border-b shrink-0 ft-border">
      <div className="ft-brand-mark">FT</div>
      <div className="flex flex-col min-w-0">
        <span className="text-[15px] font-semibold tracking-tight leading-tight ft-text-primary">FocusTag</span>
        <span className="text-[11px] font-medium ft-text-muted">{roleLabel} Console</span>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile trigger (rendered into header slot via fixed position) */}
      <button
        type="button"
        className="md:hidden fixed top-3 left-3 z-40 ft-icon-btn"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop rail */}
      <aside className="hidden md:flex w-60 flex-col shrink-0 border-r ft-border ft-bg-elevated">
        {brand}
        <NavList groups={groups} pathname={pathname} />
        <div className="p-3 border-t shrink-0 ft-border">{footer}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] flex flex-col ft-bg-elevated border-r ft-border shadow-xl">
            {brand}
            <button
              type="button"
              className="absolute top-3 right-3 ft-icon-btn"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <NavList groups={groups} pathname={pathname} onNavigate={() => setOpen(false)} />
            <div className="p-3 border-t shrink-0 ft-border">{footer}</div>
          </aside>
        </div>
      )}
    </>
  )
}
