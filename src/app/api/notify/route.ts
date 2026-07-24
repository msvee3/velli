import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getById, query, upsert } from '@/lib/cosmos'
import { sendRevealEmail } from '@/lib/email'
import type { Page, Subscriber, EmailLog } from '@/types'

// Internal only — never called from the browser. Gated by a shared secret
// header instead of the user session, since /api/pages/[id]/reveal calls it
// server-to-server right after publishing.
export async function POST(req: Request) {
  const secret = req.headers.get('x-notify-secret')
  if (!secret || secret !== process.env.NOTIFY_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { pageId } = await req.json()
  if (typeof pageId !== 'string') return NextResponse.json({ error: 'pageId is required' }, { status: 400 })

  const page = await getById<Page>('pages', pageId)
  if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 })

  const subscribers = await query<Subscriber>(
    'subscribers',
    'SELECT * FROM c WHERE c.pageId = @pageId AND c.confirmed = true AND c.notified = false',
    { pageId }
  )

  let sent = 0
  for (const subscriber of subscribers) {
    const result = await sendRevealEmail({
      to: subscriber.email,
      coupleName: page.announcement.coupleName,
      babyName: page.reveal.babyName,
      slug: page.id,
    })

    const log: EmailLog = {
      id: randomUUID(),
      pageId,
      subscriberId: subscriber.id,
      type: 'reveal',
      sentAt: new Date().toISOString(),
      status: result.status,
      resendId: result.resendId,
    }
    await upsert('emailLog', log)

    if (result.status === 'sent') {
      await upsert<Subscriber>('subscribers', { ...subscriber, notified: true })
      sent += 1
    }
  }

  return NextResponse.json({ total: subscribers.length, sent })
}
