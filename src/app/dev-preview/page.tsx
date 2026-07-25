import AnnouncementPhase from '@/components/velli/AnnouncementPhase'
import HeroThumb from '@/components/velli/HeroThumb'
import { themeKeys, themes } from '@/lib/themes'
import type { PageAnnouncement } from '@/types'

// TEMPORARY verification harness — delete after checking all 7 themes render.
const sample: PageAnnouncement = {
  title: 'Our baby is coming',
  coupleName: 'Priya & Rahul',
  fatherName: null,
  motherName: null,
  dueDate: new Date(Date.now() + 86400000 * 96).toISOString(),
  message: 'A note to whoever finds this page.',
  photoUrl: null,
  revealNameOnAnnounce: false,
  birthOrder: 1,
  siblings: [],
  tagline: null,
}

export default function DevPreview() {
  return (
    <>
      {/* Icons at the sizes they're actually used: picker swatch and card thumb. */}
      <div className="bg-white p-6">
        <p className="mb-3 text-xs uppercase tracking-wide text-neutral-400">Picker swatches — 56px</p>
        <div className="flex gap-4">
          {themeKeys.map((key) => (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <HeroThumb theme={key} size={56} />
              <span className="text-[10px] text-neutral-500">{themes[key].label}</span>
            </div>
          ))}
        </div>
        <p className="mb-3 mt-8 text-xs uppercase tracking-wide text-neutral-400">Reveal phase — 56px</p>
        <div className="flex gap-4">
          {themeKeys.map((key) => (
            <HeroThumb key={key} theme={key} phase="reveal" size={56} />
          ))}
        </div>
        <p className="mb-3 mt-8 text-xs uppercase tracking-wide text-neutral-400">Large — 120px</p>
        <div className="flex gap-4">
          {themeKeys.map((key) => (
            <HeroThumb key={key} theme={key} size={120} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 bg-neutral-950 p-6">
      {themeKeys.map((key) => (
        <div key={key}>
          <p className="mb-2 text-center text-xs text-neutral-400">{themes[key].label}</p>
          <div className="h-[720px] w-[390px] overflow-hidden rounded-3xl">
            <AnnouncementPhase pageId="preview" theme={key} announcement={sample} preview />
          </div>
        </div>
      ))}
      </div>
    </>
  )
}
