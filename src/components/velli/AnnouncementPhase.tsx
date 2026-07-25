'use client'

import { useState } from 'react'
import { themes, ordinalTag, type ThemeKey } from '@/lib/themes'
import { themeFontClassName } from '@/lib/theme-fonts'
import type { PageAnnouncement, TickerMessage } from '@/types'
import HeroStage from './HeroStage'
import AmbientField from './AmbientField'
import RoyalFrame from './RoyalFrame'
import SiblingOrbit from './SiblingOrbit'
import { CountdownRing, CountdownDigits } from './Countdown'
import TickerBand from './TickerBand'
import SubscribeForm from './SubscribeForm'

export interface AnnouncementPhaseProps {
  pageId: string
  theme: ThemeKey
  announcement: PageAnnouncement
  /** Builder-preview mode — real components, but no network calls. */
  preview?: boolean
  previewMessages?: TickerMessage[]
  /**
   * When provided, title/couple-name/message render as live inputs typed
   * directly over the preview typography instead of static text — the
   * PageBuilder's "the creation is the artifact" trick.
   */
  onEditField?: (patch: Partial<PageAnnouncement>) => void
}

const HERO_SIZE = 196

export default function AnnouncementPhase({
  pageId,
  theme,
  announcement,
  preview = false,
  previewMessages = [],
  onEditField,
}: AnnouncementPhaseProps) {
  const palette = themes[theme].announce
  const [bonusStarSignal, setBonusStarSignal] = useState(0)
  const tag = announcement.tagline || ordinalTag(announcement.birthOrder)
  const editable = Boolean(onEditField)

  return (
    <div
      className={`grain relative flex h-full w-full flex-col items-center overflow-hidden ${themeFontClassName(theme)}`}
      style={{ background: palette.pageBg, transition: 'background 0.6s ease' }}
    >
      <AmbientField theme={theme} bonusStarSignal={bonusStarSignal} />

      {/* Edge falloff — keeps the eye on the hero and hides gradient seams. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: palette.vignette, transition: 'background 0.6s ease' }}
        aria-hidden="true"
      />

      <RoyalFrame theme={theme} phase="announce" />

      {/*
       * Three zones spread across the full height rather than one centred
       * block — that's what closes the dead space above and below the hero.
       * `containerType` makes the display type size off this column's own
       * width (cqi), so it's identical in the 390px builder preview and on a
       * real phone; the old vw-based clamp sized off the browser viewport and
       * overflowed inside the preview pane.
       */}
      <div
        className="relative z-10 flex w-full max-w-[390px] flex-1 flex-col items-center justify-between px-7 pb-16 pt-9 text-center"
        style={{ containerType: 'inline-size' }}
      >
        {/* ── Crest: tagline flanked by drawn rules and gems ───────────── */}
        <header className="flex w-full flex-col items-center">
          <div className="flex w-full items-center justify-center gap-2.5">
            <span
              className="h-px flex-1 origin-right"
              style={{
                background: `linear-gradient(90deg, transparent, ${palette.accent}80)`,
                animation: 'rule-extend 1.1s cubic-bezier(0.16,1,0.3,1) both',
              }}
            />
            <span
              className="shrink-0 rotate-45"
              style={{ width: 4, height: 4, background: palette.accent, boxShadow: `0 0 6px ${palette.accent}` }}
              aria-hidden="true"
            />
            <p
              className="shrink-0 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em]"
              style={{ color: palette.text.tag }}
            >
              {tag}
            </p>
            <span
              className="shrink-0 rotate-45"
              style={{ width: 4, height: 4, background: palette.accent, boxShadow: `0 0 6px ${palette.accent}` }}
              aria-hidden="true"
            />
            <span
              className="h-px flex-1 origin-left"
              style={{
                background: `linear-gradient(90deg, ${palette.accent}80, transparent)`,
                animation: 'rule-extend 1.1s cubic-bezier(0.16,1,0.3,1) both',
              }}
            />
          </div>
        </header>

        {/* ── Hero + headline ─────────────────────────────────────────── */}
        <main className="flex w-full flex-col items-center">
          <div className="relative" style={{ width: HERO_SIZE, height: HERO_SIZE }}>
            {/* Spotlight so the hero reads as lit from the frame, not pasted on. */}
            <div
              className="pointer-events-none absolute rounded-full"
              style={{
                inset: '-46%',
                background: `radial-gradient(circle, ${palette.glow} 0%, transparent 66%)`,
                opacity: 0.5,
                filter: 'blur(26px)',
              }}
              aria-hidden="true"
            />
            <CountdownRing dueDate={announcement.dueDate} theme={theme} size={HERO_SIZE} />
            <HeroStage theme={theme} phase="announce" birthOrder={announcement.birthOrder} size={HERO_SIZE} />
            {announcement.birthOrder > 1 && (
              <SiblingOrbit siblings={announcement.siblings} theme={theme} size={HERO_SIZE} />
            )}
          </div>

          <div className="mt-7">
            <CountdownDigits dueDate={announcement.dueDate} theme={theme} />
          </div>

          {editable ? (
            <input
              value={announcement.title}
              onChange={(e) => onEditField!({ title: e.target.value })}
              placeholder="Our baby is coming"
              maxLength={100}
              className="mt-6 w-full bg-transparent text-center text-[clamp(1.3rem,7.6cqi,2.05rem)] font-[family-name:var(--font-celebration)] font-semibold uppercase leading-[1.12] tracking-[0.02em] outline-none placeholder:opacity-35"
              style={{ color: palette.text.title, caretColor: palette.accent }}
            />
          ) : (
            <h1
              className="gradient-text mt-6 w-full text-balance break-words text-[clamp(1.3rem,7.6cqi,2.05rem)] font-[family-name:var(--font-celebration)] font-semibold uppercase leading-[1.12] tracking-[0.02em]"
              style={{
                backgroundImage: palette.titleGradient,
                animation: 'shimmer 9s ease-in-out infinite',
              }}
            >
              {announcement.title || 'Our baby is coming'}
            </h1>
          )}

          {/* Ornamental rule between headline and the couple's name. */}
          <div className="mt-4 flex items-center gap-2" aria-hidden="true">
            <span className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}66)` }} />
            <span
              className="rotate-45"
              style={{ width: 3, height: 3, background: palette.accent, opacity: 0.8 }}
            />
            <span className="h-px w-10" style={{ background: `linear-gradient(90deg, ${palette.accent}66, transparent)` }} />
          </div>

          {editable ? (
            <input
              value={announcement.coupleName}
              onChange={(e) => onEditField!({ coupleName: e.target.value })}
              placeholder="Someone special"
              maxLength={80}
              className="mt-3 w-full bg-transparent text-center font-[family-name:var(--font-accent)] text-[1.05rem] tracking-[0.06em] outline-none placeholder:opacity-35"
              style={{ color: palette.text.couple, fontStyle: themes[theme].accentFontStyle }}
            />
          ) : (
            <p
              className="mt-3 font-[family-name:var(--font-accent)] text-[1.05rem] tracking-[0.06em]"
              style={{ color: palette.text.couple, fontStyle: themes[theme].accentFontStyle }}
            >
              {announcement.coupleName || 'Someone special'}
            </p>
          )}

          {editable ? (
            <textarea
              value={announcement.message}
              onChange={(e) => onEditField!({ message: e.target.value })}
              placeholder="A note to whoever finds this page"
              maxLength={500}
              rows={2}
              className="mt-4 w-full max-w-[290px] resize-none bg-transparent text-center text-[0.9rem] leading-[1.75] outline-none placeholder:opacity-35"
              style={{ color: palette.text.couple }}
            />
          ) : (
            announcement.message && (
              <p
                className="mt-4 max-w-[290px] text-[0.9rem] leading-[1.75]"
                style={{ color: palette.text.couple }}
              >
                {announcement.message}
              </p>
            )
          )}
        </main>

        {/* ── Subscribe ───────────────────────────────────────────────── */}
        <footer className="flex w-full flex-col items-center">
          <SubscribeForm
            pageId={pageId}
            theme={theme}
            preview={preview}
            onSubscribed={() => setBonusStarSignal((n) => n + 1)}
          />
        </footer>
      </div>

      <TickerBand
        theme={theme}
        phase="announce"
        pageId={preview ? undefined : pageId}
        messages={preview ? previewMessages : undefined}
      />
    </div>
  )
}
