'use client'

import { useEffect, useState } from 'react'
import { themes } from '@/lib/themes'
import type { Page } from '@/types'
import OrbPulse from './OrbPulse'
import RevealPhase from './RevealPhase'

type Stage = 'sealed' | 'flash' | 'revealed'

const AUTO_FIRE_MS = 4000
const SWAP_AT_MS = 600 // DOM swaps under the flash's peak opacity (~40% of its 500ms span, which starts at 400ms)
const PERSIST_AT_MS = 4500 // localStorage flag is set once the sequence has visibly landed

export default function RevealTrigger({ page }: { page: Page }) {
  const storageKey = `velli-bloomed-${page.id}`
  const [checked, setChecked] = useState(false)
  const [alreadyBloomed, setAlreadyBloomed] = useState(false)
  const [stage, setStage] = useState<Stage>('sealed')

  useEffect(() => {
    // localStorage is unavailable during SSR — `checked` gates rendering
    // until after this runs, so there's no sealed/bloomed flash either way.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAlreadyBloomed(typeof window !== 'undefined' && window.localStorage.getItem(storageKey) === 'true')
    setChecked(true)
  }, [storageKey])

  useEffect(() => {
    if (!checked || alreadyBloomed || stage !== 'sealed') return
    const t = setTimeout(trigger, AUTO_FIRE_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, alreadyBloomed, stage])

  function trigger() {
    setStage((s) => {
      if (s !== 'sealed') return s
      setTimeout(() => setStage('revealed'), SWAP_AT_MS)
      setTimeout(() => window.localStorage.setItem(storageKey, 'true'), PERSIST_AT_MS)
      return 'flash'
    })
  }

  if (!checked) return null // avoids a flash of the wrong state before localStorage is read

  if (alreadyBloomed) return <RevealPhase page={page} skipToEnd />

  const announcePalette = themes[page.theme].announce

  return (
    <div className="relative h-full w-full overflow-hidden">
      {stage !== 'revealed' && (
        <button
          type="button"
          onClick={trigger}
          className="flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center"
          style={{
            background: announcePalette.pageBg,
            animation: stage === 'flash' ? 'reveal-inhale 400ms ease forwards' : undefined,
          }}
        >
          <OrbPulse theme={page.theme} birthOrder={page.announcement.birthOrder} size={160} dim />
          <div>
            <p className="text-sm" style={{ color: announcePalette.text.title }}>
              Something happened.
            </p>
            <p className="mt-2 text-xs" style={{ color: announcePalette.text.countdownLabel }}>
              Tap to reveal
            </p>
          </div>
        </button>
      )}

      {stage === 'revealed' && <RevealPhase page={page} />}

      {/* White flash overlay — masks the sealed→revealed DOM swap at its peak. */}
      <div
        className="pointer-events-none absolute inset-0 bg-white"
        style={{
          opacity: 0,
          animation: stage !== 'sealed' ? `reveal-flash 500ms ease 400ms forwards` : undefined,
        }}
        aria-hidden="true"
      />
    </div>
  )
}
