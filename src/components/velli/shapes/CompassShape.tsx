'use client'

import type { HeroShapeProps } from './index'
import MaskedShape from './MaskedShape'
import { circleSub } from './svg'

// Outer case with four cardinal lugs, and the dial punched out so the needle
// sits in open air rather than on a flat plate.
const LUGS = 'M46 0h8v10h-8ZM46 90h8v10h-8ZM0 46h10v8H0ZM90 46h10v8h-10Z'
const PATH = `${circleSub(50, 50, 46)}${LUGS}${circleSub(50, 50, 34)}`

export default function CompassShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <MaskedShape path={PATH} palette={palette} size={size} dim={dim}>
      {/* North half, then south half — the classic two-tone needle. */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: 0,
          height: 0,
          transform: 'translate(-50%, -100%)',
          borderLeft: `${size * 0.055}px solid transparent`,
          borderRight: `${size * 0.055}px solid transparent`,
          borderBottom: `${size * 0.27}px solid ${palette.accent}`,
          filter: `drop-shadow(0 0 ${Math.max(2, size * 0.04)}px ${palette.accent})`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: 0,
          height: 0,
          transform: 'translate(-50%, 0)',
          borderLeft: `${size * 0.055}px solid transparent`,
          borderRight: `${size * 0.055}px solid transparent`,
          borderTop: `${size * 0.27}px solid rgba(255,255,255,0.62)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          width: size * 0.07,
          height: size * 0.07,
          transform: 'translate(-50%, -50%)',
          background: palette.heroRim,
        }}
      />
    </MaskedShape>
  )
}
