import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getById, query, upsert } from '@/lib/cosmos'
import { sendConfirmationEmail } from '@/lib/email'
import type { Page, Subscriber } from '@/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const pageId = typeof body?.pageId === 'string' ? body.pageId : null
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : null

  if (!pageId || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }

  const page = await getById<Page>('pages', pageId)
  if (!page || page.status !== 'active') {
    return NextResponse.json({ error: 'This page is not accepting subscribers right now' }, { status: 404 })
  }

  const existing = await query<Subscriber>(
    'subscribers',
    'SELECT * FROM c WHERE c.pageId = @pageId AND c.email = @email',
    { pageId, email }
  )
  if (existing.length > 0) {
    // Don't leak whether they're already subscribed — just behave as if it succeeded.
    return NextResponse.json({ success: true })
  }

  const subscriber: Subscriber = {
    id: randomUUID(),
    pageId,
    email,
    confirmed: false,
    confirmToken: randomUUID(),
    notified: false,
    subscribedAt: new Date().toISOString(),
  }

  await upsert('subscribers', subscriber)
  await upsert<Page>('pages', { ...page, subscriberCount: page.subscriberCount + 1 })
  await sendConfirmationEmail({
    to: email,
    coupleName: page.announcement.coupleName,
    slug: page.id,
    confirmToken: subscriber.confirmToken,
  })

  return NextResponse.json({ success: true })
}
