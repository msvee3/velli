'use client'

import type { HeroShapeProps } from './index'
import MaskedShape from './MaskedShape'
import { circleSub, gearSub } from './svg'

// One continuous cog outline rather than ten separately-positioned tooth divs
// — the old approach left visible seams where each tooth met the hub.
const PATH = `${gearSub(50, 50, 10, 36, 48)}${circleSub(50, 50, 13)}`

export default function GearShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <MaskedShape path={PATH} palette={palette} size={size} dim={dim}>
      {/* Machined ring around the bore. */}
      <div
        className="absolute rounded-full border-2"
        style={{ inset: '30%', borderColor: `${palette.heroRim}4d` }}
      />
    </MaskedShape>
  )
}
