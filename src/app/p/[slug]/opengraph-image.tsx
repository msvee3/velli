import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getById } from '@/lib/cosmos'
import { themes, resolveTheme } from '@/lib/themes'
import type { Page } from '@/types'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Satori can't resolve next/image or a bare public/ path — a local asset has to
// be read off disk and inlined. Cached at module scope so it's read once per
// server instance rather than on every share-preview render.
let markSrc: string | null = null
async function velliMark(): Promise<string> {
  if (!markSrc) {
    const data = await readFile(join(process.cwd(), 'public', 'velli_mark.png'), 'base64')
    markSrc = `data:image/png;base64,${data}`
  }
  return markSrc
}

// Auto-wired into the page's OG/Twitter meta tags by the file convention —
// a themed gradient + orb glyph instead of a flat text card, so the WhatsApp
// link preview looks like the product before anyone taps it.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getById<Page>('pages', slug)
  const theme = resolveTheme(page?.theme)
  const isReveal = page?.phase === 'reveal'
  const palette = themes[theme][isReveal ? 'reveal' : 'announce']
  const title =
    isReveal && page?.reveal.babyName ? `${page.reveal.babyName} has arrived` : page?.announcement.title || 'A celebration is on the way'
  const coupleName = page?.announcement.coupleName ?? 'velli'
  const mark = await velliMark()

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: palette.pageBg,
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: palette.heroGradient,
            display: 'flex',
          }}
        />
        <div
          style={{
            marginTop: 44,
            fontSize: 56,
            color: 'title' in palette.text ? palette.text.title : palette.text.name,
            fontFamily: 'Georgia, serif',
            textAlign: 'center',
            maxWidth: 900,
            display: 'flex',
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            color: 'couple' in palette.text ? palette.text.couple : palette.text.stat,
            display: 'flex',
          }}
        >
          {coupleName}
        </div>

        {/* Brand mark, corner-anchored so it never competes with the headline. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mark}
          alt="velli"
          width={56}
          height={56}
          style={{ position: 'absolute', bottom: 40, right: 44, borderRadius: 14, opacity: 0.92 }}
        />
      </div>
    ),
    { ...size }
  )
}
