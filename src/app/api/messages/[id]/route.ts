import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { getById, deleteItem } from '@/lib/cosmos'
import type { Page, TickerMessage } from '@/types'

// Owner-only. Cosmos needs the partition key (pageId) to delete, so the
// client sends it alongside the message id.
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const pageId = searchParams.get('pageId')
  if (!pageId) return NextResponse.json({ error: 'pageId is required' }, { status: 400 })

  const message = await getById<TickerMessage>('messages', id, pageId)
  if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const page = await getById<Page>('pages', message.pageId)
  if (!page || page.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await deleteItem('messages', id, message.pageId)
  return NextResponse.json({ success: true })
}
