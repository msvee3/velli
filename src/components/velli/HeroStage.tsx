'use client'

import { themes, type ThemeKey } from '@/lib/themes'
import { heroShapes } from './shapes'

export interface HeroStageProps {
  theme: ThemeKey
  phase?: 'announce' | 'reveal'
  /** 1 = first child — gets the halo ring + ignition intro. 2+ gets neither. */
  birthOrder?: number
  size?: number
  /** Sealed/dimmed state used by RevealTrigger before the visitor taps. */
  dim?: boolean
  className?: string
}

/**
 * The pulsing centrepiece at the heart of every celebration surface — the
 * announcement page, the reveal, the sign-in screen, and the live builder
 * preview all share this one component.
 *
 * Shape-agnostic by design: this owns the ambient bloom, the pulsing rings,
 * the heartbeat/ignition timing, and the firstborn halo — all genuinely
 * reusable across themes — and hands off the actual silhouette (rocket,
 * vinyl record, gear, ...) to a per-theme shape component from the
 * `shapes` registry, which owns its own lighting treatment appropriate to
 * its own geometry.
 */
export default function HeroStage({
  theme,
  phase = 'announce',
  birthOrder = 1,
  size = 220,
  dim = false,
  className = '',
}: HeroStageProps) {
  const palette = themes[theme][phase]
  const isFirst = birthOrder <= 1
  const heartbeatDuration = dim ? '1.8s' : '1.1s'
  const Shape = heroShapes[theme]

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {/* Ambient bloom — sits furthest back, breathes on its own slower cycle. */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '-28%',
          background: `radial-gradient(circle, ${palette.glow} 0%, transparent 62%)`,
          filter: `blur(${size * 0.06}px)`,
          opacity: dim ? 0.25 : undefined,
          animation: dim ? undefined : 'glow-pulse 4.6s ease-in-out infinite',
        }}
      />

      {isFirst && (
        <div
          className="absolute inset-[-14%] rounded-full border"
          style={{
            borderColor: palette.ringColor,
            animation: 'halo-drift 5.2s ease-in-out infinite',
            opacity: dim ? 0.15 : undefined,
          }}
        />
      )}

      <div
        className="absolute inset-[-6%] rounded-full border"
        style={{ borderColor: palette.ringColor, animation: 'ring-pulse 2.4s ease-in-out infinite' }}
      />
      <div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: palette.ringColor, animation: 'ring-pulse 2.4s ease-in-out infinite 0.3s' }}
      />

      {/* Shape body. Rides the same heartbeat so its lighting stays welded to the form. */}
      <div
        className="absolute inset-[8%]"
        style={{
          animation: isFirst
            ? `ignition 2.2s cubic-bezier(0.16,1,0.3,1) both, heartbeat ${heartbeatDuration} ease-in-out 2.2s infinite`
            : `heartbeat ${heartbeatDuration} ease-in-out infinite`,
        }}
      >
        <Shape palette={palette} size={size * 0.84} dim={dim} />
      </div>
    </div>
  )
}
