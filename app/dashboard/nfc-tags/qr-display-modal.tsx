'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export function QrActionButtons({
  tagId,
  tagUid,
  activeQr,
  onRegenerate,
  onRevoke
}: {
  tagId: string
  /** NFC UID — printed QR uses focustag://tag/{uid} to match student TagLinkParser */
  tagUid: string
  activeQr: { id: string; credential: string }
  onRegenerate: (tagId: string) => void
  onRevoke: (credentialId: string) => void
}) {
  // Non-negotiable: the student-facing payload is always the NFC UID deep link.
  const qrPayload = `focustag://tag/${tagUid}`
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(qrPayload)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link:', qrPayload)
    }
  }, [qrPayload])

  const downloadPng = useCallback(() => {
    const canvas = canvasWrapRef.current?.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `focustag-${tagUid.replace(/[^a-zA-Z0-9_-]/g, '_')}.png`
    a.click()
  }, [tagUid])

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-1">
        <button type="button" onClick={() => setIsOpen(true)} className="ft-btn ft-btn-primary ft-btn-sm">
          Show QR
        </button>

        <form action={() => onRegenerate(tagId)}>
          <button
            type="submit"
            className="ft-btn ft-btn-ghost ft-btn-sm"
            onClick={(e) => {
              if (!confirm('Regenerating invalidates the previous QR immediately. Are you sure?')) {
                e.preventDefault()
              }
            }}
          >
            Regenerate
          </button>
        </form>

        <form action={() => onRevoke(activeQr.id)}>
          <button
            type="submit"
            className="ft-btn ft-btn-danger ft-btn-sm"
            onClick={(e) => {
              if (!confirm('Revoking disables this QR credential immediately. The NFC tag remains functional. Are you sure?')) {
                e.preventDefault()
              }
            }}
          >
            Revoke
          </button>
        </form>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`qr-title-${tagId}`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="ft-card w-full sm:max-w-md rounded-b-none sm:rounded-2xl p-6 sm:p-8 relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 ft-icon-btn"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 id={`qr-title-${tagId}`} className="text-lg font-semibold ft-text-primary">Classroom QR</h3>
            <p className="text-xs mt-1 mb-5 ft-text-muted">
              NFC UID <span className="font-mono ft-text-secondary">{tagUid}</span>
            </p>

            <div ref={canvasWrapRef} className="bg-white p-3 rounded-xl border w-full max-w-[320px] aspect-square">
              <QRCodeCanvas
                value={qrPayload}
                size={640}
                level="Q"
                marginSize={4}
                fgColor="#1E3A8A"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <code className="mt-5 w-full text-center text-xs font-mono break-all px-3 py-2 rounded-md ft-bg-surface ft-text-secondary">
              {qrPayload}
            </code>

            <div className="mt-4 grid grid-cols-2 gap-2 w-full">
              <button type="button" onClick={copyLink} className="ft-btn ft-btn-ghost">
                {copied ? 'Copied ✓' : 'Copy link'}
              </button>
              <button type="button" onClick={downloadPng} className="ft-btn ft-btn-primary">
                Download PNG
              </button>
            </div>

            <p className="mt-5 text-xs text-center ft-text-muted">
              Print this QR — encodes focustag://tag/{'{uid}'} (same identity as NFC). Place at the classroom door.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
