# velli — Pregnancy Announcement & Birth Reveal App
## Claude Code Build Prompt

Paste this file into your Claude Code chat at the start of every session.
It is the single source of truth for the project. Read it fully before writing any code.

---

## Concept

velli is a mobile-first web app where parents create a **celebration page** for
their pregnancy announcement. Each page has two phases:

1. **Announcement phase** — a living, animated public page shared via a unique
   WhatsApp link. Visitors can subscribe with their email to be notified on arrival.
2. **Reveal phase** — when baby arrives, parents update the page. The same URL
   transforms visually (full colour shift + bloom animation) and all confirmed
   subscribers receive a reveal email.

The visual design is cinematic, not a greeting card. A pulsing orb (heartbeat
metaphor), ambient stardust particles, a live countdown, and a scrolling ticker
for parent updates. On reveal: a white flash, the entire palette shifts from
cool/dark to warm, petals bloom outward from the orb, and the baby's name types
in letter-by-letter.

Parents choose from 5 colour themes when creating their page. They can
deactivate their page at any time (same URL shows a minimal offline message;
data is preserved and can be reactivated).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14, App Router, TypeScript |
| Database | Azure Cosmos DB — Core (SQL) API, NoSQL |
| Email | Resend (OTP + subscriber notifications) |
| Storage | Azure Blob Storage (photo uploads) |
| Auth | Email OTP + iron-session (encrypted cookie, no passwords) |
| Styling | Tailwind CSS v3 + raw CSS for celebration page animations |
| Fonts | Google Fonts — Cormorant Garamond (celebration page) + Inter (dashboard) |
| Slug | nanoid (8-char URL-safe IDs) |
| Images | next/image + sharp |
| QR | qrcode npm package |

---

## Environment Variables

```env
# Azure Cosmos DB
COSMOS_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_KEY=your_primary_key
COSMOS_DATABASE=velli

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=hello@yourdomain.com

# App
APP_URL=http://localhost:3000

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_STORAGE_CONTAINER=velli-uploads

# Session (generate with: openssl rand -hex 32)
SESSION_SECRET=your_32_char_minimum_random_secret
SESSION_PASSWORD=your_32_char_minimum_random_password
```

---

## Azure Cosmos DB

**Database name:** `velli`

### Containers

| Container | Partition Key | TTL | Notes |
|---|---|---|---|
| `users` | `/id` | — | Index on `email` |
| `pages` | `/id` | — | `id` = slug (nanoid). Index on `ownerId` |
| `otpCodes` | `/email` | 600s | Auto-expires after 10 min |
| `subscribers` | `/pageId` | — | Index on `email` |
| `messages` | `/pageId` | — | Ticker messages, max 10 per page |
| `emailLog` | `/pageId` | — | Notification audit log |

> **Note on pages partition key:** The page `id` IS the slug (e.g. `xK29fA8b`).
> This gives O(1) point reads on the public page load (highest volume).
> Dashboard queries by `ownerId` use a cross-partition query — acceptable at this scale.

### Document Schemas

#### `users`
```typescript
{
  id: string           // uuid
  email: string
  name: string
  createdAt: string    // ISO 8601
}
```

#### `pages`
```typescript
{
  id: string           // nanoid 8-char slug — THIS IS ALSO THE URL SLUG
  ownerId: string      // user.id
  status: 'active' | 'deactivated' | 'revealed'
  phase: 'announcement' | 'reveal'
  theme: 'stellar' | 'bloom' | 'dusk' | 'nebula' | 'ember'
  announcement: {
    title: string            // e.g. "Baby Mehta is on the way"
    coupleName: string       // e.g. "Priya & Rahul"
    dueDate: string          // ISO 8601
    message: string          // parent's note to visitors
    photoUrl: string | null  // Azure Blob URL
    revealNameOnAnnounce: boolean  // show name during announcement phase?
  }
  reveal: {
    babyName: string | null
    gender: 'boy' | 'girl' | 'surprise' | null
    dateOfBirth: string | null   // ISO 8601
    timeOfBirth: string | null   // "03:42"
    weight: string | null        // "3.2 kg"
    height: string | null        // "51 cm"
    message: string | null
    photoUrls: string[]          // up to 5 Azure Blob URLs
  }
  subscriberCount: number        // denormalised for dashboard display
  createdAt: string
  revealedAt: string | null
}
```

#### `otpCodes`
```typescript
{
  id: string           // uuid
  email: string
  codeHash: string     // bcryptjs hash of 6-digit OTP
  attempts: number     // max 5 before lockout
  consumed: boolean
  ttl: 600             // Cosmos TTL in seconds — auto-deletes
}
```

#### `subscribers`
```typescript
{
  id: string           // uuid
  pageId: string
  email: string
  confirmed: boolean
  confirmToken: string // uuid used in confirmation link
  notified: boolean    // true after reveal email sent
  subscribedAt: string
}
```

#### `messages`
```typescript
{
  id: string           // uuid
  pageId: string
  text: string         // max 80 chars
  createdAt: string
}
```

