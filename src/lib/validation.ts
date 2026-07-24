import type { PageAnnouncement, Sibling } from '@/types'
import { themeKeys, type ThemeKey } from '@/lib/themes'

export class ValidationError extends Error {}

function str(value: unknown, field: string, { max, required = true }: { max: number; required?: boolean }): string {
  if (value === undefined || value === null || value === '') {
    if (required) throw new ValidationError(`${field} is required`)
    return ''
  }
  if (typeof value !== 'string') throw new ValidationError(`${field} must be text`)
  const trimmed = value.trim()
  if (required && trimmed.length === 0) throw new ValidationError(`${field} is required`)
  if (trimmed.length > max) throw new ValidationError(`${field} must be ${max} characters or fewer`)
  return trimmed
}

export function validateTheme(value: unknown): ThemeKey {
  if (typeof value !== 'string' || !themeKeys.includes(value as ThemeKey)) {
    throw new ValidationError('Invalid theme')
  }
  return value as ThemeKey
}

export function validateBirthOrder(value: unknown): number {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1 || n > 6) {
    throw new ValidationError('Birth order must be a whole number between 1 and 6')
  }
  return n
}

export function validateSiblings(value: unknown, birthOrder: number): Sibling[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) throw new ValidationError('Siblings must be a list')

  const maxSiblings = Math.min(birthOrder - 1, 4)
  if (value.length > maxSiblings) {
    throw new ValidationError(`You can add at most ${maxSiblings} sibling${maxSiblings === 1 ? '' : 's'}`)
  }

  return value.map((s, i) => {
    const name = s && typeof s === 'object' && 'name' in s ? s.name : s
    if (name === undefined || name === null || name === '') return { name: '' }
    if (typeof name !== 'string') throw new ValidationError(`Sibling ${i + 1} name must be text`)
    const trimmed = name.trim()
    if (trimmed.length > 24) throw new ValidationError(`Sibling ${i + 1} name must be 24 characters or fewer`)
    return { name: trimmed }
  })
}

export function validateDueDate(value: unknown): string {
  if (typeof value !== 'string') throw new ValidationError('Due date is required')
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw new ValidationError('Due date must be a valid date')
  return date.toISOString()
}

/** Parses + validates the announcement fields shared by page create and edit. */
export function parseAnnouncementInput(body: Record<string, unknown>): PageAnnouncement {
  const birthOrder = validateBirthOrder(body.birthOrder)
  return {
    title: str(body.title, 'Title', { max: 100 }),
    coupleName: str(body.coupleName, 'Couple name', { max: 80 }),
    fatherName: str(body.fatherName, "Father's name", { max: 40, required: false }) || null,
    motherName: str(body.motherName, "Mother's name", { max: 40, required: false }) || null,
    dueDate: validateDueDate(body.dueDate),
    message: str(body.message, 'Message', { max: 500, required: false }),
    photoUrl: typeof body.photoUrl === 'string' ? body.photoUrl : null,
    revealNameOnAnnounce: Boolean(body.revealNameOnAnnounce),
    birthOrder,
    siblings: validateSiblings(body.siblings, birthOrder),
    tagline: body.tagline ? str(body.tagline, 'Tagline', { max: 60, required: false }) || null : null,
  }
}
