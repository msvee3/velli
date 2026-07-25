import { ImageResponse } from 'next/og'
import { getById } from '@/lib/cosmos'
import { themes, resolveTheme } from '@/lib/themes'
import type { Page } from '@/types'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

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
      </div>
    ),
    { ...size }
  )
}
