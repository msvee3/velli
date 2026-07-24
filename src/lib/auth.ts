import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

/** Server-side helper for protected pages/routes: redirects to /login if unauthenticated. */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  return session.user
}

/** Same as requireUser but for API routes — returns null instead of redirecting. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth()
  return session?.user ?? null
}
