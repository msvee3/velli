'use client'

import type { HeroShapeProps } from './index'

/** A brass compass with a two-tone needle — the `trailhead` hero shape. */
export default function CompassShape({ palette, size, dim }: HeroShapeProps) {
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
      <div className="absolute rounded-full border" style={{ inset: '10%', borderColor: 'rgba(255,255,255,0.28)' }} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <div
          key={angle}
          className="absolute left-1/2 top-1/2"
          style={{
            width: 2,
            height: '10%',
            marginLeft: -1,
            background: 'rgba(255,255,255,0.35)',
            transformOrigin: '50% 0%',
            transform: `rotate(${angle}deg) translateY(-${size * 0.4}px)`,
          }}
        />
      ))}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: 0,
          height: 0,
          transform: 'translate(-50%,-100%)',
          borderLeft: `${size * 0.05}px solid transparent`,
          borderRight: `${size * 0.05}px solid transparent`,
          borderBottom: `${size * 0.28}px solid ${palette.accent}`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          width: 0,
          height: 0,
          transform: 'translate(-50%,0%)',
          borderLeft: `${size * 0.05}px solid transparent`,
          borderRight: `${size * 0.05}px solid transparent`,
          borderTop: `${size * 0.28}px solid rgba(255,255,255,0.55)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{ inset: '46%', background: 'rgba(10,10,10,0.55)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}
      />
    </div>
  )
}
