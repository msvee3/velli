import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { upsert } from '@/lib/cosmos'
import { sendFeedbackNotification } from '@/lib/email'
import type { Feedback } from '@/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60 * 60 * 1000

// In-memory per-IP throttle — this is a public, unauthenticated endpoint.
// Resets on redeploy, which is fine for the volume this form expects.
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages — please try again later' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 60) : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 1000) : ''

  if (!name || !email || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json({ error: 'Please fill in every field with a valid email' }, { status: 400 })
  }

  const feedback: Feedback = { id: randomUUID(), name, email, message, createdAt: new Date().toISOString() }
  await upsert('feedback', feedback)
  await sendFeedbackNotification({ name, email, message })

  return NextResponse.json({ success: true })
}
