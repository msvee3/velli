'use client'

import type { HeroShapeProps } from './index'
import MaskedShape from './MaskedShape'
import { circleSub } from './svg'

// Nose cone → fuselage → swept fins → nozzle, with the porthole cut clean
// through so the background reads inside it.
const BODY =
  'M50 2C58.5 13 64 27.5 64 42v22l13.5 18v11L64 84.5V88l-6 8H42l-6-8v-3.5L22.5 93V82L36 64V42C36 27.5 41.5 13 50 2Z'
const PORTHOLE = circleSub(50, 34, 8.5)

export default function RocketShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <MaskedShape path={`${BODY}${PORTHOLE}`} palette={palette} size={size} dim={dim}>
      {/* Glass, inset inside the cut-out so a hairline of background reads as a bezel. */}
      <div
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '34%',
          width: '13%',
          height: '13%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${palette.heroRim} 45%, ${palette.accent} 100%)`,
          boxShadow: `0 0 ${Math.max(2, size * 0.06)}px ${palette.accent}`,
        }}
      />
    </MaskedShape>
  )
}
