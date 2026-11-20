# Phase 02 — Public live reads

**Goal:** the public site renders published content from Postgres through one cached API
endpoint, with a last-good browser fallback. Pages and their state system stay unchanged.

**Prerequisites:** Phase 01 committed and seeded; Vercel environment variables set.

## Steps

- [ ] **1. Write `api/content.ts`** (Vercel Node function, TypeScript).
  - Creates a Supabase client from `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
    (server-only values).
  - Reads `pages`, `services`, `plans`, `faqs`, `projects`, `testimonials`, `team`,
    `gallery`, `seo`, `site` — snake_case → camelCase mapping in one shared module
    (`api/_lib/map.ts`) reused by phase 03.
  - Filters server-side: `isPublished` for services, plans, faqs, projects, team,
    gallery; `status === 'approved' && isPublished` for testimonials; ordered by
    `display_order`.
  - Returns one JSON payload shaped exactly like today's public `current` object
    (`site`, `pages`, `services`, `plans`, `faqs`, `projects`, `testimonials`, `team`,
    `gallery`, `seo` as a keyed map).
  - Sets `Cache-Control: public, s-maxage=60, stale-while-revalidate=86400`.
  - On error: log the real error server-side, return `500` with `{ "error": "content
    unavailable" }` — no internals in the body.

- [ ] **2. Write `src/data/content-store.ts`.**
  - `loadContent(): Promise<void>` fetches `/api/content` with an 8-second timeout.
  - Success: hydrate module state, then persist the raw payload to localStorage key
    `ordacy-content:v1`.
  - Failure: read the cached payload; if present, hydrate from it and continue (log a
    console warning); if absent, rethrow.
  - Ordering (`displayOrder`) and icon resolution (`resolveIcon`) happen here, once,
    for every hydrated collection — mirroring today's exports. Unknown icon names fall
    back safely as `states.json` already does.

- [ ] **3. Convert `src/data/index.ts`.**
  - Static imports stay build-time: `problems`, `process`, `legal`, `states`,
    `admin-navigation`.
  - Editable collections become live-binding exports (`export let site`, `pages`,
    `services`, `plans`, `faqs`, `projects`, `testimonials`, `team`, `gallery`, `seo`)
    assigned by the content store. `getPage`, `getSection`, `sectionCopy`,
    `closingCta`, `teamMemberBySlug` read the hydrated values at call time and keep
    their current behavior and error messages.
  - Keep the `seed` export untouched this phase (the admin still uses it until phase 03).

- [ ] **4. Wire the bootstrap in `src/main.tsx`.**
  - Render the existing standalone `RouteLoading` immediately (it needs no data and no
    router) while `loadContent()` runs.
  - On success: `createRoot(...).render(<StrictMode><App /></StrictMode>)`.
  - On failure with no cache: render the standalone `RouteErrorPage` instead.
  - Keep the scroll-restoration line as-is.

- [ ] **5. Verify no page needed changes.** Every page already reads `@/data` exports;
  `PageState` empty guards now react to real API data. Do not edit pages in this phase.

## Verification

- [ ] `npx vercel dev` serves app + `/api/content`. All 11 public routes render real
  content from Postgres at 320, 380, 768, 1440.
- [ ] Edit one row in the Supabase Table Editor (e.g., an FAQ answer) and confirm the
  public page shows it within ~60 seconds.
- [ ] Unpublish a service in the table and confirm it disappears from public reads
  (server-side filter proof).
- [ ] Simulate API failure (offline or bad env): a browser with a cached payload still
  renders content; a fresh browser shows `RouteErrorPage` with retry.
- [ ] Dev-only `?state=loading|empty|error|success` previews still behave as before.
- [ ] Production bundle check: `grep -r "SERVICE_ROLE" dist/` returns nothing; no
  Supabase secret appears in client assets.
- [ ] Four checks pass.

## Checkpoint (owner)

Browse the site from a normal browser and a private window: same content on both (it
comes from the database now). Edit a line in the Supabase dashboard, wait a minute,
reload, and see it live.

## Review criteria

One endpoint, one payload, one cache policy; pages untouched; published filtering exists
only server-side; last-good fallback never masks a first-visit failure; no secrets in
client code; static JSON collections remain build-time.

## Commit

`feat: serve public content from the database`
