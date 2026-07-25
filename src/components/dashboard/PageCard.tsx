import Link from 'next/link'
import HeroThumb from '@/components/velli/HeroThumb'
import type { Page } from '@/types'
import { themes, resolveTheme } from '@/lib/themes'

const STATUS_LABEL: Record<Page['status'], string> = {
  active: 'Active',
  revealed: 'Revealed',
  deactivated: 'Deactivated',
}

const STATUS_DOT: Record<Page['status'], string> = {
  active: 'bg-emerald-500',
  revealed: 'bg-amber-500',
  deactivated: 'bg-neutral-400',
}

export default function PageCard({ page }: { page: Page }) {
  const phase = page.phase === 'reveal' ? 'reveal' : 'announce'
  const theme = resolveTheme(page.theme)
  const preview = themes[theme].preview

  return (
    <div
      className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div
        className="flex items-center gap-3 p-5"
        style={{ background: `linear-gradient(135deg, ${preview.from}12, ${preview.to}12)` }}
      >
        <HeroThumb theme={theme} phase={phase} dormant={page.status === 'deactivated'} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-neutral-900">
            {page.announcement.title || 'Untitled celebration'}
          </p>
          <p className="truncate text-xs text-neutral-500">{page.announcement.coupleName}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[page.status]}`} />
          {STATUS_LABEL[page.status]}
        </span>
        <span>{page.subscriberCount} subscriber{page.subscriberCount === 1 ? '' : 's'}</span>
      </div>

      <div className="flex divide-x divide-neutral-100 border-t border-neutral-100 text-sm">
        <Link
          href={`/p/${page.id}`}
          target="_blank"
          className="flex-1 py-2.5 text-center text-neutral-600 transition hover:bg-neutral-50"
        >
          View page
        </Link>
        <Link
          href={`/dashboard/${page.id}`}
          className="flex-1 py-2.5 text-center font-medium text-neutral-900 transition hover:bg-neutral-50"
        >
          Manage
        </Link>
      </div>
    </div>
  )
}