#### `emailLog`
```typescript
{
  id: string
  pageId: string
  subscriberId: string
  type: 'confirm' | 'reveal'
  sentAt: string
  status: 'sent' | 'failed'
  resendId: string | null  // Resend message ID for tracking
}
```

---

## Project Structure

```
src/
├── app/
│   ├── p/
│   │   └── [slug]/
│   │       ├── page.tsx              # Public celebration page (server component)
│   │       └── confirm/page.tsx      # Email subscription confirmation landing
│   ├── login/
│   │   └── page.tsx                  # Email entry form
│   ├── verify/
│   │   └── page.tsx                  # OTP entry form
│   ├── dashboard/
│   │   ├── layout.tsx                # Protected layout — redirect to /login if no session
│   │   ├── page.tsx                  # List owner's pages
│   │   ├── create/
│   │   │   └── page.tsx              # Multi-step page creation
│   │   └── [id]/
│   │       ├── page.tsx              # Page management hub
│   │       ├── edit/page.tsx         # Edit announcement content
│   │       ├── reveal/page.tsx       # Fill + publish reveal
│   │       └── messages/page.tsx     # Manage ticker messages
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-otp/route.ts
│   │   │   ├── verify-otp/route.ts
│   │   │   └── logout/route.ts
│   │   ├── pages/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PUT, DELETE
│   │   │       ├── reveal/route.ts   # POST — publish reveal + trigger notifications
│   │   │       └── deactivate/route.ts  # POST — toggle active/deactivated
│   │   ├── subscribers/
│   │   │   ├── route.ts              # POST — subscribe
│   │   │   └── confirm/route.ts      # GET — confirm via token
│   │   ├── messages/
│   │   │   ├── route.ts              # GET (public), POST (owner)
│   │   │   └── [id]/route.ts         # DELETE (owner)
│   │   └── notify/route.ts           # POST — internal: send reveal emails
│   └── layout.tsx
├── components/
│   ├── velli/                         # All celebration page components
│   │   ├── CelebrationPage.tsx       # Root — switches between phases, handles reveal trigger
│   │   ├── AnnouncementPhase.tsx
│   │   ├── RevealPhase.tsx
│   │   ├── OrbPulse.tsx              # Heartbeat-animated orb with rings
│   │   ├── StarField.tsx             # CSS-animated stars + rising sparks
│   │   ├── TickerBand.tsx            # Scrolling message band (CSS marquee)
│   │   ├── Countdown.tsx             # Live days/hours/minutes countdown
│   │   ├── SubscribeForm.tsx         # Email capture on public announcement page
│   │   ├── PetalBurst.tsx            # Web Animations API bloom on reveal
│   │   ├── RevealTrigger.tsx         # Per-visitor tap-to-bloom with localStorage flag
│   │   └── DeactivatedScreen.tsx     # "Page no longer available" full-screen
│   ├── dashboard/
│   │   ├── PageCard.tsx
│   │   ├── ThemePicker.tsx           # 5 visual swatches, two-tone preview
│   │   ├── DeactivateToggle.tsx
│   │   ├── MessageList.tsx
│   │   ├── RevealForm.tsx
│   │   └── StepForm.tsx              # Multi-step create flow
│   └── ui/
│       ├── OtpInput.tsx              # 6-box OTP entry (auto-focus next)
│       └── Button.tsx
├── lib/
│   ├── cosmos.ts                     # CosmosClient singleton + typed helpers
│   ├── email.ts                      # Resend wrapper (OTP, confirm, reveal)
│   ├── auth.ts                       # iron-session config + getSession helper
│   ├── slug.ts                       # nanoid page slug generator
│   ├── otp.ts                        # OTP generate / bcrypt hash / verify
│   └── themes.ts                     # All 5 theme colour definitions
└── types/
    └── index.ts                      # All shared TypeScript types
```

---

## Colour Themes

Defined in `src/lib/themes.ts`. The `id` is stored in the page document.
All CSS values live in the frontend — no colour data in the database.

