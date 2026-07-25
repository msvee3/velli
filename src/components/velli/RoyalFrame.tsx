'use client'

import type { CSSProperties } from 'react'
import { themes, type ThemeKey } from '@/lib/themes'

export interface RoyalFrameProps {
  theme: ThemeKey
  phase?: 'announce' | 'reveal'
}

const INSET = 14
const ARM = 34

/**
 * The regal/futuristic chrome that wraps every celebration surface: a tech
 * grid, corner brackets with gem vertices, edge rails, and a slow scanline
 * sweep.
 *
 * Purely decorative and entirely palette-driven — it reads from `accent`
 * alone, so all seven themes inherit it without any per-theme code. This is
 * what fills the dead space the old centred layout left at the top and
 * bottom of the frame.
 */
export default function RoyalFrame({ theme, phase = 'announce' }: RoyalFrameProps) {
  const { accent } = themes[theme][phase]

  const corners: Array<{ key: string; bracket: CSSProperties; gem: CSSProperties }> = [
    {
      key: 'tl',
      bracket: { top: INSET, left: INSET, borderTop: `1.5px solid ${accent}`, borderLeft: `1.5px solid ${accent}` },
      gem: { top: INSET - 3, left: INSET - 3 },
    },
    {
      key: 'tr',
      bracket: { top: INSET, right: INSET, borderTop: `1.5px solid ${accent}`, borderRight: `1.5px solid ${accent}` },
      gem: { top: INSET - 3, right: INSET - 3 },
    },
    {
      key: 'bl',
      bracket: {
        bottom: INSET,
        left: INSET,
        borderBottom: `1.5px solid ${accent}`,
        borderLeft: `1.5px solid ${accent}`,
      },
      gem: { bottom: INSET - 3, left: INSET - 3 },
    },
    {
      key: 'br',
      bracket: {
        bottom: INSET,
        right: INSET,
        borderBottom: `1.5px solid ${accent}`,
        borderRight: `1.5px solid ${accent}`,
      },
      gem: { bottom: INSET - 3, right: INSET - 3 },
    },
  ]

  const railGradient = `linear-gradient(180deg, transparent, ${accent}59 22%, ${accent}59 78%, transparent)`

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
      {/* Tech grid — faint, keeps the void from reading as empty. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 43px, ${accent}0d 43px 44px), repeating-linear-gradient(90deg, transparent 0 43px, ${accent}0d 43px 44px)`,
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 18%, #000 92%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 18%, #000 92%)',
          opacity: 0.75,
        }}
      />

      {/* Slow scanline sweep — the futurist tell. */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: '30%',
          background: `linear-gradient(180deg, transparent, ${accent}0f 45%, ${accent}1f 50%, ${accent}0f 55%, transparent)`,
          animation: 'scan-sweep 11s linear infinite',
        }}
      />

      {/* Vertical edge rails. */}
      <div className="absolute bottom-[7%] top-[7%]" style={{ left: INSET, width: 1, background: railGradient }} />
      <div className="absolute bottom-[7%] top-[7%]" style={{ right: INSET, width: 1, background: railGradient }} />

      {/* Corner brackets + gem vertices. */}
      {corners.map(({ key, bracket, gem }) => (
        <div key={key}>
          <div className="absolute" style={{ width: ARM, height: ARM, opacity: 0.85, ...bracket }} />
          <div
            className="absolute"
            style={{
              width: 6,
              height: 6,
              background: accent,
              transform: 'rotate(45deg)',
              boxShadow: `0 0 8px 1px ${accent}`,
              animation: 'gem-glint 3.8s ease-in-out infinite',
              ...gem,
            }}
          />
        </div>
      ))}
    </div>
  )
}
