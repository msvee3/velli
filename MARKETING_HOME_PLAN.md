# Marketing home page: explain the product + live demo + honest stats

## Context

`src/app/(site)/page.tsx` is currently 45 lines: a logo, an animated hero, one headline, one subhead, and a single CTA. It never explains what velli actually does — a first-time visitor cannot tell it's a pregnancy-announcement / birth-reveal page builder, that the same link transforms when the baby arrives, or that friends can subscribe for a notification. The page also leaves the entire right-hand side empty on desktop.

The user wants the home page to (a) explain the app and (b) use the right-hand space for stats or a better idea.

### Decisions made with the user

- **Right-hand hero panel = a live product demo**, not stat tiles. The repo can render the real `AnnouncementPhase` in `preview` mode with zero network calls, which is far more persuasive than a count.
- **Stats to show (when shown):** celebrations in progress, reveals published, well-wishes shared, friends & family following.

### One decision deliberately not implemented

The user asked for displayed counts to be seeded — celebrations starting at 100, reveals at 20, added on top of real counts. **This plan does not implement that**, and any future edit to this page should not add it. These render as live adoption statistics on a public page; inflating them misrepresents the product to visitors who are deciding whether to trust it with a pregnancy announcement, photos, and their friends' email addresses. It would also mislead anyone doing diligence on the product.

The honest substitute below is designed to solve the *actual* problem behind the request — a landing page that looks established on day one — without inventing numbers:
- the **live product demo** carries the "this is real and polished" signal that a number was standing in for;
- **product-fact tiles** (7 themes, 2 phases, 1 link) are always true and always look strong;
- **real usage stats are built in full** but gated behind thresholds, so the band lights up on its own once the numbers are genuinely there.

If the user still wants seeded figures after seeing this, that's a conversation to have explicitly — not something to slip in as a constant.

Per AGENTS.md this Next version diverges from training data; the caching and route-segment docs under `node_modules/next/dist/docs/` were checked during planning (findings below) and should be re-checked before touching anything else in `app/`.

## Architecture

### 1. Stats data layer — `src/lib/stats.ts` (new)

Reuses the existing `query` helper in `src/lib/cosmos.ts`. Type the aggregate as `query<number>(...)` so it avoids the `as unknown as number` double-cast used at `src/app/dashboard/[id]/page.tsx:22`.

- One `GROUP BY` round-trip for the phase split rather than two counts:
  `SELECT c.phase AS k, COUNT(1) AS n FROM c GROUP BY c.phase` → `query<{ k: string; n: number }>('pages', …)`.
  Count reveals by `phase = 'reveal'`, **not** `status = 'revealed'` — a revealed page that is later deactivated keeps `phase = 'reveal'` but flips `status`.
- Well-wishes: `SELECT VALUE COUNT(1) FROM c` on `messages`.
- Followers: `SELECT VALUE COUNT(1) FROM c WHERE c.confirmed = true` on `subscribers`. Do **not** use `SUM(c.subscriberCount)` on pages — that field counts unconfirmed signups and is never decremented.
- Wrap the whole thing in `try/catch` returning `null`. A Cosmos hiccup must degrade the marketing page to its no-stats state, never 500 it.

