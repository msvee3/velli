# velli

<<<<<<< README.md
A celebration page for pregnancy announcements and birth reveals — built with
Next.js 16 (App Router), Azure Cosmos DB, Azure Blob Storage, Resend, and
Google sign-in via NextAuth (Auth.js v5).

See [NOVA_BUILD_PROMPT.md](NOVA_BUILD_PROMPT.md) for the full product spec.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the template and fill in real values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `COSMOS_ENDPOINT`, `COSMOS_KEY` | Azure Portal → your Cosmos DB account → Keys |
| `COSMOS_DATABASE` | Defaults to `velli` — only change if you renamed it |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `EMAIL_FROM` | A verified sender/domain in Resend |
| `FEEDBACK_TO_EMAIL` | Inbox that should receive footer feedback submissions |
| `APP_URL` | `http://localhost:3000` locally; your real domain in production |
| `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER` | Azure Portal → your Storage account → Access keys |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `AUTH_URL` | Same as `APP_URL` |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth 2.0 Client ID (web application). Add `${APP_URL}/api/auth/callback/google` as an authorized redirect URI |
| `NOTIFY_SECRET` | Any random string — protects the internal `/api/notify` route |

### 3. Create the Cosmos database + containers

The app expects these containers to already exist (partition keys matter for
the point-read performance the app relies on):

| Container | Partition key |
|---|---|
| `velli_users` | `/id` |
| `velli_pages` | `/id` |
| `velli_subscribers` | `/pageId` |
| `velli_messages` | `/pageId` |
| `velli_emailLog` | `/pageId` |
| `velli_feedback` | `/id` |

You can create them by hand in the Azure Portal, or call the bootstrap helper
once from a scratch script/REPL with your `.env.local` loaded:

```ts
import { ensureDatabase } from '@/lib/cosmos'
await ensureDatabase()
```

Also add a range index on `velli_pages./ownerId` (Container → Settings → Indexing
Policy) so the dashboard's cross-partition "my pages" query stays fast:

```json
{ "path": "/ownerId/?", "indexes": [{ "kind": "Range", "dataType": "String" }] }
```

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`, sign in with Google, and create your first page.

## Notes for production

- **`AZURE_STORAGE_CONTAINER`** is created automatically on first upload with
  public blob access — if your org's policy blocks anonymous blob access,
  create it manually with the appropriate access level first.
- **Azure Blob hostname** for uploaded photos must match `next.config.ts`'s
  `images.remotePatterns` (`*.blob.core.windows.net` is already allowed).
- **`NOTIFY_SECRET`** must be set in every environment that calls
  `/api/pages/[id]/reveal` — without it, reveal emails silently fail to send
  (the page still publishes; only the notification step is skipped).
=======
