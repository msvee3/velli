'use client'

import type { HeroShapeProps } from './index'

/** A gear — radiating teeth around a metallic hub with a bored center — the `forge` hero shape. */
export default function GearShape({ palette, size, dim }: HeroShapeProps) {
  const teeth = 10

  return (
    <div className="relative h-full w-full" style={{ filter: dim ? 'brightness(0.55) saturate(0.7)' : undefined }}>
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i / teeth) * 360
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 rounded-sm"
            style={{
              width: '13%',
              height: '17%',
              marginLeft: '-6.5%',
              marginTop: '-8.5%',
              background: palette.heroGradient,
              transform: `rotate(${angle}deg) translateY(-${size * 0.4}px)`,
            }}
          />
        )
      })}
      <div
        className="absolute rounded-full"
        style={{
          inset: '14%',
          background: palette.heroGradient,
          boxShadow: dim ? undefined : `0 0 ${size * 0.28}px ${size * 0.04}px ${palette.glow}`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: '14%',
          background:
            'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.12) 18%, transparent 46%)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{ inset: '40%', background: 'rgba(8,8,9,0.6)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
      />
    </div>
  )
}
