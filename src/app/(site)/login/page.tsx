import { redirect } from 'next/navigation'
import { auth, signIn } from '@/auth'
import HeroStage from '@/components/velli/HeroStage'
import AmbientField from '@/components/velli/AmbientField'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const session = await auth()
  if (session?.user?.id) redirect('/dashboard')

  const { from } = await searchParams
  const redirectTo = from && from.startsWith('/dashboard') ? from : '/dashboard'

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at 50% 18%, #2d1b5e 0%, #080614 62%)' }}
      />
      <AmbientField theme="liftoff" />

      <HeroStage theme="liftoff" size={200} />

      <p
        className="mt-10 max-w-xs text-[clamp(1.1rem,4vw,1.4rem)] font-[family-name:var(--font-celebration)]"
        style={{ color: '#e8d8ff' }}
      >
        Something is on the way.
      </p>

      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo })
        }}
        className="mt-10"
      >
        <button
          type="submit"
          className="flex items-center gap-3 rounded-full px-6 py-3 text-sm backdrop-blur-sm transition hover:brightness-110"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(232,216,255,0.92)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.1 6.62 3.48 9 3.48z"
            />
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z"
            />
            <path
              fill="#FBBC05"
              d="M3.87 10.78A5.4 5.4 0 0 1 3.6 9c0-.62.11-1.22.27-1.78L.96 4.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.91-2.26z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.85.86-3.05.86-2.38 0-4.4-1.62-5.13-3.8L.96 13.04C2.44 15.98 5.48 18 9 18z"
            />
          </svg>
          Continue with Google
        </button>
      </form>
    </main>
  )
}