```typescript
// src/lib/themes.ts

export type ThemeKey = 'stellar' | 'bloom' | 'dusk' | 'nebula' | 'ember'

export interface ThemePalette {
  announce: {
    pageBg: string           // radial-gradient for full-screen bg
    orbGradient: string      // radial-gradient for orb fill
    ringColor: string        // rgba for concentric ring strokes
    sparkColor: string       // rising particle colour
    ticker: { bg: string; border: string; text: string }
    text: {
      tag: string            // small uppercase label above orb
      title: string          // main title (baby name / couple)
      couple: string         // couple name (muted)
      countdown: string      // countdown numbers
      countdownLabel: string // "days" / "hrs" / "min" labels
    }
    btn: { bg: string; border: string; text: string }
  }
  reveal: {
    pageBg: string
    orbGradient: string
    petalColors: string[]    // array of 6 colours for petal burst
    ticker: { bg: string; border: string; text: string }
    text: {
      tag: string            // "He/She has arrived"
      name: string           // baby name (large)
      stat: string           // DOB, weight, height (muted)
    }
    btn: { bg: string; border: string; text: string }
  }
  preview: { from: string; to: string }  // two-tone swatch for ThemePicker
  label: string
}

export const themes: Record<ThemeKey, ThemePalette> = {

  stellar: {
    label: 'Stellar',
    preview: { from: '#2d1b5e', to: '#f0a030' },
    announce: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #2d1b5e 0%, #080614 62%)',
      orbGradient: 'radial-gradient(circle at 36% 30%, #e2c8ff 0%, #9b6de4 28%, #5a1fb8 62%, #160830 100%)',
      ringColor: 'rgba(180,140,255,0.13)',
      sparkColor: '#c4a0f0',
      ticker: { bg: 'rgba(6,4,16,0.60)', border: 'rgba(180,140,255,0.12)', text: 'rgba(200,175,255,0.55)' },
      text: { tag: 'rgba(180,140,255,0.65)', title: '#e8d8ff', couple: 'rgba(200,170,255,0.38)', countdown: '#e8d8ff', countdownLabel: 'rgba(170,130,255,0.42)' },
      btn: { bg: 'rgba(170,130,255,0.08)', border: 'rgba(170,130,255,0.22)', text: 'rgba(210,185,255,0.55)' },
    },
    reveal: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #7c4a0a 0%, #130600 62%)',
      orbGradient: 'radial-gradient(circle at 38% 32%, #ffe8b0 0%, #f0a030 42%, #b06010 78%)',
      petalColors: ['#f0a030','#e87820','#ffc050','#ff9040','#f09030','#e8b840'],
      ticker: { bg: 'rgba(10,4,0,0.60)', border: 'rgba(240,160,48,0.14)', text: 'rgba(255,208,120,0.55)' },
      text: { tag: 'rgba(255,205,110,0.70)', name: '#fff8e8', stat: 'rgba(255,210,130,0.50)' },
      btn: { bg: 'rgba(255,195,70,0.09)', border: 'rgba(255,195,70,0.22)', text: 'rgba(255,220,130,0.65)' },
    },
  },

  bloom: {
    label: 'Bloom',
    preview: { from: '#0d3b2e', to: '#e0548a' },
    announce: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #0d3b2e 0%, #040f0a 62%)',
      orbGradient: 'radial-gradient(circle at 36% 30%, #b8f0d4 0%, #4db87a 28%, #1a6b3e 62%, #081c12 100%)',
      ringColor: 'rgba(77,184,122,0.13)',
      sparkColor: '#7dd4a0',
      ticker: { bg: 'rgba(4,9,6,0.60)', border: 'rgba(77,184,122,0.12)', text: 'rgba(160,220,185,0.55)' },
      text: { tag: 'rgba(77,184,122,0.65)', title: '#d8f4e8', couple: 'rgba(160,220,185,0.38)', countdown: '#d8f4e8', countdownLabel: 'rgba(77,184,122,0.42)' },
      btn: { bg: 'rgba(77,184,122,0.08)', border: 'rgba(77,184,122,0.22)', text: 'rgba(160,220,185,0.55)' },
    },
    reveal: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #6b1a3a 0%, #130006 62%)',
      orbGradient: 'radial-gradient(circle at 38% 32%, #ffb8d4 0%, #e0548a 42%, #8b1a4a 78%)',
      petalColors: ['#e0548a','#f07098','#ff90b0','#d04070','#e86888','#f884a0'],
      ticker: { bg: 'rgba(10,0,4,0.60)', border: 'rgba(224,84,138,0.14)', text: 'rgba(255,160,200,0.55)' },
      text: { tag: 'rgba(255,160,190,0.70)', name: '#fff0f6', stat: 'rgba(255,170,200,0.50)' },
      btn: { bg: 'rgba(224,84,138,0.09)', border: 'rgba(224,84,138,0.22)', text: 'rgba(255,160,200,0.65)' },
    },
  },

  dusk: {
    label: 'Dusk',
    preview: { from: '#3b0d1a', to: '#d4a060' },
    announce: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #3b0d1a 0%, #0f0408 62%)',
      orbGradient: 'radial-gradient(circle at 36% 30%, #f4c4d0 0%, #c45878 28%, #7a1a38 62%, #1e0810 100%)',
      ringColor: 'rgba(196,88,120,0.13)',
      sparkColor: '#e090a8',
      ticker: { bg: 'rgba(15,4,8,0.60)', border: 'rgba(196,88,120,0.12)', text: 'rgba(220,160,180,0.55)' },
      text: { tag: 'rgba(196,88,120,0.65)', title: '#f4d8e0', couple: 'rgba(220,160,180,0.38)', countdown: '#f4d8e0', countdownLabel: 'rgba(196,88,120,0.42)' },
      btn: { bg: 'rgba(196,88,120,0.08)', border: 'rgba(196,88,120,0.22)', text: 'rgba(220,160,180,0.55)' },
    },
    reveal: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #6b4a1a 0%, #130a00 62%)',
      orbGradient: 'radial-gradient(circle at 38% 32%, #f8e4c0 0%, #d4a060 42%, #8b6020 78%)',
      petalColors: ['#d4a060','#e8b870','#f0c880','#c49050','#daa868','#e8c070'],
      ticker: { bg: 'rgba(10,6,0,0.60)', border: 'rgba(212,160,96,0.14)', text: 'rgba(255,215,150,0.55)' },
      text: { tag: 'rgba(255,210,140,0.70)', name: '#fff8f0', stat: 'rgba(255,215,160,0.50)' },
      btn: { bg: 'rgba(212,160,96,0.09)', border: 'rgba(212,160,96,0.22)', text: 'rgba(255,215,150,0.65)' },
    },
  },

  nebula: {
    label: 'Nebula',
    preview: { from: '#0a1535', to: '#a868e0' },
    announce: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #0a1535 0%, #040810 62%)',
      orbGradient: 'radial-gradient(circle at 36% 30%, #c8d8ff 0%, #6888e4 28%, #2038b8 62%, #080c30 100%)',
      ringColor: 'rgba(104,136,228,0.13)',
      sparkColor: '#8098e0',
      ticker: { bg: 'rgba(4,8,16,0.60)', border: 'rgba(104,136,228,0.12)', text: 'rgba(160,185,240,0.55)' },
      text: { tag: 'rgba(104,136,228,0.65)', title: '#d8e4ff', couple: 'rgba(160,185,240,0.38)', countdown: '#d8e4ff', countdownLabel: 'rgba(104,136,228,0.42)' },
      btn: { bg: 'rgba(104,136,228,0.08)', border: 'rgba(104,136,228,0.22)', text: 'rgba(160,185,240,0.55)' },
    },
    reveal: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #3d1a6b 0%, #0d0618 62%)',
      orbGradient: 'radial-gradient(circle at 38% 32%, #e8d0ff 0%, #a868e0 42%, #5820a0 78%)',
      petalColors: ['#a868e0','#c088f0','#d0a0ff','#9050c8','#b070e8','#c890f8'],
      ticker: { bg: 'rgba(8,4,14,0.60)', border: 'rgba(168,104,224,0.14)', text: 'rgba(210,170,255,0.55)' },
      text: { tag: 'rgba(210,170,255,0.70)', name: '#f8f0ff', stat: 'rgba(215,180,255,0.50)' },
      btn: { bg: 'rgba(168,104,224,0.09)', border: 'rgba(168,104,224,0.22)', text: 'rgba(210,170,255,0.65)' },
    },
  },

  ember: {
    label: 'Ember',
    preview: { from: '#1a1408', to: '#e87820' },
    announce: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #1a1408 0%, #080604 62%)',
      orbGradient: 'radial-gradient(circle at 36% 30%, #f0e8c0 0%, #c8a840 28%, #785818 62%, #1e1408 100%)',
      ringColor: 'rgba(200,168,64,0.13)',
      sparkColor: '#d8b84a',
      ticker: { bg: 'rgba(8,6,4,0.60)', border: 'rgba(200,168,64,0.12)', text: 'rgba(220,195,120,0.55)' },
      text: { tag: 'rgba(200,168,64,0.65)', title: '#f0e8d0', couple: 'rgba(220,195,120,0.38)', countdown: '#f0e8d0', countdownLabel: 'rgba(200,168,64,0.42)' },
      btn: { bg: 'rgba(200,168,64,0.08)', border: 'rgba(200,168,64,0.22)', text: 'rgba(220,195,120,0.55)' },
    },
    reveal: {
      pageBg: 'radial-gradient(ellipse at 50% 18%, #6b2808 0%, #130600 62%)',
      orbGradient: 'radial-gradient(circle at 38% 32%, #ffcc90 0%, #e87820 42%, #a04010 78%)',
      petalColors: ['#e87820','#f09040','#ffb060','#d06010','#e88030','#f8a050'],
      ticker: { bg: 'rgba(10,4,0,0.60)', border: 'rgba(232,120,32,0.14)', text: 'rgba(255,185,100,0.55)' },
      text: { tag: 'rgba(255,180,90,0.70)', name: '#fff4e8', stat: 'rgba(255,185,110,0.50)' },
      btn: { bg: 'rgba(232,120,32,0.09)', border: 'rgba(232,120,32,0.22)', text: 'rgba(255,185,100,0.65)' },
    },
  },
}
```

