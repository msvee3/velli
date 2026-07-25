'use client'

import type { HeroShapeProps } from './index'

/** A film reel — sprocket holes ringing a glossy disc around a hub — the `premiere` hero shape. */
export default function ReelShape({ palette, size, dim }: HeroShapeProps) {
  const holeCount = 6
  const holeRadiusPct = 32

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
      {Array.from({ length: holeCount }).map((_, i) => {
        const angle = (i / holeCount) * Math.PI * 2
        const x = 50 + holeRadiusPct * Math.cos(angle)
        const y = 50 + holeRadiusPct * Math.sin(angle)
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: '15%',
              height: '15%',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%,-50%)',
              background: 'rgba(6,6,10,0.62)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
            }}
          />
        )
      })}
      <div
        className="absolute rounded-full"
        style={{ inset: '40%', background: palette.heroRim, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}
      />
    </div>
  )
}
