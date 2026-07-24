'use client'

import { useEffect, useState } from 'react'
import { themedQrDataUrl } from '@/lib/qr'
import type { ThemeKey } from '@/lib/themes'

export default function ShareSection({
  slug,
  coupleName,
  theme,
}: {
  slug: string
  coupleName: string
  theme: ThemeKey
}) {
  const [copied, setCopied] = useState(false)
  const [qr, setQr] = useState<string | null>(null)
  const [url, setUrl] = useState('')

  useEffect(() => {
    // window.location is unavailable during SSR — deferring to an effect
    // (rather than computing during render) keeps the first client render
    // matching the server-rendered markup, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(`${window.location.origin}/p/${slug}`)
  }, [slug])

  useEffect(() => {
    if (!url) return
    themedQrDataUrl(url, theme).then(setQr).catch(() => setQr(null))
  }, [url, theme])

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappText = encodeURIComponent(`${coupleName} are expecting! See our announcement page: ${url}`)

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-medium text-neutral-900">Share</h2>

      <div className="mt-3 flex items-center gap-2">
        <input
          readOnly
          value={url}
          className="min-w-0 flex-1 truncate rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500"
        />
        <button
          type="button"
          onClick={copyLink}
          className="shrink-0 rounded-full bg-neutral-100 px-3 py-2 text-xs text-neutral-700 transition hover:bg-neutral-200"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm text-white transition hover:bg-emerald-600"
        >
          Share on WhatsApp
        </a>

        {qr && (
          <a
            href={qr}
            download={`velli-${slug}-qr.png`}
            className="flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs text-neutral-600 transition hover:bg-neutral-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR code" width={28} height={28} />
            Download QR
          </a>
        )}
      </div>
    </div>
  )
}
