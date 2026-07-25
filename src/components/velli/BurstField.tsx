'use client'

import { useEffect, useRef } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'
import { particleGlyphs } from './particles'

export interface BurstFieldProps {
  theme: ThemeKey
  /** 18 for a first child, 12 otherwise (spec's default). */
  count?: number
  onComplete?: () => void
  /** Revisits land here directly — particles render already-landed, no motion. */
  settled?: boolean
}

const GLYPH_SIZE = 14

const burstAngleRadius = (i: number, count: number) => ({
  angle: (i / count) * 360,
  radius: 46 + ((i * 37) % 14), // deterministic spread — matches the animated version's range without Math.random (keeps settled/animated renders visually consistent)
})

/**
 * `count` glyphs bloom outward from the hero shape's centre on reveal.
 * Web Animations API per the build spec — no animation library.
 */
export default function BurstField({ theme, count = 12, onComplete, settled = false }: BurstFieldProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const colors = themes[theme].reveal.burstColors
  const Glyph = particleGlyphs[theme]

  useEffect(() => {
    if (settled) return
    const totalDuration = 50 + (count - 1) * 38 + 950

    for (let i = 0; i < count; i++) {
      const item = itemRefs.current[i]
      if (!item) continue
      const { angle, radius } = burstAngleRadius(i, count)
      item.animate(
        [
          { transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg) scale(0)`, opacity: 0 },
          {
            transform: `translateX(-50%) translateY(calc(-100% - ${radius}px)) rotate(${angle}deg) scale(1)`,
            opacity: 0.9,
          },
        ],
        { duration: 950, delay: 50 + i * 38, fill: 'forwards', easing: 'cubic-bezier(0.15, 0.85, 0.25, 1)' }
      )
    }

    if (onComplete) {
      const t = setTimeout(onComplete, totalDuration)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, theme, settled])

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const { angle, radius } = burstAngleRadius(i, count)
        return (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className="absolute left-0 top-0"
            style={
              settled
                ? {
                    width: GLYPH_SIZE,
                    height: GLYPH_SIZE,
                    opacity: 0.9,
                    transform: `translateX(-50%) translateY(calc(-100% - ${radius}px)) rotate(${angle}deg) scale(1)`,
                  }
                : { width: GLYPH_SIZE, height: GLYPH_SIZE, opacity: 0 }
            }
          >
            <Glyph size={GLYPH_SIZE} color={colors[i % colors.length]} />
          </div>
        )
      })}
    </div>
  )
}