---

## Auth System

### Email OTP — No passwords

**Send OTP** `POST /api/auth/send-otp`
- Body: `{ email: string }`
- Generate 6-digit OTP with `crypto.randomInt(100000, 999999)`
- Hash with bcryptjs (rounds: 10)
- Upsert in `otpCodes` with TTL 600 and `consumed: false, attempts: 0`
- Rate limit: reject if 3+ unexpired codes exist for this email in the last hour
- Send OTP email via Resend
- Response: `{ success: true }` (never expose whether email exists)

**Verify OTP** `POST /api/auth/verify-otp`
- Body: `{ email: string, otp: string }`
- Find latest unexpired, unconsumed code for email
- If `attempts >= 5` → return 429
- Increment `attempts` on each try
- `bcrypt.compare(otp, codeHash)` — on match: mark `consumed: true`
- Upsert user in `users` (create if new, update `lastLoginAt` if existing)
- Set iron-session cookie: `{ userId, email }`, 7-day maxAge
- Response: `{ success: true, isNewUser: boolean }`

**Session** `src/lib/auth.ts`
```typescript
import { getIronSession } from 'iron-session'
import type { SessionData } from '@/types'

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: 'velli-session',
  cookieOptions: { secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 },
}

export async function getSession(req: Request, res: Response) {
  return getIronSession<SessionData>(req, res, sessionOptions)
}
```

