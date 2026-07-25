'use client'

import type { HeroShapeProps } from './index'
import MaskedShape from './MaskedShape'
import { circleSub } from './svg'

// Body 24..76 with four pins per edge reaching out to 10/90. Pins on all four
// sides (the old version had only top and bottom, which read as a plain
// rounded rectangle once scaled down).
const PIN_OFFSETS = [30, 42.5, 55, 67.5]
const PIN_LEN = 14
const PIN_W = 6.5

const pins = PIN_OFFSETS.flatMap((o) => [
  `M${o} ${24 - PIN_LEN}h${PIN_W}v${PIN_LEN}h${-PIN_W}Z`, // top
  `M${o} 76h${PIN_W}v${PIN_LEN}h${-PIN_W}Z`, // bottom
  `M${24 - PIN_LEN} ${o}h${PIN_LEN}v${PIN_W}h${-PIN_LEN}Z`, // left
  `M76 ${o}h${PIN_LEN}v${PIN_W}h${-PIN_LEN}Z`, // right
]).join('')

const BODY = 'M30 24h40a6 6 0 0 1 6 6v40a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V30a6 6 0 0 1 6-6Z'
// Orientation notch, the way a real IC is keyed.
const NOTCH = circleSub(33, 33, 4)

export default function ChipShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <MaskedShape path={`${BODY}${pins}${NOTCH}`} palette={palette} size={size} dim={dim}>
      {/* Die at the centre, lit like an active core. */}
      <div
        className="absolute rounded-[3px]"
        style={{
          inset: '38%',
          background: `radial-gradient(circle, #ffffff 0%, ${palette.accent} 55%, transparent 100%)`,
          boxShadow: `0 0 ${Math.max(3, size * 0.09)}px ${palette.accent}`,
          opacity: 0.9,
        }}
      />
    </MaskedShape>
  )
}
