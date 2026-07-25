import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSessionUser } from '@/lib/auth'
import { getById, query, upsert, deleteItem } from '@/lib/cosmos'
import { parseAnnouncementInput, validateTheme, ValidationError } from '@/lib/validation'
import type { Page, Subscriber, TickerMessage, EmailLog } from '@/types'

async function loadOwnedPage(id: string, userId: string) {
  const page = await getById<Page>('pages', id)
  if (!page) return { page: null, error: NextResponse.json({ error: 'Not found' }, { status: 404 }) }
  if (page.ownerId !== userId) return { page: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { page, error: null }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { page, error } = await loadOwnedPage(id, user.id)
  if (error) return error
  return NextResponse.json(page)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { page, error } = await loadOwnedPage(id, user.id)
  if (error) return error

  try {
    const body = await req.json()
    const theme = body.theme !== undefined ? validateTheme(body.theme) : page!.theme
    const announcement = parseAnnouncementInput({ ...page!.announcement, ...body })

    // This route intentionally never touches phase/status/reveal — those are
    // owned by /reveal and /deactivate respectively (spec: "Cannot change
    // phase/status via this route").
    const updated: Page = { ...page!, theme, announcement }
    await upsert('pages', updated)
    revalidatePath(`/p/${updated.id}`)
    return NextResponse.json(updated)
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Could not update page' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await loadOwnedPage(id, user.id)
  if (error) return error

  const [subscribers, messages, emailLogs] = await Promise.all([
    query<Subscriber>('subscribers', 'SELECT * FROM c WHERE c.pageId = @id', { id }),
    query<TickerMessage>('messages', 'SELECT * FROM c WHERE c.pageId = @id', { id }),
    query<EmailLog>('emailLog', 'SELECT * FROM c WHERE c.pageId = @id', { id }),
  ])

  await Promise.all([
    ...subscribers.map((s) => deleteItem('subscribers', s.id, s.pageId)),
    ...messages.map((m) => deleteItem('messages', m.id, m.pageId)),
    ...emailLogs.map((l) => deleteItem('emailLog', l.id, l.pageId)),
    deleteItem('pages', id, id),
  ])

  revalidatePath(`/p/${id}`)
  return NextResponse.json({ success: true })
}