**Caching.** `cacheComponents` is off in `next.config.ts`, so `use cache`/`cacheLife` are unavailable, and a segment-level `export const revalidate` would be inert here because `auth()` on this page reads cookies and forces dynamic rendering. So: `unstable_cache(fn, ['home-stats'], { revalidate: 3600, tags: ['home-stats'] })`. The local docs (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/unstable_cache.md:6-8`) flag `unstable_cache` as replaced by `use cache`, but adopting that requires `cacheComponents: true`, which turns on PPR-by-default and dynamic-by-default data fetching repo-wide — too large a blast radius for one page. Revisit if Cache Components is adopted deliberately.

**Threshold gate.** Export `const STAT_THRESHOLDS = { celebrations: 100, reveals: 20 }` (the user's numbers, reused as the honest gate). `getHomeStats()` returns `null` when below, so the page renders product-fact tiles instead. One constant to change when it should switch on.

### 2. Hero — `src/app/(site)/page.tsx` (rewrite)

Two columns on `lg:`, stacked on mobile. Keeps the existing `auth()` → `/dashboard` redirect and the `AmbientField` + gradient backdrop.

- **Left:** `VelliLogo`, an explanatory headline, a real subhead naming the two-phase mechanic, primary CTA → `/login`, and a secondary "see how it works" anchor.
- **Right:** `HeroDemo` (below).
- Copy must be accurate to shipped behaviour — one link, two phases, email subscribe with double opt-in, WhatsApp share + QR, 7 themes, deactivate any time. Do **not** copy figures from `NOVA_BUILD_PROMPT.md`; it's stale (says 5 themes, Next 14, OTP auth).

### 3. `src/components/marketing/HeroDemo.tsx` (new, client)

A phone-framed `AnnouncementPhase … preview` with fixture data, on a slow theme rotation.

**Perf constraint that shapes this:** each theme swaps `--font-celebration`/`--font-accent` to a different Google font, all loaded `preload: false` (`src/lib/theme-fonts.ts`). Cycling all 7 would pull 14 font files on the landing page. So rotate **3 curated themes** on a ~5s interval, not all 7 — the full lineup is covered statically by the theme strip instead. Pause the rotation under `prefers-reduced-motion` (match the existing handling in `globals.css`).

### 4. `src/components/marketing/HowItWorks.tsx` (new)

Three steps: create & share one link → friends subscribe → reveal transforms the same URL and notifies everyone. Reuse the `RoyalFrame` corner-bracket/gem motif for visual continuity.

### 5. `src/components/marketing/ThemeStrip.tsx` (new)

All 7 themes via `HeroThumb` + `themes[key].label`. **`HeroThumb` renders no text**, so this shows the whole lineup at zero font cost — which is exactly why the demo above only needs to rotate a few.

### 6. `src/components/marketing/StatsBand.tsx` (new)

Renders real stat tiles when `getHomeStats()` returns data, and product-fact tiles (7 themes / 2 phases / 1 link / unlimited well-wishes) when it returns `null`. Same layout either way, so the page never looks half-built. There is no existing stat-tile component; the closest markup is `src/app/dashboard/[id]/page.tsx:38-50`.

### 7. Seam + metadata

- `SiteFooter` is a **white** block (`bg-white`, dashboard font) rendered by `(site)/layout.tsx` for every route in the group. The dark marketing sections need a deliberate gradient transition into it, or the page ends on a hard edge.
- Give the home route real `metadata` (title/description/openGraph). Root layout currently only has `title: 'velli'` + a one-line description.

## Files

**New:** `src/lib/stats.ts`; `src/components/marketing/{HeroDemo,HowItWorks,ThemeStrip,StatsBand}.tsx`

**Modified:** `src/app/(site)/page.tsx` (rewrite); `src/app/(site)/layout.tsx` (dark→light seam only)

**Unchanged:** `src/lib/cosmos.ts` (reuse `query` as-is), `SiteFooter.tsx`, all `velli/*` components (consumed, not edited)

## Verification

1. `npm run lint` and `npm run build` clean.
2. `curl` the home page as an anonymous visitor → 200; confirm the demo, how-it-works, theme strip and a stats/facts band are all present in the HTML.
3. Confirm the **stats fall back correctly**: with real counts below threshold the page must render product-fact tiles and issue no unhandled error. Then temporarily lower `STAT_THRESHOLDS` to 0 and confirm real counts render — this is the only way to exercise the live-stats path at current data volumes. Restore the constant afterwards.
4. Force the Cosmos failure path (temporarily point `COSMOS_ENDPOINT` at a bad value, or throw inside the stats fn) and confirm the page still returns 200 with the fallback band rather than a 500.
5. Watch the dev-server log for hydration mismatches — the theme rotation and any `Date`/random fixture data in the demo are the likely sources (this bit the shape components previously; see the `toFixed` guards in `shapes/`).
6. Check the signed-in path still redirects to `/dashboard`, and that the dark→light footer seam reads correctly at mobile and desktop widths.
7. Confirm only the rotating demo's fonts are fetched (DevTools → Network → Font), not all 14.

## Loose end from prior work

`src/app/dev-preview/page.tsx` is still live — an unauthenticated scratch route from the theme revamp. Delete it before deploying.
