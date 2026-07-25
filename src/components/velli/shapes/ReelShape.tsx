'use client'

import type { HeroShapeProps } from './index'
import MaskedShape from './MaskedShape'
import { circleSub } from './svg'

// Five big spoke windows plus a centre bore, all punched through the disc so
// the background reads inside them — that's what makes it a reel rather than
// the dotted disc the old version rendered at swatch size.
const HOLES = Array.from({ length: 5 }, (_, i) => {
  const a = (i / 5) * Math.PI * 2 - Math.PI / 2
  return circleSub(50 + 27 * Math.cos(a), 50 + 27 * Math.sin(a), 12.5)
}).join('')

const PATH = `${circleSub(50, 50, 48)}${HOLES}${circleSub(50, 50, 8)}`

export default function ReelShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <MaskedShape path={PATH} palette={palette} size={size} dim={dim}>
      {/* Outer flange, so the rim catches light like a metal reel. */}
      <div
        className="absolute rounded-full border"
        style={{ inset: '1%', borderColor: `${palette.accent}59` }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: '44%',
          background: palette.accent,
          boxShadow: `0 0 ${Math.max(2, size * 0.05)}px ${palette.accent}`,
        }}
      />
    </MaskedShape>
  )
}
