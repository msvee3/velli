import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { signOut } from '@/auth'
import AccountMenu from '@/components/dashboard/AccountMenu'
import VelliLogo from '@/components/ui/VelliLogo'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth — proxy.ts already gates /dashboard/*, this covers direct
  // server-side renders/route handlers reached outside the proxy matcher.
  const user = await requireUser()

  async function signOutAction() {
    'use server'
    await signOut({ redirectTo: '/' })
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-neutral-50 font-[family-name:var(--font-dashboard)] text-neutral-900">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <Link href="/dashboard" aria-label="velli — go to dashboard" className="transition hover:opacity-80">
          <VelliLogo size={30} priority />
        </Link>
        <AccountMenu
          name={user.name}
          email={user.email}
          image={user.image}
          signOutAction={signOutAction}
        />
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
    </div>
  )
}
