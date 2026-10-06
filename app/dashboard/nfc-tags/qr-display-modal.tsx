'use client'

import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

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
  const qrPayload = `focustag://tag/${tagUid}`
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-2.5 py-1.5 rounded text-xs font-medium transition-colors"
          style={{ backgroundColor: 'var(--ft-accent)', color: 'white' }}
        >
          View QR
        </button>

        <form action={() => onRegenerate(tagId)}>
          <button
            type="submit"
            className="px-2.5 py-1.5 rounded text-xs font-medium transition-colors"
            style={{ backgroundColor: 'var(--ft-warning-bg, #fff3cd)', color: 'var(--ft-warning-text, #856404)' }}
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
            className="px-2.5 py-1.5 rounded text-xs font-medium transition-colors"
            style={{ backgroundColor: 'var(--ft-error-bg)', color: 'var(--ft-error-text)' }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full relative flex flex-col items-center">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Classroom QR</h3>
            
            <div className="bg-white p-4 rounded-xl shadow-inner border">
              <QRCodeSVG
                value={qrPayload}
                size={256}
                level="Q"
                marginSize={4}
                fgColor="#1E3A8A" // brand color proxy (dark blue)
              />
            </div>
            
            <p className="mt-6 text-sm text-center text-gray-500">
              Print this QR — encodes focustag://tag/{uid} (same identity as NFC). Place at the classroom door.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
