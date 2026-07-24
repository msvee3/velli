'use client'

import { themes, type ThemeKey } from '@/lib/themes'

export interface OrbThumbProps {
  theme: ThemeKey
  phase?: 'announce' | 'reveal'
  size?: number
  /** Unlit state for the zero-pages empty state — barely pulses, low brightness. */
  dormant?: boolean
  className?: string
}

/**
 * A small, low-amplitude reuse of OrbPulse's heartbeat keyframe — cheap enough
 * to render many at once (PageCard grid, theme swatches) while still reading
 * as "alive" rather than a flat colour chip.
 */
export default function OrbThumb({ theme, phase = 'announce', size = 48, dormant = false, className = '' }: OrbThumbProps) {
  const palette = themes[theme][phase]

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: palette.orbGradient,
        filter: dormant ? 'brightness(0.35) saturate(0.5)' : undefined,
        boxShadow: dormant
          ? undefined
          : `inset 0 ${-size * 0.08}px ${size * 0.16}px rgba(0,0,0,0.45), 0 0 ${size * 0.28}px ${palette.glow}`,
        animation: dormant ? 'heartbeat 3.4s ease-in-out infinite' : 'heartbeat 1.1s ease-in-out infinite',
      }}
      aria-hidden="true"
    >
      {/* Same specular treatment as the full-size orb, so swatches read as spheres. */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.12) 18%, transparent 46%)',
        }}
      />
    </div>
  )
}
