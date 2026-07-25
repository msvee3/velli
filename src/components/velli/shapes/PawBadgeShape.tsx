'use client'

import type { HeroShapeProps } from './index'

const TOES: Array<[dx: number, dy: number, scale: number]> = [
  [-0.16, -0.16, 0.8],
  [-0.055, -0.22, 0.92],
  [0.055, -0.22, 0.92],
  [0.16, -0.16, 0.8],
]

/** A round badge stamped with a paw print — playful chase energy — the `pounce` hero shape. */
export default function PawBadgeShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <div className="relative h-full w-full" style={{ filter: dim ? 'brightness(0.55) saturate(0.7)' : undefined }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: palette.heroGradient,
          boxShadow: dim ? undefined : `0 0 ${size * 0.3}px ${size * 0.04}px ${palette.glow}`,
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.12) 18%, transparent 46%)',
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle at 74% 80%, ${palette.heroRim} 0%, transparent 34%)`, opacity: 0.5 }}
      />
      {/* main pad */}
      <div
        className="absolute rounded-[45%]"
        style={{
          left: '50%',
          top: '60%',
          width: '32%',
          height: '26%',
          transform: 'translate(-50%,-50%)',
          background: 'rgba(10,10,16,0.55)',
        }}
      />
      {/* toes */}
      {TOES.map(([dx, dy, scale], i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${50 + dx * 100}%`,
            top: `${42 + dy * 100}%`,
            width: `${13 * scale}%`,
            height: `${13 * scale}%`,
            transform: 'translate(-50%,-50%)',
            background: 'rgba(10,10,16,0.55)',
          }}
        />
      ))}
    </div>
  )
}
