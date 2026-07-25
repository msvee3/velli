import { NextResponse } from 'next/server'
import { query, upsert } from '@/lib/cosmos'
import type { Subscriber } from '@/types'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const matches = await query<Subscriber>('subscribers', 'SELECT * FROM c WHERE c.confirmToken = @token', {
    token,
  })
  const subscriber = matches[0]
  if (!subscriber) return NextResponse.redirect(new URL('/', origin))

  if (!subscriber.confirmed) {
    await upsert<Subscriber>('subscribers', { ...subscriber, confirmed: true })
  }

  return NextResponse.redirect(new URL(`/p/${subscriber.pageId}/confirm`, origin))
}
