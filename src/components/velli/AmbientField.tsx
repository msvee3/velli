'use client'

import { useEffect, useState } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'
import { particleGlyphs } from './particles'

interface Star {
  id: number
  top: number
  left: number
  size: number
  lo: number
  hi: number
  duration: number
  delay: number
  bonus?: boolean
}

interface Spark {
  id: number
  left: number
  dx: number
  duration: number
  delay: number
}

export interface AmbientFieldProps {
  theme: ThemeKey
  /** Rising particles are the announcement-phase motif; reveal uses DriftField instead. */
  sparks?: boolean
  /**
   * Bump this number to seed one extra, brighter particle — used as the felt
   * reward when a visitor subscribes. Purely decorative, no schema involved.
   */
  bonusStarSignal?: number
  className?: string
}

let idCounter = 0
function nextId() {
  idCounter += 1
  return idCounter
}

export default function AmbientField({ theme, sparks = true, bonusStarSignal, className = '' }: AmbientFieldProps) {
  const color = themes[theme].announce.particleColor
  const Glyph = particleGlyphs[theme]
  const [stars, setStars] = useState<Star[]>([])
  const [sparkList, setSparkList] = useState<Spark[]>([])

  // Generated post-mount (not during SSR) so the randomised layout never
  // causes a hydration mismatch — the field is purely decorative.
  useEffect(() => {
    const count = 8 + Math.floor(Math.random() * 5) // 8-12
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(
      Array.from({ length: count }, () => ({
        id: nextId(),
        top: Math.random() * 70,
        left: Math.random() * 100,
        size: 6 + Math.random() * 4,
        lo: 0.15 + Math.random() * 0.2,
        hi: 0.6 + Math.random() * 0.4,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 4,
      }))
    )
    if (sparks) {
      const sparkCount = 4 + Math.floor(Math.random() * 3) // 4-6
      setSparkList(
        Array.from({ length: sparkCount }, () => ({
          id: nextId(),
          left: 10 + Math.random() * 80,
          dx: -30 + Math.random() * 60,
          duration: 6 + Math.random() * 4,
          delay: Math.random() * 6,
        }))
      )
    }
  }, [sparks])

  // Subscribe-reward particle: one new glyph fades in brighter, then rejoins the ambient field.
  useEffect(() => {
    if (!bonusStarSignal) return
    const bonus: Star = {
      id: nextId(),
      top: 10 + Math.random() * 40,
      left: 15 + Math.random() * 70,
      size: 11,
      lo: 0.5,
      hi: 1,
      duration: 1.4,
      delay: 0,
      bonus: true,
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars((prev) => [...prev, bonus])
  }, [bonusStarSignal])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              '--lo': s.lo,
              '--hi': s.hi,
              '--d': `${s.duration}s`,
              '--dl': `${s.delay}s`,
              animation: `twinkle var(--d) ease-in-out var(--dl) infinite`,
              opacity: s.bonus ? 1 : undefined,
              filter: s.bonus ? `drop-shadow(0 0 6px ${color})` : undefined,
            } as React.CSSProperties
          }
        >
          <Glyph size={s.size} color={color} />
        </span>
      ))}
      {sparkList.map((s) => (
        <span
          key={s.id}
          className="absolute"
          style={
            {
              bottom: 32,
              left: `${s.left}%`,
              '--dx': `${s.dx}px`,
              animation: `rise ${s.duration}s ease-out ${s.delay}s infinite`,
            } as React.CSSProperties
          }
        >
          <Glyph size={7} color={color} />
        </span>
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--lo); }
          50% { opacity: var(--hi); }
        }
      `}</style>
    </div>
  )
}
