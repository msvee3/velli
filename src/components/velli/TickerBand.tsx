'use client'

import { useEffect, useState } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'
import type { TickerMessage } from '@/types'

const SEPARATOR = '  ✦  ' // "  ✦  "

export interface TickerBandProps {
  theme: ThemeKey
  phase?: 'announce' | 'reveal'
  /** Static/controlled messages — used by the builder preview (no polling). */
  messages?: TickerMessage[]
  /** When set, the band fetches and polls this page's live messages instead. */
  pageId?: string
}

export default function TickerBand({ theme, phase = 'announce', messages, pageId }: TickerBandProps) {
  // Only the polling case (pageId set) needs its own state — the static/
  // controlled case just reads straight from the `messages` prop, no effect
  // needed to keep it in sync.
  const [polled, setPolled] = useState<TickerMessage[] | null>(null)
  const palette = themes[theme][phase].ticker

  useEffect(() => {
    if (!pageId) return

    let cancelled = false
    async function poll() {
      try {
        const res = await fetch(`/api/messages?pageId=${pageId}`)
        if (!res.ok) return
        const data = (await res.json()) as TickerMessage[]
        if (!cancelled) setPolled(data) // both spans re-render from the same state in one frame
      } catch {
        // Silent — the ticker just keeps showing the last-known messages.
      }
    }
    poll()
    const id = setInterval(poll, 60_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [pageId])

  const live = pageId ? (polled ?? []) : (messages ?? [])
  const text = live.length > 0 ? live.map((m) => m.text).join(SEPARATOR) : ''
  if (!text) return null

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex h-8 items-center overflow-hidden border-t backdrop-blur-sm"
      style={{ background: palette.bg, borderColor: palette.border }}
    >
      <div className="flex whitespace-nowrap" style={{ animation: 'scroll 24s linear infinite' }}>
        <span className="px-4 text-xs" style={{ color: palette.text }}>
          {text}
          {SEPARATOR}
        </span>
        <span className="px-4 text-xs" style={{ color: palette.text }} aria-hidden="true">
          {text}
          {SEPARATOR}
        </span>
      </div>
    </div>
  )
}
