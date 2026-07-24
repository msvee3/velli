import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getById } from '@/lib/cosmos'
import { themes } from '@/lib/themes'
import type { Page } from '@/types'
import AnnouncementPhase from '@/components/velli/AnnouncementPhase'
import RevealTrigger from '@/components/velli/RevealTrigger'
import DeactivatedScreen from '@/components/velli/DeactivatedScreen'
import OodhweMark from '@/components/velli/OodhweMark'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getById<Page>('pages', slug)
  if (!page) return {}

  const title =
    page.phase === 'reveal' && page.reveal.babyName
      ? `${page.reveal.babyName} has arrived! ✦`
      : page.announcement.title || 'A celebration page'
  const description = page.announcement.coupleName

  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default async function PublicCelebrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getById<Page>('pages', slug)
  if (!page) notFound()
  if (page.status === 'deactivated') return <DeactivatedScreen theme={page.theme} />

  const isReveal = page.phase === 'reveal'
  const bg = themes[page.theme][isReveal ? 'reveal' : 'announce'].pageBg

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <div
        className="absolute inset-0 hidden lg:block"
        style={{ background: bg, filter: 'blur(60px) brightness(0.55)', transform: 'scale(1.2)' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto h-full w-full sm:max-w-[420px] lg:max-w-[440px] lg:shadow-2xl">
        {isReveal ? (
          <RevealTrigger page={page} />
        ) : (
          <AnnouncementPhase pageId={page.id} theme={page.theme} announcement={page.announcement} />
        )}
        <OodhweMark theme={page.theme} phase={isReveal ? 'reveal' : 'announce'} />
      </div>
    </div>
  )
}
