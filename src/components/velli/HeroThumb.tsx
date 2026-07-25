'use client'

import { themes, type ThemeKey } from '@/lib/themes'
import { heroShapes } from './shapes'

export interface HeroThumbProps {
  theme: ThemeKey
  phase?: 'announce' | 'reveal'
  size?: number
  /** Unlit state for the zero-pages empty state — barely pulses, low brightness. */
  dormant?: boolean
  className?: string
}

/**
 * A small, low-amplitude reuse of HeroStage's heartbeat keyframe — cheap
 * enough to render many at once (PageCard grid, theme swatches) while still
 * reading as "alive" and showing the theme's real hero silhouette rather
 * than a flat colour chip.
 */
export default function HeroThumb({ theme, phase = 'announce', size = 48, dormant = false, className = '' }: HeroThumbProps) {
  const palette = themes[theme][phase]
  const Shape = heroShapes[theme]

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        animation: dormant ? 'heartbeat 3.4s ease-in-out infinite' : 'heartbeat 1.1s ease-in-out infinite',
      }}
      aria-hidden="true"
    >
      <Shape palette={palette} size={size} dim={dormant} />
    </div>
  )
}