---

## Feature Specifications

### Page Creation (multi-step)

Step 1 — Basics: couple name, announcement title, message to visitors, due date  
Step 2 — Theme: ThemePicker — 5 circular swatches (left half = announce colour, right half = reveal colour)  
Step 3 — Photo: optional upload to Azure Blob Storage, max 5MB, JPEG/PNG/WebP only  
Step 4 — Preview + publish: show a live mini-preview of the announcement page  

On submit:
- Generate slug via nanoid (8 chars): check uniqueness against Cosmos, regenerate if collision
- Create page document with `status: 'active'`, `phase: 'announcement'`
- Redirect to `/dashboard/[slug]`

### Page Deactivation

- Dashboard toggle: "Active / Deactivated" (DeactivateToggle component)
- `POST /api/pages/[id]/deactivate` — body: `{ active: boolean }`
- Sets `page.status = active ? 'active' : 'deactivated'`
- Public page `app/p/[slug]/page.tsx`:
  - If `status === 'deactivated'` → render `<DeactivatedScreen theme={page.theme} />`
  - DeactivatedScreen: full-screen, theme's announce `pageBg`, centred message "This celebration page is no longer available" — no subscribe form, no content
- Deactivation preserves all data. Can be re-activated at any time.
- A revealed page can also be deactivated (e.g. parents want privacy after a while)

### Reveal Publishing

Route: `/dashboard/[id]/reveal`

Form fields:
- Baby name (text, optional — toggle "reveal name later" if parents want staged reveal)
- Gender (radio: Boy / Girl / Prefer not to say)
- Date of birth (date picker)
- Time of birth (time input, optional)
- Weight (text: "3.2 kg", optional)
- Height (text: "51 cm", optional)
- Message from parents (textarea)
- Photos (up to 5, Azure Blob upload)

"Publish reveal" button:
- Shows confirmation dialog: "This will notify [N] subscribers by email. Once published, the page becomes the reveal. Are you sure?"
- On confirm: `POST /api/pages/[id]/reveal`
- Server action: update `page.phase = 'reveal'`, `page.status = 'revealed'`, `page.revealedAt = now()`
- Immediately calls `POST /api/notify` with `{ pageId }` (internal)
- `/api/notify` fetches all confirmed subscribers, sends reveal email to each, logs in `emailLog`

### Subscriber Flow

1. Visitor lands on active announcement page
2. Enters email in SubscribeForm → `POST /api/subscribers`
   - Server creates subscriber with `confirmed: false`, generates `confirmToken`
   - Sends confirmation email with link: `APP_URL/p/[slug]/confirm?token=[confirmToken]`
   - Response: show "Check your inbox to confirm your subscription"
3. Visitor clicks link → `app/p/[slug]/confirm/page.tsx`
   - Calls `GET /api/subscribers/confirm?token=[token]`
   - Sets `confirmed: true`
   - Shows: "You're confirmed! We'll email you when the baby arrives." — styled in page theme
4. On reveal: only `confirmed: true, notified: false` subscribers receive email

### Ticker Messages

- Parent posts from `/dashboard/[id]/messages`
- Max 10 active messages per page (enforce server-side)
- Max 80 chars per message
- Messages ordered by `createdAt` ascending in the ticker
- Public page fetches messages via `GET /api/messages?pageId=[id]`
- TickerBand polls every 60 seconds with `setInterval` (client component)
- Parent can delete individual messages — ticker updates on next poll
- Separator between messages: `  ✦  ` (matches theme colour)

---

## Public Celebration Page

`app/p/[slug]/page.tsx` is a **server component**.
It fetches the page document, then renders based on status.

```typescript
// Pseudocode
const page = await getPageBySlug(slug)
if (!page) notFound()
if (page.status === 'deactivated') return <DeactivatedScreen theme={page.theme} />

// Pass to client component
return <CelebrationPage page={page} />
```

### CelebrationPage (client component)

