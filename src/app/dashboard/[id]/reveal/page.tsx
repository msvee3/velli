import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { getById } from '@/lib/cosmos'
import type { Page } from '@/types'
import RevealForm from '@/components/dashboard/RevealForm'

export default async function RevealPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params

  const page = await getById<Page>('pages', id)
  if (!page) notFound()
  if (page.ownerId !== user.id) redirect('/dashboard')

  const alreadyRevealed = page.phase === 'reveal'
  const maxSiblings = Math.min(page.announcement.birthOrder - 1, 4)

  return (
    <div>
      <Link href={`/dashboard/${id}`} className="text-sm text-neutral-400 hover:text-neutral-700">
        ← Back
      </Link>
      <h1 className="mt-3 text-lg font-medium text-neutral-900">
        {alreadyRevealed ? 'Edit the reveal' : 'Publish the reveal'}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        {alreadyRevealed
          ? 'Update the name or any other details. Subscribers were already notified, so saving changes won’t email them again.'
          : 'Fill in what you know — the rest can stay blank. This can’t be undone once published.'}
      </p>
      <div className="mt-6">
        <RevealForm
          pageId={page.id}
          subscriberCount={page.subscriberCount}
          initialReveal={page.reveal}
          initialSiblings={page.announcement.siblings}
          maxSiblings={maxSiblings}
          alreadyRevealed={alreadyRevealed}
        />
      </div>
    </div>
  )
}
