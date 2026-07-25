'use client'

import type { HeroShapeProps } from './index'
import MaskedShape from './MaskedShape'
import { circleSub } from './svg'

const PATH = `${circleSub(50, 50, 48)}${circleSub(50, 50, 5)}`

/** A vinyl record — grooves, a lit label, and a punched spindle hole. */
export default function RecordShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <MaskedShape path={PATH} palette={palette} size={size} dim={dim}>
      {/* Grooves. Kept light-on-dark so they survive the swatch size. */}
      {[13, 21, 29].map((inset) => (
        <div
          key={inset}
          className="absolute rounded-full border"
          style={{ inset: `${inset}%`, borderColor: `${palette.heroRim}38` }}
        />
      ))}
      {/* Centre label. */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '36%',
          background: `radial-gradient(circle at 34% 28%, ${palette.heroRim} 0%, ${palette.accent} 70%)`,
          boxShadow: `0 0 ${Math.max(2, size * 0.05)}px ${palette.accent}80`,
        }}
      />
      {/* Spindle hole, punched back out of the label. */}
      <div
        className="absolute rounded-full"
        style={{ inset: '46.5%', background: 'rgba(4,4,7,0.92)' }}
      />
    </MaskedShape>
  )
}
