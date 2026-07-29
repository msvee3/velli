import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import AmbientField from '@/components/velli/AmbientField'
import VelliLogo from '@/components/ui/VelliLogo'

export default async function MarketingHome() {
  const session = await auth()
  if (session?.user?.id) redirect('/dashboard')

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at 50% 18%, #2d1b5e 0%, #080614 62%)' }}
      />
      <AmbientField theme="liftoff" />

      <VelliLogo size={54} ring="rgba(180,160,255,0.28)" priority className="mb-8" />
      <h1
        className="mt-8 max-w-sm text-[clamp(1.5rem,5vw,2.25rem)] font-[family-name:var(--font-celebration)]"
        style={{ color: '#e8d8ff' }}
      >
        A celebration page for the people you love.
      </h1>
      <p className="mt-3 max-w-xs text-sm" style={{ color: 'rgba(200,170,255,0.5)' }}>
        Announce the news. Share the reveal. All at one link.
      </p>

      <Link
        href="/login"
        className="mt-10 rounded-full px-6 py-3 text-sm backdrop-blur-sm transition"
        style={{
          background: 'rgba(170,130,255,0.1)',
          border: '1px solid rgba(170,130,255,0.25)',
          color: 'rgba(220,200,255,0.85)',
        }}
      >
        Create your page
      </Link>
    </main>
  )
}
