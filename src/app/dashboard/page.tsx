import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { query } from '@/lib/cosmos'
import type { Page } from '@/types'
import PageCard from '@/components/dashboard/PageCard'
import HeroThumb from '@/components/velli/HeroThumb'

export default async function DashboardPage() {
  const user = await requireUser()
  const pages = await query<Page>(
    'pages',
    'SELECT * FROM c WHERE c.ownerId = @ownerId ORDER BY c.createdAt DESC',
    { ownerId: user.id }
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-neutral-900">Your pages</h1>
        <Link
          href="/dashboard/create"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white transition hover:bg-neutral-700"
        >
          Create new page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <HeroThumb theme="liftoff" size={96} dormant />
          <div>
            <p className="text-sm font-medium text-neutral-700">Create your first celebration page</p>
            <p className="mt-1 text-sm text-neutral-400">It stays dark until you light it.</p>
          </div>
          <Link
            href="/dashboard/create"
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm text-white transition hover:bg-neutral-700"
          >
            Create your first celebration page
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  )
}