- Handles the announcement → reveal visual transition
- If `page.phase === 'reveal'`:
  - Check `localStorage.getItem('velli-bloomed-[slug]')`
  - If not set: show RevealTrigger (sealed state with "Tap to reveal")
  - On tap (or after 4s auto-trigger): fire PetalBurst, name typewriter, stats fade-in, set localStorage flag
  - If already set: show fully-bloomed reveal state immediately
- White flash on transition: `position: absolute; inset: 0; background: white; opacity: 0; transition: opacity 0.5s` — add class to trigger

### Layout rules

- Mobile-first, max-width 390px for the page column
- On desktop: centre the 390px column, fill remaining width with blurred/darkened version of the same `pageBg` (use `backdrop-filter` or a scaled-up blurred copy)
- No horizontal scroll
- TickerBand is `position: absolute; bottom: 0; left: 0; right: 0; height: 32px`
- Content area has `padding-bottom: 52px` so ticker doesn't overlap subscribe button

### OrbPulse animation keyframes

```css
@keyframes heartbeat {
  0%,  100% { transform: scale(1); }
  14%        { transform: scale(1.055); }
  28%        { transform: scale(1); }
  42%        { transform: scale(1.030); }
  70%        { transform: scale(1); }
}
/* Duration: 1.1s, ease-in-out, infinite */
```

Two concentric rings with `animation: ring-pulse 2.4s ease-in-out infinite`:
```css
@keyframes ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50%       { transform: scale(1.05); opacity: 1; }
}
```

### StarField animation

- 8–12 twinkling dots: `position: absolute`, CSS custom properties `--lo` (min opacity), `--hi` (max opacity), `--d` (duration), `--dl` (delay)
- 4–6 rising sparks starting from `bottom: 32px` (above ticker):
  ```css
  @keyframes rise {
    0%   { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
    8%   { opacity: 0.9; }
    92%  { opacity: 0.1; }
    100% { transform: translateY(-520px) translateX(var(--dx)) scale(0.3); opacity: 0; }
  }
  ```

### TickerBand

Duplicate content spans for seamless CSS loop:
```css
@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
/* Duration: 24s, linear, infinite */
```
Two identical `<span>` elements side by side inside `.ticker-inner`.
When messages update (after poll), update `textContent` on both spans.

### PetalBurst (Web Animations API)

```typescript
// 12 petals, each rotated around orb centre
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * 360
  const radius = 46 + Math.random() * 14
  petal.animate([
    { transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg) scaleY(0)`, opacity: 0 },
    { transform: `translateX(-50%) translateY(calc(-100% - ${radius}px)) rotate(${angle}deg) scaleY(1)`, opacity: 0.88 }
  ], { duration: 950, delay: 50 + i * 38, fill: 'forwards', easing: 'cubic-bezier(0.15, 0.85, 0.25, 1)' })
}
```

---

## Dashboard UI

Design: clean, Inter font, white/light surfaces. The drama lives on the public page, not the CMS.
Use Tailwind for all dashboard styling.

### `/dashboard` — Page list

- Header: "Your pages" + "Create new page" button
- Grid of `PageCard` components
- PageCard shows: page title, status badge (Active / Revealed / Deactivated), theme colour dot, subscriber count, "View page" link, "Manage" link
- Empty state: illustration + "Create your first celebration page"

### `/dashboard/create` — Multi-step creation

4 steps with progress indicator (Step 1 of 4).
Step navigation: Next / Back buttons.
Form state managed with React `useState` — only POST to API on final step.

ThemePicker component: horizontal row of 5 circular swatches (48px diameter).
Each swatch: left half in `preview.from` colour, right half in `preview.to` colour, split diagonally.
Selected swatch has a 2px ring in the from-colour.
Theme label shows below selected swatch.

### `/dashboard/[id]` — Management hub

Sections:
1. **Share** — page URL with copy button, WhatsApp share button (`https://wa.me/?text=...`), QR code download
2. **Stats** — subscriber count, message count
3. **Reveal** — "Baby arrived? Fill the reveal details →" CTA (if phase is announcement). "Reveal published ✦" badge (if revealed).
4. **Messages** — link to `/dashboard/[id]/messages`
5. **Settings** — Edit announcement, Change theme, Deactivate toggle
6. **Danger** — Delete page (confirmation required: type page slug to confirm)

### WhatsApp share button

