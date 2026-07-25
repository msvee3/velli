'use client'

import type { ReactNode } from 'react'
import type { PhaseShared } from '@/lib/themes'
import { svgMask } from './svg'

export interface MaskedShapeProps {
  /** Silhouette path in the given viewBox; inner subpaths cut holes (evenodd). */
  path: string
  viewBox?: string
  palette: PhaseShared
  size: number
  dim?: boolean
  /** Detail drawn on top of the lit body (needles, rings, traces). */
  children?: ReactNode
}

/**
 * Lights a silhouette the way the old sphere was lit — ambient bloom behind,
 * gradient body, specular up-left, rim catching the lower-right — but clipped
 * to an arbitrary SVG path instead of a circle.
 *
 * The bloom sits on its own unmasked layer because a mask clips box-shadow,
 * so the glow has to be painted rather than cast.
 */
export default function MaskedShape({ path, viewBox, palette, size, dim, children }: MaskedShapeProps) {
  const mask = svgMask(path, viewBox)

  return (
    <div
      className="relative h-full w-full"
      style={{ filter: dim ? 'brightness(0.55) saturate(0.7)' : undefined }}
    >
      {!dim && (
        <div
          className="absolute"
          style={{
            inset: '-18%',
            background: `radial-gradient(circle, ${palette.glow} 0%, transparent 62%)`,
            filter: `blur(${Math.max(3, size * 0.07)}px)`,
            opacity: 0.75,
          }}
        />
      )}

      {/* Body */}
      <div className="absolute inset-0" style={{ ...mask, background: palette.heroGradient }} />

      {/* Specular — the light source, up and to the left. */}
      <div
        className="absolute inset-0"
        style={{
          ...mask,
          background:
            'radial-gradient(circle at 33% 24%, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.16) 20%, transparent 52%)',
        }}
      />

      {/* Rim light — bounce along the far lower edge, sells the curvature. */}
      <div
        className="absolute inset-0"
        style={{
          ...mask,
          background: `radial-gradient(circle at 74% 82%, ${palette.heroRim} 0%, transparent 38%)`,
          opacity: 0.6,
        }}
      />

      {children}
    </div>
  )
}
