import type { ThemeKey } from '@/lib/themes'

export type PageStatus = 'active' | 'deactivated' | 'revealed'
export type PagePhase = 'announcement' | 'reveal'
export type Gender = 'boy' | 'girl' | 'surprise'

export interface User {
  id: string // uuid — Cosmos user id, also what session.user.id resolves to
  email: string
  name: string
  image: string | null
  createdAt: string // ISO 8601
  lastLoginAt: string // ISO 8601
}

export interface Sibling {
  name: string // "" allowed — renders as an unnamed dot in SiblingOrbit
}

export interface PageAnnouncement {
  title: string
  coupleName: string
  fatherName: string | null // shown as a labelled column on the reveal
  motherName: string | null // shown as a labelled column on the reveal
  dueDate: string // ISO 8601
  message: string
  photoUrl: string | null
  revealNameOnAnnounce: boolean
  birthOrder: number // 1 = first child, 2, 3, 4+
  siblings: Sibling[] // only meaningful when birthOrder > 1, max birthOrder - 1 (capped at 4)
  tagline: string | null // optional custom line, overrides generated "Our first" / "Baby number two" copy
}

export interface PageReveal {
  babyName: string | null
  gender: Gender | null
  dateOfBirth: string | null // ISO 8601
  timeOfBirth: string | null // "03:42"
  weight: string | null // "3.2 kg"
  height: string | null // "51 cm"
  message: string | null
  photoUrls: string[] // up to 5
}

export interface Page {
  id: string // nanoid 8-char slug — also the URL slug and Cosmos partition key
  ownerId: string // user.id
  status: PageStatus
  phase: PagePhase
  theme: ThemeKey
  announcement: PageAnnouncement
  reveal: PageReveal
  subscriberCount: number
  createdAt: string
  revealedAt: string | null
}

export interface Subscriber {
  id: string // uuid
  pageId: string
  email: string
  confirmed: boolean
  confirmToken: string
  notified: boolean
  subscribedAt: string
}

export interface TickerMessage {
  id: string // uuid
  pageId: string
  text: string // max 80 chars
  createdAt: string
}

export type EmailType = 'confirm' | 'reveal'
export type EmailStatus = 'sent' | 'failed'

export interface EmailLog {
  id: string
  pageId: string
  subscriberId: string
  type: EmailType
  sentAt: string
  status: EmailStatus
  resendId: string | null
}

export interface Feedback {
  id: string // uuid
  name: string
  email: string
  message: string
  createdAt: string
}