```typescript
const text = encodeURIComponent(
  `${page.announcement.coupleName} are expecting! See our announcement page: ${APP_URL}/p/${page.id}`
)
const url = `https://wa.me/?text=${text}`
// Open in new tab
```

---

## API Routes — Full Spec

All protected routes: call `getSession()`, return 401 if `!session.userId`.
Owner-only routes: verify `page.ownerId === session.userId`, return 403 otherwise.

### `POST /api/auth/send-otp`
Public. Rate-limited. Sends OTP email. Always returns 200 (no email enumeration).

### `POST /api/auth/verify-otp`
Public. Returns 429 on max attempts. Sets session cookie on success.

### `POST /api/auth/logout`
Protected. Destroys session.

### `GET /api/pages`
Protected. Returns all pages where `ownerId = session.userId`.
Query: `SELECT * FROM c WHERE c.ownerId = @ownerId` (cross-partition, indexed).

### `POST /api/pages`
Protected. Creates page. Generates slug (collision-check loop). Returns new page.

### `GET /api/pages/[id]`
Protected, owner only. Returns page document.

### `PUT /api/pages/[id]`
Protected, owner only. Updates announcement content or theme. Cannot change phase/status via this route.

### `DELETE /api/pages/[id]`
Protected, owner only. Also deletes all subscribers, messages, emailLog for this page.

### `POST /api/pages/[id]/reveal`
Protected, owner only. Body: reveal fields. Updates page document. Calls `/api/notify` internally.

### `POST /api/pages/[id]/deactivate`
Protected, owner only. Body: `{ active: boolean }`. Toggles `page.status`.

### `POST /api/subscribers`
Public. Body: `{ pageId, email }`.
- Check page exists and is active
- Check no existing subscriber with this email for this page
- Create subscriber, send confirmation email
- Increment `page.subscriberCount`

### `GET /api/subscribers/confirm`
Public. Query: `?token=`.
- Find subscriber by `confirmToken`
- Set `confirmed: true`
- Redirect to `/p/[slug]/confirm` (confirmation landing page)

### `GET /api/messages`
Public. Query: `?pageId=`.
Returns messages ordered by `createdAt` ascending.

### `POST /api/messages`
Protected, owner only. Body: `{ pageId, text }`.
- Check count < 10, text length <= 80
- Create message

### `DELETE /api/messages/[id]`
Protected, owner only. Verify message belongs to owner's page before deleting.

### `POST /api/notify`
Internal (called server-side only, not exposed as a public endpoint — use a shared secret header).
Body: `{ pageId }`.
- Fetch all `confirmed: true, notified: false` subscribers for page
- Batch send reveal emails via Resend
- On each success: set `notified: true`, create `emailLog` record

---

## Email Templates

Keep emails minimal and on-brand. Dark background, theme accent colour.
Use Resend's React email or plain HTML strings.

### OTP Email
- Subject: `Your velli code: [OTP]`
- Body: Large 6-digit code, "Expires in 10 minutes", "If you didn't request this, ignore this email."

### Subscription Confirmation
- Subject: `Confirm your notification for [couple name]'s announcement`
- Body: "[Couple name] would love to let you know when their baby arrives. Confirm below."
- CTA: "Confirm my email" → confirm URL

### Reveal Notification
- Subject: `[Baby name] has arrived! ✦`  (or "A baby has arrived! ✦" if name is still hidden)
- Body: "[Couple name] are overjoyed to share the news. Open the celebration page for the full reveal."
- CTA: "See the reveal" → page URL

---

## lib/cosmos.ts

```typescript
import { CosmosClient } from '@azure/cosmos'

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
})

const db = client.database(process.env.COSMOS_DATABASE ?? 'velli')

export const containers = {
  users:       () => db.container('users'),
  pages:       () => db.container('pages'),
  otpCodes:    () => db.container('otpCodes'),
  subscribers: () => db.container('subscribers'),
  messages:    () => db.container('messages'),
  emailLog:    () => db.container('emailLog'),
} as const

type ContainerName = keyof typeof containers

// Point read (requires partition key = id for most containers)
export async function getById<T>(
  c: ContainerName, id: string, partitionKey?: string
): Promise<T | null> {
  try {
    const { resource } = await containers[c]()
      .item(id, partitionKey ?? id)
      .read<T>()
    return resource ?? null
  } catch { return null }
}

// SQL query
export async function query<T>(
  c: ContainerName,
  sql: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  const { resources } = await containers[c]().items.query<T>({
    query: sql,
    parameters: Object.entries(params).map(([name, value]) => ({ name: `@${name}`, value })),
  }).fetchAll()
  return resources
}

// Upsert
export async function upsert<T>(c: ContainerName, item: T): Promise<T> {
  const { resource } = await containers[c]().items.upsert<T>(item)
  return resource!
}

// Delete
export async function deleteItem(c: ContainerName, id: string, partitionKey?: string) {
  await containers[c]().item(id, partitionKey ?? id).delete()
}
```

---

## Build Phases (follow this order)

### Phase 1 — Foundation
- [ ] `npx create-next-app@latest velli --typescript --tailwind --app`
- [ ] Install dependencies: `@azure/cosmos`, `iron-session`, `bcryptjs`, `nanoid`, `resend`, `qrcode`, `@azure/storage-blob`
- [ ] Create `.env.local` with all variables
- [ ] `src/lib/cosmos.ts` — client + helpers
- [ ] `src/lib/themes.ts` — all 5 theme definitions
- [ ] `src/lib/auth.ts` — iron-session config
- [ ] `src/lib/otp.ts` — generate 6-digit OTP, bcrypt hash/compare
- [ ] `src/lib/slug.ts` — nanoid slug with Cosmos uniqueness check
- [ ] `src/lib/email.ts` — Resend wrapper for all 3 email types
- [ ] `src/types/index.ts` — all TypeScript interfaces

