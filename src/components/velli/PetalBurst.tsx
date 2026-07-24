'use client'

import { useEffect, useRef } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'

export interface PetalBurstProps {
  theme: ThemeKey
  /** 18 for a first child, 12 otherwise (spec's default). */
  count?: number
  onComplete?: () => void
  /** Revisits land here directly — petals render already-landed, no motion. */
  settled?: boolean
}

const petalAngleRadius = (i: number, count: number) => ({
  angle: (i / count) * 360,
  radius: 46 + ((i * 37) % 14), // deterministic spread — matches the animated version's range without Math.random (keeps settled/animated renders visually consistent)
})

/**
 * 12 (or 18, for a first child) petals bloom outward from the orb centre.
 * Web Animations API per the build spec — no animation library.
 */
export default function PetalBurst({ theme, count = 12, onComplete, settled = false }: PetalBurstProps) {
  const petalRefs = useRef<(HTMLDivElement | null)[]>([])
  const colors = themes[theme].reveal.petalColors

  useEffect(() => {
    if (settled) return
    const totalDuration = 50 + (count - 1) * 38 + 950

    for (let i = 0; i < count; i++) {
      const petal = petalRefs.current[i]
      if (!petal) continue
      const { angle, radius } = petalAngleRadius(i, count)
      petal.animate(
        [
          { transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg) scaleY(0)`, opacity: 0 },
          {
            transform: `translateX(-50%) translateY(calc(-100% - ${radius}px)) rotate(${angle}deg) scaleY(1)`,
            opacity: 0.88,
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
        const { angle, radius } = petalAngleRadius(i, count)
        return (
          <div
            key={i}
            ref={(el) => {
              petalRefs.current[i] = el
            }}
            className="absolute left-0 top-0 rounded-full"
            style={
              settled
                ? {
                    width: 9,
                    height: 20,
                    background: colors[i % colors.length],
                    opacity: 0.88,
                    transform: `translateX(-50%) translateY(calc(-100% - ${radius}px)) rotate(${angle}deg) scaleY(1)`,
                  }
                : { width: 9, height: 20, background: colors[i % colors.length], opacity: 0 }
            }
          />
        )
      })}
    </div>
  )
}
