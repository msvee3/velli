import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getById, query, upsert } from '@/lib/cosmos'
import { getSessionUser } from '@/lib/auth'
import type { Page, TickerMessage } from '@/types'

const MAX_MESSAGES = 10
const MAX_LENGTH = 80

// Public — the celebration page's TickerBand polls this every 60s.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pageId = searchParams.get('pageId')
  if (!pageId) return NextResponse.json({ error: 'pageId is required' }, { status: 400 })

  const messages = await query<TickerMessage>(
    'messages',
    'SELECT * FROM c WHERE c.pageId = @pageId ORDER BY c.createdAt ASC',
    { pageId }
  )
  return NextResponse.json(messages)
}

// Owner-only — posted from /dashboard/[id]/messages.
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const pageId = typeof body?.pageId === 'string' ? body.pageId : null
  const text = typeof body?.text === 'string' ? body.text.trim() : null

  if (!pageId || !text) return NextResponse.json({ error: 'pageId and text are required' }, { status: 400 })
  if (text.length > MAX_LENGTH) {
    return NextResponse.json({ error: `Messages must be ${MAX_LENGTH} characters or fewer` }, { status: 400 })
  }

  const page = await getById<Page>('pages', pageId)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (page.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const existing = await query<TickerMessage>('messages', 'SELECT VALUE COUNT(1) FROM c WHERE c.pageId = @pageId', {
    pageId,
  })
  const count = (existing[0] as unknown as number) ?? 0
  if (count >= MAX_MESSAGES) {
    return NextResponse.json({ error: `You can have at most ${MAX_MESSAGES} active messages` }, { status: 400 })
  }

  const message: TickerMessage = { id: randomUUID(), pageId, text, createdAt: new Date().toISOString() }
  await upsert('messages', message)
  return NextResponse.json(message, { status: 201 })
}
