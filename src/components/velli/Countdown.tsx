'use client'

import { useEffect, useState } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'

// Typical full-term gestation window, used only as the reference span for how
// full the countdown arc starts — not a medical claim, just a sensible sweep.
const REFERENCE_DAYS = 280

function useCountdown(dueDate: string) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    // Date.now() differs between server render and client hydration — start
    // at null (matching SSR) and fill in the real clock only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now())
    // Recalculated once a minute — the arc/digits don't need per-second updates.
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [dueDate])

  if (now === null) return null // avoids a server/client mismatch on first paint

  const due = new Date(dueDate).getTime()
  // An unset/half-typed due date (the builder's initial state) parses to NaN —
  // without this the arc and the digits both render literal "NaN".
  if (!Number.isFinite(due)) return null

  const msRemaining = Math.max(0, due - now)
  const totalMinutes = Math.floor(msRemaining / 60_000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const fraction = Math.min(1, Math.max(0, msRemaining / (REFERENCE_DAYS * 24 * 60 * 60 * 1000)))
  const arrived = msRemaining <= 0

  return { days, hours, fraction, arrived }
}

export function CountdownRing({
  dueDate,
  theme,
  size,
}: {
  dueDate: string
  theme: ThemeKey
  size: number
}) {
  const state = useCountdown(dueDate)
  if (!state) return null // defer SVG render until countdown is initialized

  const palette = themes[theme].announce
  const radius = size / 2 + size * 0.18
  const circumference = 2 * Math.PI * radius
  const fraction = state.fraction

  return (
    <svg
      className="pointer-events-none absolute -inset-[18%]"
      viewBox={`0 0 ${size * 1.36} ${size * 1.36}`}
      aria-hidden="true"
    >
      <circle
        cx={size * 0.68}
        cy={size * 0.68}
        r={radius}
        fill="none"
        stroke={palette.text.countdownLabel}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - fraction)}
        transform={`rotate(-90 ${size * 0.68} ${size * 0.68})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

export function CountdownDigits({ dueDate, theme }: { dueDate: string; theme: ThemeKey }) {
  const state = useCountdown(dueDate)
  const palette = themes[theme].announce

  // Reserves the cells' height so the headline below never jumps once the
  // clock resolves (or while the builder's due date is still unset).
  if (!state) return <div className="h-[52px]" />

  if (state.arrived) {
    return (
      <p
        className="font-[family-name:var(--font-accent)] text-base tracking-[0.06em]"
        style={{ color: palette.text.countdown, fontStyle: themes[theme].accentFontStyle }}
      >
        Any day now
      </p>
    )
  }

  return (
    <div className="flex items-stretch justify-center gap-2.5">
      <Unit value={state.days} label="days" palette={palette} />
      <Unit value={state.hours} label="hrs" palette={palette} />
    </div>
  )
}

/**
 * One HUD-style countdown cell — a bracketed panel rather than loose text, so
 * the number reads as instrumentation against the framed layout.
 */
function Unit({
  value,
  label,
  palette,
}: {
  value: number
  label: string
  palette: (typeof themes)[ThemeKey]['announce']
}) {
  return (
    <span
      className="flex min-w-[64px] flex-col items-center gap-1 rounded-md px-3 py-1.5 backdrop-blur-[2px]"
      style={{
        background: palette.btn.bg,
        border: `1px solid ${palette.accent}2e`,
        boxShadow: `inset 0 1px 0 ${palette.heroRim}33`,
      }}
    >
      <span
        className="font-[family-name:var(--font-celebration)] text-[1.55rem] font-semibold leading-none tabular-nums"
        style={{ color: palette.text.countdown }}
      >
        {value}
      </span>
      <span
        className="text-[0.55rem] uppercase leading-none tracking-[0.24em]"
        style={{ color: palette.text.countdownLabel }}
      >
        {label}
      </span>
    </span>
  )
}
