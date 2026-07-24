'use client'

import { themes, type ThemeKey } from '@/lib/themes'

export interface OrbPulseProps {
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
 * The heartbeat-pulsing orb at the centre of every celebration surface —
 * the announcement page, the reveal, the sign-in screen, and the live
 * builder preview all share this one component.
 *
 * Lit as an actual sphere rather than a flat disc: an ambient bloom behind it,
 * a specular highlight up-left, a rim light catching the lower-right edge, and
 * an inner shadow along the bottom. All six layers scale together under the
 * heartbeat so the lighting stays welded to the form.
 */
export default function OrbPulse({
  theme,
  phase = 'announce',
  birthOrder = 1,
  size = 220,
  dim = false,
  className = '',
}: OrbPulseProps) {
  const palette = themes[theme][phase]
  const isFirst = birthOrder <= 1
  const heartbeatDuration = dim ? '1.8s' : '1.1s'

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
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
        style={{
          borderColor: palette.ringColor,
          animation: 'ring-pulse 2.4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-0 rounded-full border"
        style={{
          borderColor: palette.ringColor,
          animation: 'ring-pulse 2.4s ease-in-out infinite 0.3s',
        }}
      />

      {/* Orb body. Children ride the same heartbeat so highlights stay put. */}
      <div
        className="absolute inset-[8%] overflow-hidden rounded-full"
        style={{
          background: palette.orbGradient,
          filter: dim ? 'brightness(0.55) saturate(0.7)' : undefined,
          boxShadow: dim
            ? undefined
            : [
                `inset 0 ${-size * 0.07}px ${size * 0.14}px rgba(0,0,0,0.45)`,
                `inset 0 ${size * 0.015}px ${size * 0.03}px ${palette.orbRim}`,
                `0 0 ${size * 0.3}px ${size * 0.04}px ${palette.glow}`,
              ].join(', '),
          animation: isFirst
            ? `ignition 2.2s cubic-bezier(0.16,1,0.3,1) both, heartbeat ${heartbeatDuration} ease-in-out 2.2s infinite`
            : `heartbeat ${heartbeatDuration} ease-in-out infinite`,
        }}
      >
        {/* Specular highlight — the light source, up and to the left. */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.14) 16%, transparent 44%)',
          }}
        />
        {/* Rim light — bounce catching the far lower edge, sells the curvature. */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 74% 80%, ${palette.orbRim} 0%, transparent 34%)`,
            opacity: 0.55,
          }}
        />
      </div>
    </div>
  )
}
