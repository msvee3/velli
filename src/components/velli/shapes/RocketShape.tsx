'use client'

import type { HeroShapeProps } from './index'

const CLIP =
  'polygon(50% 0%, 78% 24%, 78% 70%, 97% 100%, 66% 80%, 50% 90%, 34% 80%, 3% 100%, 22% 70%, 22% 24%)'

/** A rocket fuselage, nose-up, with flared tail fins and a porthole window — the `liftoff` hero shape. */
export default function RocketShape({ palette, size, dim }: HeroShapeProps) {
  return (
    <div className="relative h-full w-full" style={{ filter: dim ? 'brightness(0.55) saturate(0.7)' : undefined }}>
      <div
        className="absolute inset-0"
        style={{
          clipPath: CLIP,
          background: palette.heroGradient,
          boxShadow: dim ? undefined : `0 0 ${size * 0.3}px ${size * 0.04}px ${palette.glow}`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: CLIP,
          background:
            'radial-gradient(circle at 38% 18%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.14) 20%, transparent 46%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: CLIP,
          background: `radial-gradient(circle at 72% 78%, ${palette.heroRim} 0%, transparent 36%)`,
          opacity: 0.55,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '34%',
          width: '22%',
          height: '22%',
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${palette.heroRim} 40%, rgba(0,0,0,0.4) 100%)`,
          border: `${Math.max(1, size * 0.015)}px solid rgba(255,255,255,0.5)`,
        }}
      />
    </div>
  )
}
