import { notFound } from 'next/navigation'
import { getById } from '@/lib/cosmos'
import { themes, resolveTheme } from '@/lib/themes'
import { themeFontClassName } from '@/lib/theme-fonts'
import type { Page } from '@/types'
import HeroStage from '@/components/velli/HeroStage'

export default async function ConfirmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getById<Page>('pages', slug)
  if (!page) notFound()

  const theme = resolveTheme(page.theme)
  const palette = themes[theme].announce

  return (
    <div
      className={`flex h-[100dvh] w-full flex-col items-center justify-center px-6 text-center ${themeFontClassName(theme)}`}
      style={{ background: palette.pageBg }}
    >
      <HeroStage theme={theme} size={140} birthOrder={page.announcement.birthOrder} />
      <p className="mt-8 max-w-xs text-[clamp(1.1rem,4vw,1.4rem)] font-[family-name:var(--font-celebration)]" style={{ color: palette.text.title }}>
        You&apos;re confirmed!
      </p>
      <p className="mt-2 max-w-xs text-sm" style={{ color: palette.text.couple }}>
        We&apos;ll email you the moment the baby arrives.
      </p>
    </div>
  )
}
