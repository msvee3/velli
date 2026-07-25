'use client'

import type { HeroShapeProps } from './index'

/** A vinyl record — concentric grooves, a gleaming label, and a spindle hole — the `encore` hero shape. */
export default function RecordShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-full"
      style={{ filter: dim ? 'brightness(0.55) saturate(0.7)' : undefined }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: palette.heroGradient,
          boxShadow: dim ? undefined : `0 0 ${size * 0.3}px ${size * 0.04}px ${palette.glow}`,
        }}
      />
      {[14, 24, 34, 44].map((inset) => (
        <div
          key={inset}
          className="absolute rounded-full border"
          style={{ inset: `${inset}%`, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }}
        />
      ))}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 18%, transparent 46%)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: '36%',
          background: `radial-gradient(circle at 35% 30%, ${palette.heroRim} 0%, ${palette.accent} 60%, ${palette.heroRim} 100%)`,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.35)',
        }}
      />
      <div className="absolute rounded-full" style={{ inset: '47%', background: 'rgba(5,5,8,0.75)' }} />
    </div>
  )
}
