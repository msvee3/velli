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

  if (!state) return <div className="h-7" /> // reserve layout space pre-mount

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
    <div className="flex items-baseline justify-center gap-1.5">
      <Unit value={state.days} label="days" palette={palette} />
      <span className="text-xs" style={{ color: palette.text.countdownLabel, opacity: 0.5 }}>
        ·
      </span>
      <Unit value={state.hours} label="hrs" palette={palette} />
    </div>
  )
}

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
    <span className="flex items-baseline gap-1">
      <span
        className="font-[family-name:var(--font-celebration)] text-[1.4rem] leading-none tabular-nums"
        style={{ color: palette.text.countdown }}
      >
        {value}
      </span>
      <span
        className="text-[0.6rem] uppercase tracking-[0.2em]"
        style={{ color: palette.text.countdownLabel }}
      >
        {label}
      </span>
    </span>
  )
}
