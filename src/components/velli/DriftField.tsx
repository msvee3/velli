'use client'

import { useEffect, useState } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'
import { particleGlyphs } from './particles'

interface Mote {
  id: number
  left: number
  sway: number
  size: number
  duration: number
  delay: number
  color: string
}

const MAX_MOTES = 14 // capped for mobile perf

export default function DriftField({ theme }: { theme: ThemeKey }) {
  const [motes, setMotes] = useState<Mote[]>([])
  const Glyph = particleGlyphs[theme]

  useEffect(() => {
    // Randomised per mount, not per render — generated client-side only so
    // the layout never causes a hydration mismatch (purely decorative).
    const colors = themes[theme].reveal.burstColors
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMotes(
      Array.from({ length: MAX_MOTES }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        sway: -40 + Math.random() * 80,
        size: 8 + Math.random() * 6,
        duration: 3.5 + Math.random() * 2.5,
        delay: Math.random() * 1.5,
        color: colors[i % colors.length],
      }))
    )
  }, [theme])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.id}
          className="absolute top-0"
          style={
            {
              left: `${m.left}%`,
              '--sway': `${m.sway}px`,
              animation: `confetti-fall ${m.duration}s ease-in ${m.delay}s infinite`,
            } as React.CSSProperties
          }
        >
          <Glyph size={m.size} color={m.color} />
        </span>
      ))}
    </div>
  )
}
