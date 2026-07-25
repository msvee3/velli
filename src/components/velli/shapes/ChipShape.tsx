'use client'

import type { HeroShapeProps } from './index'

/** An IC chip with edge pins and a glowing core — the `circuit` hero shape. */
export default function ChipShape({ palette, size, dim }: HeroShapeProps) {
  const pins = Array.from({ length: 5 })
  return (
    <div className="relative h-full w-full" style={{ filter: dim ? 'brightness(0.55) saturate(0.7)' : undefined }}>
      {pins.map((_, i) => (
        <div
          key={`t${i}`}
          className="absolute"
          style={{ left: `${18 + i * 16}%`, top: '-6%', width: '4%', height: '11%', background: palette.heroRim }}
        />
      ))}
      {pins.map((_, i) => (
        <div
          key={`b${i}`}
          className="absolute"
          style={{ left: `${18 + i * 16}%`, bottom: '-6%', width: '4%', height: '11%', background: palette.heroRim }}
        />
      ))}
      <div
        className="absolute rounded-2xl"
        style={{
          inset: '8%',
          background: palette.heroGradient,
          boxShadow: dim ? undefined : `0 0 ${size * 0.28}px ${size * 0.04}px ${palette.glow}`,
        }}
      />
      <div
        className="absolute rounded-2xl"
        style={{
          inset: '8%',
          background:
            'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 18%, transparent 46%)',
        }}
      />
      <div
        className="absolute rounded-md"
        style={{
          inset: '34%',
          background: `radial-gradient(circle, ${palette.accent} 0%, transparent 70%)`,
          opacity: 0.85,
        }}
      />
    </div>
  )
}
