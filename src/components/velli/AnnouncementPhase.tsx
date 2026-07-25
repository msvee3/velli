'use client'

import { useState } from 'react'
import { themes, ordinalTag, type ThemeKey } from '@/lib/themes'
import { themeFontClassName } from '@/lib/theme-fonts'
import type { PageAnnouncement, TickerMessage } from '@/types'
import HeroStage from './HeroStage'
import AmbientField from './AmbientField'
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

const ORB_SIZE = 176

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

      {/* Edge falloff — keeps the eye on the orb and hides gradient seams. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: palette.vignette, transition: 'background 0.6s ease' }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-[390px] flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
        <div className="flex items-center gap-3">
          <span
            className="h-px w-8"
            style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}66)` }}
          />
          <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: palette.text.tag }}>
            {tag}
          </p>
          <span
            className="h-px w-8"
            style={{ background: `linear-gradient(90deg, ${palette.accent}66, transparent)` }}
          />
        </div>

        <div className="relative mt-6" style={{ width: ORB_SIZE, height: ORB_SIZE }}>
          <CountdownRing dueDate={announcement.dueDate} theme={theme} size={ORB_SIZE} />
          <HeroStage theme={theme} phase="announce" birthOrder={announcement.birthOrder} size={ORB_SIZE} />
          {announcement.birthOrder > 1 && (
            <SiblingOrbit siblings={announcement.siblings} theme={theme} size={ORB_SIZE} />
          )}
        </div>

        <div className="mt-4">
          <CountdownDigits dueDate={announcement.dueDate} theme={theme} />
        </div>

        {editable ? (
          <input
            value={announcement.title}
            onChange={(e) => onEditField!({ title: e.target.value })}
            placeholder="A celebration is on the way"
            maxLength={100}
            className="mt-5 w-full bg-transparent text-center text-[clamp(1.5rem,6.5vw,2.15rem)] font-[family-name:var(--font-celebration)] font-medium tracking-[-0.01em] outline-none placeholder:opacity-40"
            style={{ color: palette.text.title, caretColor: palette.accent }}
          />
        ) : (
          <h1
            className="gradient-text mt-5 text-[clamp(1.5rem,6.5vw,2.15rem)] font-[family-name:var(--font-celebration)] font-medium leading-tight tracking-[-0.01em]"
            style={{
              backgroundImage: palette.titleGradient,
              animation: 'shimmer 9s ease-in-out infinite',
            }}
          >
            {announcement.title || 'A celebration is on the way'}
          </h1>
        )}

        {editable ? (
          <input
            value={announcement.coupleName}
            onChange={(e) => onEditField!({ coupleName: e.target.value })}
            placeholder="Someone special"
            maxLength={80}
            className="mt-2 w-full bg-transparent text-center text-sm outline-none placeholder:opacity-40"
            style={{ color: palette.text.couple }}
          />
        ) : (
          <p
            className="mt-2.5 font-[family-name:var(--font-accent)] text-[1.05rem] tracking-[0.04em]"
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
            className="mt-4 w-full max-w-[280px] resize-none bg-transparent text-center text-sm leading-relaxed outline-none placeholder:opacity-40"
            style={{ color: palette.text.couple }}
          />
        ) : (
          announcement.message && (
            <>
              <span
                className="mt-5 text-[0.6rem]"
                style={{ color: palette.accent, opacity: 0.5 }}
                aria-hidden="true"
              >
                ✦
              </span>
              <p
                className="mt-3 max-w-[290px] text-[0.9rem] leading-[1.75]"
                style={{ color: palette.text.couple }}
              >
                {announcement.message}
              </p>
            </>
          )
        )}

        <div className="mt-8">
          <SubscribeForm
            pageId={pageId}
            theme={theme}
            preview={preview}
            onSubscribed={() => setBonusStarSignal((n) => n + 1)}
          />
        </div>
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
