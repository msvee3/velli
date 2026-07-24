import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSessionUser } from '@/lib/auth'
import { getById, upsert } from '@/lib/cosmos'
import type { Page } from '@/types'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const page = await getById<Page>('pages', id)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (page.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { active } = await req.json()
  // A revealed page can also be deactivated (privacy after the fact) and
  // reactivated later — reactivating restores it to whichever phase it was
  // already in, never resets phase/reveal data.
  const status: Page['status'] = active ? (page.phase === 'reveal' ? 'revealed' : 'active') : 'deactivated'

  const updated: Page = { ...page, status }
  await upsert('pages', updated)
  revalidatePath(`/p/${id}`)
  return NextResponse.json(updated)
}
