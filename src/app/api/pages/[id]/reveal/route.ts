import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSessionUser } from '@/lib/auth'
import { getById, upsert } from '@/lib/cosmos'
import { validateSiblings, ValidationError } from '@/lib/validation'
import type { Page, PageReveal, Gender } from '@/types'

const GENDERS: Gender[] = ['boy', 'girl', 'surprise']

function str(v: unknown, max: number): string | null {
  if (typeof v !== 'string' || v.trim() === '') return null
  return v.trim().slice(0, max)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const page = await getById<Page>('pages', id)
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (page.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Re-submitting an already-revealed page edits its reveal details in place
  // (e.g. adding a name that was held back) — it keeps the original revealedAt
  // and never re-notifies subscribers.
  const isEdit = page.phase === 'reveal'

  try {
    const body = await req.json()
    if (typeof body.dateOfBirth !== 'string' || Number.isNaN(new Date(body.dateOfBirth).getTime())) {
      throw new ValidationError('Date of birth is required')
    }

    const reveal: PageReveal = {
      babyName: str(body.babyName, 60),
      gender: GENDERS.includes(body.gender) ? body.gender : null,
      dateOfBirth: new Date(body.dateOfBirth).toISOString(),
      timeOfBirth: str(body.timeOfBirth, 10),
      weight: str(body.weight, 20),
      height: str(body.height, 20),
      message: str(body.message, 500),
      photoUrls: Array.isArray(body.photoUrls) ? body.photoUrls.filter((u: unknown) => typeof u === 'string').slice(0, 5) : [],
    }
    const siblings = validateSiblings(body.siblings, page.announcement.birthOrder)

    const updated: Page = {
      ...page,
      phase: 'reveal',
      status: 'revealed',
      revealedAt: isEdit ? page.revealedAt : new Date().toISOString(),
      reveal,
      announcement: { ...page.announcement, siblings },
    }
    await upsert('pages', updated)
    revalidatePath(`/p/${id}`)

    // Editing an existing reveal never re-notifies — subscribers were emailed
    // at the original publish and shouldn't be pinged again for a correction.
    if (isEdit) {
      return NextResponse.json({ page: updated, notified: false })
    }

    // Fire-and-forget-ish: notify is a separate internal route (shared-secret
    // protected) so the send-to-subscribers concern stays decoupled from the
    // publish transaction itself. We still await it so failures surface here.
    const notifyUrl = new URL('/api/notify', process.env.APP_URL ?? req.url)
    const notifyRes = await fetch(notifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-notify-secret': process.env.NOTIFY_SECRET ?? '' },
      body: JSON.stringify({ pageId: id }),
    }).catch(() => null)

    return NextResponse.json({ page: updated, notified: notifyRes?.ok ?? false })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Could not publish the reveal' }, { status: 500 })
  }
}
