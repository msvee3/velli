'use client'

import { useEffect, useState } from 'react'
import { themes } from '@/lib/themes'
import type { Page } from '@/types'
import OrbPulse from './OrbPulse'
import StarField from './StarField'
import PetalBurst from './PetalBurst'
import ConfettiDrift from './ConfettiDrift'
import TickerBand from './TickerBand'

// Offsets are relative to RevealPhase's own mount, which RevealTrigger times
// to land at absolute t=600ms in the spec's timeline (right as the flash
// peaks) — so these numbers are the spec's absolute times minus 600ms.
const PETALS_AT = 300 // spec: bloom starts 900ms
const CONFETTI_AT = 600 // spec: confetti starts 1200ms
const NAME_AT = 1300 // spec: name starts 1900ms
const STATS_AT = 2600 // spec: stats/credits start 3200ms

const ORB_SIZE = 176

export interface RevealPhaseProps {
  page: Page
  /** Revisits (localStorage flag already set) land directly on the end state — no replay. */
  skipToEnd?: boolean
}

export default function RevealPhase({ page, skipToEnd = false }: RevealPhaseProps) {
  const [showPetals, setShowPetals] = useState(skipToEnd)
  const [showConfetti, setShowConfetti] = useState(skipToEnd)
  const [showName, setShowName] = useState(skipToEnd)
  const [showStats, setShowStats] = useState(skipToEnd)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    // window.location is unavailable during SSR — filled in post-hydration
    // so the WhatsApp share link never needs a client-only render branch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShareUrl(window.location.href)
  }, [])

  useEffect(() => {
    if (skipToEnd) return
    const timers = [
      setTimeout(() => setShowPetals(true), PETALS_AT),
      setTimeout(() => setShowConfetti(true), CONFETTI_AT),
      setTimeout(() => setShowName(true), NAME_AT),
      setTimeout(() => setShowStats(true), STATS_AT),
    ]
    return () => timers.forEach(clearTimeout)
  }, [skipToEnd])

  const palette = themes[page.theme].reveal
  const { reveal, announcement } = page
  const petalCount = announcement.birthOrder === 1 ? 18 : 12
  const babyName = reveal.babyName ?? ''

  const namedSiblings = announcement.siblings.map((s) => s.name).filter(Boolean)
  const siblingLine = namedSiblings.length > 0 ? `with ${namedSiblings.join(' & ')}` : null
  const { fatherName, motherName } = announcement
  const hasParents = Boolean(fatherName && motherName)
  const credit = siblingLine ? `${announcement.coupleName}, ${siblingLine}` : announcement.coupleName

  const stats = [
    // Stored as UTC midnight (see RevealForm), so format in UTC too — otherwise
    // viewers west of UTC would see the birthday shifted a day earlier.
    reveal.dateOfBirth ? new Date(reveal.dateOfBirth).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : null,
    reveal.timeOfBirth,
    reveal.weight,
    reveal.height,
  ].filter(Boolean) as string[]

  const shareText = encodeURIComponent(
    `${babyName ? `${babyName} has` : 'The baby has'} arrived! See the reveal: ${shareUrl}`
  )

  return (
    <div
      className="grain relative flex h-full w-full flex-col items-center overflow-hidden"
      style={{ background: palette.pageBg }}
    >
      <StarField theme={page.theme} sparks={false} />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: palette.vignette }}
        aria-hidden="true"
      />
      {showConfetti && <ConfettiDrift theme={page.theme} />}

      <div className="relative z-10 flex w-full max-w-[390px] flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
        <div className="flex items-center gap-3">
          <span
            className="h-px w-8"
            style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}66)` }}
          />
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: palette.text.tag }}>
            {babyName ? 'Has arrived' : 'The baby has arrived'}
          </p>
          <span
            className="h-px w-8"
            style={{ background: `linear-gradient(90deg, ${palette.accent}66, transparent)` }}
          />
        </div>

        <div className="relative mt-6" style={{ width: ORB_SIZE, height: ORB_SIZE }}>
          <OrbPulse theme={page.theme} phase="reveal" birthOrder={announcement.birthOrder} size={ORB_SIZE} />
          {showPetals && <PetalBurst theme={page.theme} count={petalCount} settled={skipToEnd} />}
        </div>

        {babyName && (
          <h1
            className="gradient-text mt-6 text-[clamp(1.75rem,7.5vw,2.6rem)] font-[family-name:var(--font-celebration)] font-semibold leading-tight tracking-[-0.015em]"
            style={{
              backgroundImage: palette.titleGradient,
              animation: 'shimmer 9s ease-in-out infinite',
            }}
          >
            {showName || skipToEnd ? (
              skipToEnd ? (
                babyName
              ) : (
                <NameTypewriter name={babyName} />
              )
            ) : (
              <span aria-hidden="true">&nbsp;</span>
            )}
          </h1>
        )}

        {(showStats || skipToEnd) && (
          <div className="mt-5" style={{ animation: skipToEnd ? undefined : 'fade-up 0.6s ease both' }}>
            {stats.length > 0 && (
              <p className="text-sm" style={{ color: palette.text.stat }}>
                {stats.join('  ·  ')}
              </p>
            )}
            {reveal.message && (
              <p className="mt-3 max-w-[280px] text-sm leading-relaxed" style={{ color: palette.text.stat }}>
                {reveal.message}
              </p>
            )}
            {hasParents ? (
              <div className="mt-5">
                <div className="flex items-stretch justify-center gap-6">
                  <div className="flex flex-1 flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: palette.text.tag }}>
                      Father
                    </span>
                    <span
                      className="mt-1.5 font-[family-name:var(--font-accent)] text-[0.98rem] italic tracking-[0.04em]"
                      style={{ color: palette.text.stat }}
                    >
                      {fatherName}
                    </span>
                  </div>
                  <span className="w-px self-stretch" style={{ background: `${palette.accent}33` }} aria-hidden="true" />
                  <div className="flex flex-1 flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: palette.text.tag }}>
                      Mother
                    </span>
                    <span
                      className="mt-1.5 font-[family-name:var(--font-accent)] text-[0.98rem] italic tracking-[0.04em]"
                      style={{ color: palette.text.stat }}
                    >
                      {motherName}
                    </span>
                  </div>
                </div>
                {siblingLine && (
                  <p className="mt-3 text-xs italic" style={{ color: palette.text.stat }}>
                    {siblingLine}
                  </p>
                )}
              </div>
            ) : (
              <p
                className="mt-5 font-[family-name:var(--font-accent)] text-[0.98rem] italic tracking-[0.04em]"
                style={{ color: palette.text.stat }}
              >
                {credit}
              </p>
            )}

            {reveal.photoUrls.length > 0 && (
              <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
                {reveal.photoUrls.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="h-32 w-32 shrink-0 snap-center rounded-xl object-cover"
                  />
                ))}
              </div>
            )}

            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full px-5 py-2.5 text-xs transition"
              style={{ background: palette.btn.bg, border: `1px solid ${palette.btn.border}`, color: palette.btn.text }}
            >
              Share the news
            </a>
          </div>
        )}
      </div>

      <TickerBand theme={page.theme} phase="reveal" pageId={page.id} />
    </div>
  )
}

function NameTypewriter({ name }: { name: string }) {
  const delayStep = Math.min(70, 1200 / Math.max(name.length, 1))
  return (
    <>
      {name.split('').map((ch, i) => (
        <span
          key={i}
          className="inline-block"
          style={{ animation: `letter-in 0.35s ease ${(i * delayStep).toFixed(0)}ms both` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  )
}
