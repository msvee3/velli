import { customAlphabet } from 'nanoid'
import { getById } from '@/lib/cosmos'
import type { Page } from '@/types'

// URL-safe, unambiguous alphabet (spec calls for 8-char nanoid ids). 64^8 ≈ 281T combinations.
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_', 8)

/** Generates an 8-char slug, re-rolling on the rare Cosmos collision. */
export async function generateUniqueSlug(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = nanoid()
    const existing = await getById<Page>('pages', candidate)
    if (!existing) return candidate
  }
  throw new Error('Could not generate a unique slug after 5 attempts')
}
