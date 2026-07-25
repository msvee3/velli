'use client'

import { themes, type ThemeKey } from '@/lib/themes'
import type { Sibling } from '@/types'

export interface SiblingOrbitProps {
  siblings: Sibling[]
  theme: ThemeKey
  /** Should match the HeroStage size it orbits around. */
  size: number
}

/**
 * One small dot per existing child, drifting in slow orbit around the main
 * orb — the second-and-later-child counterpart to the first child's halo.
 * Each dot is counter-rotated so its name label stays upright.
 *
 * Announcement-phase only — on reveal, siblings are credited in the text
 * line alongside the parents instead (see RevealPhase).
 */
export default function SiblingOrbit({ siblings, theme, size }: SiblingOrbitProps) {
  if (siblings.length === 0) return null

  const palette = themes[theme].announce
  const orbitRadius = size * 0.66
  const duration = 22 // seconds for a full revolution

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: orbitRadius * 2,
        height: orbitRadius * 2,
        marginLeft: -orbitRadius,
        marginTop: -orbitRadius,
        animation: `orbit ${duration}s linear infinite`,
      }}
      aria-hidden="true"
    >
      {siblings.map((sibling, i) => {
        const angle = (i / siblings.length) * 360
        return (
          <div
            key={i}
            className="absolute left-1/2 top-0 flex flex-col items-center"
            style={{ transform: `rotate(${angle}deg) translateX(-50%)`, transformOrigin: `50% ${orbitRadius}px` }}
          >
            <div
              style={{ animation: `orbit ${duration}s linear infinite reverse` }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="block rounded-full"
                style={{ width: 6, height: 6, background: palette.text.tag }}
              />
              {sibling.name && (
                <span
                  className="whitespace-nowrap text-[10px] tracking-wide"
                  style={{ color: palette.text.couple }}
                >
                  {sibling.name}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
