import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getById, query } from '@/lib/cosmos'
import { resolveTheme } from '@/lib/themes'
import type { Page, TickerMessage } from '@/types'
import ShareSection from '@/components/dashboard/ShareSection'
import DeactivateToggle from '@/components/dashboard/DeactivateToggle'
import DangerZone from '@/components/dashboard/DangerZone'
import HeroThumb from '@/components/velli/HeroThumb'

export default async function ManagePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params

  const page = await getById<Page>('pages', id)
  if (!page) notFound()
  if (page.ownerId !== user.id) redirect('/dashboard')

  const messages = await query<TickerMessage>('messages', 'SELECT VALUE COUNT(1) FROM c WHERE c.pageId = @id', {
    id,
  })
  const messageCount = (messages[0] as unknown as number) ?? 0
  const theme = resolveTheme(page.theme)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <HeroThumb theme={theme} phase={page.phase === 'reveal' ? 'reveal' : 'announce'} dormant={page.status === 'deactivated'} size={56} />
        <div>
          <h1 className="text-lg font-medium text-neutral-900">{page.announcement.title || 'Untitled celebration'}</h1>
          <p className="text-sm text-neutral-500">{page.announcement.coupleName}</p>
        </div>
      </div>

      <ShareSection slug={page.id} coupleName={page.announcement.coupleName} theme={theme} />

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-medium text-neutral-900">Stats</h2>
        <div className="mt-3 flex gap-8 text-sm">
          <div>
            <p className="text-2xl font-medium text-neutral-900">{page.subscriberCount}</p>
            <p className="text-neutral-400">subscribers</p>
          </div>
          <div>
            <p className="text-2xl font-medium text-neutral-900">{messageCount}</p>
            <p className="text-neutral-400">ticker messages</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-medium text-neutral-900">Reveal</h2>
        {page.phase === 'reveal' ? (
          <>
            <p className="mt-2 text-sm text-amber-600">Reveal published ✦</p>
            <p className="mt-1 text-sm text-neutral-500">Need to add the name or fix a detail? You can still edit it.</p>
            <Link
              href={`/dashboard/${page.id}/reveal`}
              className="mt-3 inline-block rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-200"
            >
              Edit reveal details →
            </Link>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-neutral-500">Baby arrived? Fill in the reveal details.</p>
            <Link
              href={`/dashboard/${page.id}/reveal`}
              className="mt-3 inline-block rounded-full bg-neutral-900 px-4 py-2 text-sm text-white transition hover:bg-neutral-700"
            >
              Publish the reveal →
            </Link>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-medium text-neutral-900">Messages</h2>
        <p className="mt-1 text-sm text-neutral-500">Post short updates that scroll across the ticker.</p>
        <Link
          href={`/dashboard/${page.id}/messages`}
          className="mt-3 inline-block text-sm text-neutral-700 underline underline-offset-2 hover:text-neutral-900"
        >
          Manage messages →
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-medium text-neutral-900">Settings</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/${page.id}/edit`}
            className="rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-200"
          >
            Edit announcement
          </Link>
          <DeactivateToggle pageId={page.id} active={page.status !== 'deactivated'} />
        </div>
      </div>

      <DangerZone pageId={page.id} />
    </div>
  )
}
