import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getById, query } from '@/lib/cosmos'
import { resolveTheme } from '@/lib/themes'
import type { Page, TickerMessage } from '@/types'
import MessageList from '@/components/dashboard/MessageList'

export default async function MessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params

  const page = await getById<Page>('pages', id)
  if (!page) notFound()
  if (page.ownerId !== user.id) redirect('/dashboard')

  const messages = await query<TickerMessage>(
    'messages',
    'SELECT * FROM c WHERE c.pageId = @id ORDER BY c.createdAt ASC',
    { id }
  )

  return (
    <div>
      <Link href={`/dashboard/${id}`} className="text-sm text-neutral-400 hover:text-neutral-700">
        ← Back
      </Link>
      <h1 className="mt-3 text-lg font-medium text-neutral-900">Ticker messages</h1>
      <p className="mt-1 text-sm text-neutral-500">Short updates that scroll across the bottom of your page.</p>
      <div className="mt-6">
        <MessageList
          pageId={page.id}
          theme={resolveTheme(page.theme)}
          phase={page.phase === 'reveal' ? 'reveal' : 'announce'}
          initialMessages={messages}
        />
      </div>
    </div>
  )
}