### Phase 2 — Auth
- [ ] `POST /api/auth/send-otp`
- [ ] `POST /api/auth/verify-otp`
- [ ] `POST /api/auth/logout`
- [ ] `/login` page — email input, clean Inter UI
- [ ] `/verify` page — OtpInput component (6 auto-advancing boxes)
- [ ] Dashboard layout — server-side session check, redirect to /login

### Phase 3 — Dashboard + Page CRUD
- [ ] All `/api/pages` routes
- [ ] `/dashboard` — page list with PageCard
- [ ] `/dashboard/create` — multi-step with ThemePicker
- [ ] `/dashboard/[id]` — management hub
- [ ] `/dashboard/[id]/edit` — update announcement content

### Phase 4 — Public Celebration Page
- [ ] `StarField.tsx` — pure CSS, theme-aware props
- [ ] `OrbPulse.tsx` — heartbeat + rings, theme-aware
- [ ] `Countdown.tsx` — live client-side countdown
- [ ] `TickerBand.tsx` — CSS marquee, polls `/api/messages`, theme-aware
- [ ] `SubscribeForm.tsx` + `/api/subscribers` + `/api/subscribers/confirm`
- [ ] `AnnouncementPhase.tsx` — compose above components
- [ ] `DeactivatedScreen.tsx`
- [ ] `app/p/[slug]/page.tsx` — server component
- [ ] `app/p/[slug]/confirm/page.tsx`

### Phase 5 — Reveal System
- [ ] `PetalBurst.tsx` — Web Animations API
- [ ] `RevealTrigger.tsx` — localStorage, tap-to-bloom, 4s auto-trigger
- [ ] `RevealPhase.tsx` — warm palette, name typewriter, stats fade-in
- [ ] `/dashboard/[id]/reveal` — reveal form with photo upload
- [ ] `POST /api/pages/[id]/reveal` + `POST /api/notify`
- [ ] Reveal notification email

### Phase 6 — Messages + Ticker
- [ ] All `/api/messages` routes
- [ ] `/dashboard/[id]/messages` — management page with 80-char limit, delete
- [ ] Wire TickerBand to live API (60s poll)

### Phase 7 — Polish + Production
- [ ] `POST /api/pages/[id]/deactivate`
- [ ] Azure Blob Storage upload in create + reveal forms
- [ ] QR code generation on dashboard
- [ ] OG meta tags for `/p/[slug]` (for WhatsApp link preview — use page title + couple name)
- [ ] Rate limiting on OTP routes (simple in-memory or Cosmos-based counter)
- [ ] Mobile responsiveness pass (390px column, desktop blurred-bg wrapper)
- [ ] Error boundaries on celebration page
- [ ] Delete page with cascade (subscribers, messages, emailLog)

---

## Important Implementation Notes

1. **No Framer Motion on the celebration page.** All animations are raw CSS
   keyframes or Web Animations API. The page must feel fast on mobile on a
   3G connection.

2. **The page is mobile-first.** Design for 390px width. On wider screens,
   centre the column and fill with a blurred + darkened version of `pageBg`.

3. **RevealTrigger localStorage key:** `velli-bloomed-${slug}`. Check on mount —
   if set, skip the sealed state and render the fully-bloomed reveal immediately.

4. **Ticker duplication:** Both `<span>` elements in `.tick-inner` must have
   identical content. When updating after an API poll, update both synchronously
   before the next animation frame to avoid a visible jump.

5. **Cosmos cross-partition queries on pages:** The dashboard queries all pages
   by `ownerId`. Ensure the `pages` container has an index on `/ownerId`.
   In the Azure portal: Container → Settings → Indexing Policy → add
   `{ "path": "/ownerId/?", "indexes": [{ "kind": "Range", "dataType": "String" }] }`.

6. **OTP security:**
   - Never return whether an email address exists in the system.
   - Always return `{ success: true }` from `send-otp` regardless.
   - Increment `attempts` BEFORE comparing — prevents timing attacks where
     an attacker abandons after no increment.

7. **Slug uniqueness:** nanoid 8-char URL-safe (A-Za-z0-9_-) gives 64^8 ≈ 281T
   combinations. Collision probability is negligible but still do a point read
   to check before creating.

8. **Photo uploads:** Upload to Azure Blob directly from the API route (stream
   from formData). Generate a UUID filename. Return the Blob URL. Store in
   page document. Don't use presigned URLs for MVP — keep it simple.

9. **OG image for WhatsApp preview:** At minimum, set `<meta property="og:title">`,
   `<meta property="og:description">`, and `<meta property="og:image">` in the
   `/p/[slug]` page. The OG image can be a simple dynamically-generated image
   via `next/og` (ImageResponse) showing the couple name and theme colour.

10. **Revalidation:** After reveal is published, call `revalidatePath('/p/[slug]')`
    so the Next.js cache is invalidated and the next visitor gets fresh data.
