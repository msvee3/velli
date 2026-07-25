import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { query, upsert } from '@/lib/cosmos'

// Temporary, one-shot data-normalization route for the 7-theme redesign.
// Not gated by the app's usual per-owner auth (there's no admin-role system)
// — just a hardcoded operator check. Delete this file once it's been run
// once against production; `resolveTheme()` in lib/themes.ts already makes
// legacy keys safe to render indefinitely, so this is cleanup, not a fix.
const OPERATOR_EMAIL = 'msvee3@outlook.com'

const LEGACY_MAP: Record<string, string> = {
  stellar: 'liftoff',
  nebula: 'circuit',
  bloom: 'trailhead',
  dusk: 'premiere',
  ember: 'forge',
}

const OLD_KEYS = Object.keys(LEGACY_MAP)

interface RawPage {
  id: string
  theme: string
  [key: string]: unknown
}

async function fetchLegacyPages() {
  const params: Record<string, string> = {}
  OLD_KEYS.forEach((key, i) => {
    params[`k${i}`] = key
  })
  const sql = `SELECT * FROM c WHERE c.theme IN (${OLD_KEYS.map((_, i) => `@k${i}`).join(', ')})`
  return query<RawPage>('pages', sql, params)
}

async function requireOperator() {
  const user = await getSessionUser()
  return user?.email === OPERATOR_EMAIL
}

/** Dry run — counts of published pages per retired theme key, no writes. */
export async function GET() {
  if (!(await requireOperator())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const pages = await fetchLegacyPages()
  const counts: Record<string, number> = {}
  for (const p of pages) counts[p.theme] = (counts[p.theme] ?? 0) + 1

  return NextResponse.json({ dryRun: true, total: pages.length, counts })
}

/** Remaps every page still on a retired theme key to its nearest new theme. */
export async function POST() {
  if (!(await requireOperator())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const pages = await fetchLegacyPages()
  let migrated = 0
  for (const p of pages) {
    const newTheme = LEGACY_MAP[p.theme]
    if (!newTheme) continue
    await upsert('pages', { ...p, theme: newTheme })
    migrated++
  }

  return NextResponse.json({ migrated, total: pages.length })
}
