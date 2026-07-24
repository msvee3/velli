import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { query, upsert } from '@/lib/cosmos'
import { generateUniqueSlug } from '@/lib/slug'
import { parseAnnouncementInput, validateTheme, ValidationError } from '@/lib/validation'
import type { Page } from '@/types'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pages = await query<Page>(
    'pages',
    'SELECT * FROM c WHERE c.ownerId = @ownerId ORDER BY c.createdAt DESC',
    { ownerId: user.id }
  )
  return NextResponse.json(pages)
}

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const theme = validateTheme(body.theme)
    const announcement = parseAnnouncementInput(body)
    const slug = await generateUniqueSlug()
    const now = new Date().toISOString()

    const page: Page = {
      id: slug,
      ownerId: user.id,
      status: 'active',
      phase: 'announcement',
      theme,
      announcement,
      reveal: {
        babyName: null,
        gender: null,
        dateOfBirth: null,
        timeOfBirth: null,
        weight: null,
        height: null,
        message: null,
        photoUrls: [],
      },
      subscriberCount: 0,
      createdAt: now,
      revealedAt: null,
    }

    await upsert('pages', page)
    return NextResponse.json(page, { status: 201 })
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Could not create page' }, { status: 500 })
  }
}
