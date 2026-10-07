'use client'

import { useMemo, useState, useTransition } from 'react'
import { saveClassPolicy } from '../actions'

const PACKAGE_RE = /^[a-z0-9_][a-z0-9_.-]{0,127}$/

const commonApps = [
  ['Instagram', 'com.instagram.android'],
  ['YouTube', 'com.google.android.youtube'],
  ['TikTok', 'com.zhiliaoapp.musically'],
  ['Discord', 'com.discord'],
]

export function ClassPolicyEditor({
  classId,
  initialPackages,
  version,
  canEdit,
}: {
  classId: string
  initialPackages: string[]
  version: string | null
  canEdit: boolean
}) {
  const [value, setValue] = useState(initialPackages.join('\n'))
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const packages = useMemo(
    () =>
      Array.from(
        new Set(
          value
            .split(/[\n,]/)
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean),
        ),
      ),
    [value],
  )

  const invalid = packages.filter((pkg) => !PACKAGE_RE.test(pkg))

  function addPackage(pkg: string) {
    const current = new Set(packages)
    current.add(pkg)
    setValue(Array.from(current).join('\n'))
    setMessage(null)
    setError(null)
  }

  function clearAll() {
    setValue('')
    setMessage(null)
    setError(null)
  }

  function save() {
    setMessage(null)
    setError(null)

    if (packages.length > 200) {
      setError('A class policy may contain at most 200 packages.')
      return
    }

    if (invalid.length > 0) {
      setError(`Invalid package: ${invalid[0]}`)
      return
    }

    startTransition(async () => {
      const result = await saveClassPolicy(classId, packages)
      if (!result.success) {
        setError(result.error || 'Could not publish policy.')
        return
      }
      setMessage(
        result.version
          ? `Published ${result.version} with ${packages.length} blocked apps.`
          : 'Policy published.',
      )
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] rounded-full border font-semibold"
          style={{
            backgroundColor: 'var(--ft-accent-muted)',
            borderColor: 'var(--ft-accent-border)',
            color: 'var(--ft-accent)',
          }}
        >
          {packages.length} blocked
        </span>
        <span className="text-xs" style={{ color: 'var(--ft-text-muted)' }}>
          {version ? `Current ${version}` : 'No policy published yet'}
        </span>
      </div>

      {canEdit && (
        <div className="flex flex-wrap gap-2">
          {commonApps.map(([label, pkg]) => (
            <button
              key={pkg}
              type="button"
              onClick={() => addPackage(pkg)}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: 'var(--ft-bg)',
                borderColor: 'var(--ft-border)',
                color: 'var(--ft-text-secondary)',
              }}
            >
              + {label}
            </button>
          ))}
        </div>
      )}

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2"
          style={{ color: 'var(--ft-text-muted)' }}
        >
          Blocked Android packages
        </label>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={!canEdit || isPending}
          rows={7}
          placeholder="One Android package per line, e.g. com.instagram.android"
          className="ft-input w-full rounded-xl border px-4 py-3 text-sm font-mono leading-6 transition-all disabled:opacity-60"
          style={{
            backgroundColor: 'var(--ft-bg-input)',
            borderColor: invalid.length ? 'var(--ft-error-text)' : 'var(--ft-border)',
            color: 'var(--ft-text-primary)',
          }}
        />
        <p className="mt-2 text-xs" style={{ color: 'var(--ft-text-muted)' }}>
          {canEdit
            ? 'Publish a new version when the class policy changes. The Android client applies the newest policy at session start.'
            : 'Read-only policy view. Only institution admins can publish changes.'}
        </p>
      </div>

      {invalid.length > 0 && (
        <div className="ft-error border rounded-lg px-3 py-2 text-xs">
          Invalid package names: {invalid.slice(0, 3).join(', ')}
          {invalid.length > 3 ? '…' : ''}
        </div>
      )}

      {error && <div className="ft-error border rounded-lg px-3 py-2 text-sm">{error}</div>}
      {message && <div className="ft-success border rounded-lg px-3 py-2 text-sm">{message}</div>}

      {canEdit && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={save}
            disabled={isPending || invalid.length > 0 || packages.length > 200}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--ft-accent)' }}
          >
            {isPending ? 'Publishing…' : 'Publish policy'}
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:opacity-80 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--ft-bg)',
              borderColor: 'var(--ft-border)',
              color: 'var(--ft-text-secondary)',
            }}
          >
            Clear
          </button>
        </div>
      )}

      {packages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {packages.map((pkg) => (
            <span
              key={pkg}
              className="rounded-lg border px-2.5 py-1.5 text-[11px] font-mono"
              style={{
                backgroundColor: 'var(--ft-bg)',
                borderColor: 'var(--ft-border)',
                color: 'var(--ft-text-secondary)',
              }}
            >
              {pkg}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
