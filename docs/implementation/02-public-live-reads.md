# Phase 02 — Public live reads

**Goal:** the public site renders published content from Postgres through one cached API
endpoint, with a last-good browser fallback. Pages and their state system stay unchanged.

**Prerequisites:** Phase 01 committed and seeded; Vercel environment variables set.

## Steps

- [ ] **1. Write `api/content.mjs`** (plain Node ESM, not TypeScript).
  - Reason: the same handler must run as a Vercel function and inside the Vite dev
    server. Plain `.mjs` with Node `req`/`res` only (`res.statusCode`, `res.setHeader`,
    `res.end`) needs no second TypeScript project, tsconfig include, or function
    framework. Shared server modules live in `api/_lib/*.mjs`.
  - Creates a Supabase client from `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
    (server-only values).
  - Reads `pages`, `services`, `plans`, `faqs`, `projects`, `testimonials`, `team`,
    `gallery`, `seo`, `site` — snake_case → camelCase mapping in one shared module
    (`api/_lib/map.mjs`), reused by phase 03.
  - Filters server-side: `is_published` for services, plans, faqs, projects, team,
    gallery; `status === 'approved' && is_published` for testimonials; ordered by
    `display_order`.
  - Returns one JSON payload shaped exactly like today's public `current` object
    (`site`, `pages`, `services`, `plans`, `faqs`, `projects`, `testimonials`, `team`,
    `gallery`, `seo` as a keyed map).
  - Sets `Cache-Control: public, s-maxage=60, stale-while-revalidate=86400`.
  - On error: log the real error server-side, return `500` with `{ "error": "content
    unavailable" }` — no internals in the body, and `Cache-Control: no-store`.

- [ ] **2. Make `npm run dev` serve the real API.**
  - `scripts/api-dev.mjs` is a Vite plugin (`apply: 'serve'`). It loads `.env.local`
    into `process.env` (all names, not just `VITE_*`, without overriding existing
    values) via Vite's `loadEnv(mode, process.cwd(), '')`.
  - For `/api/<name>` it dynamically imports `api/<name>.mjs` and calls its default
    handler with `(req, res)`; unknown names return `404`; handler errors return `500`.
  - Add it to `plugins` in `vite.config.ts`. No second dev server or proxy is needed.

- [ ] **3. Load content in `src/data/index.ts`.**
  - `loadPublicContent(): Promise<void>` fetches `/api/content` with an 8-second
    `AbortController` timeout.
  - Success: hydrate module state, then persist the raw payload to localStorage key
    `ordacy-content:v1`.
  - Failure: read that cache; hydrate from it and continue (log a console warning); if
    absent, rethrow.
  - Ordering (`displayOrder`) and icon resolution (`resolveIcon`, including `ctaIcon`
    for plans) happen here, once, for every hydrated collection — mirroring today's
    exports.

- [ ] **4. Convert the public data exports.**
  - Static imports stay build-time: `problems`, `process`, `legal`, `states`,
    `admin-navigation`.
  - Editable collections become live-binding exports (`export let site`, `pages`,
    `services`, `plans`, `faqs`, `projects`, `testimonials`, `team`, `gallery`, `seo`)
    assigned by hydration. `getPage`, `getSection`, `sectionCopy`, `closingCta`,
    `teamMemberBySlug` read the hydrated values at call time and keep their current
    behavior and error messages.
  - The public layer stops reading browser storage; the `seed` export and
    `src/data/storage.ts` stay untouched for the admin until phase 03.

- [ ] **5. Wire the bootstrap in `src/main.tsx`.**
  - Render the existing standalone `RouteLoading` immediately (it needs no data and no
    router) while `loadPublicContent()` runs.
  - On success: `createRoot(...).render(<StrictMode><App /></StrictMode>)`, with `App`
    loaded through a dynamic `import()`. That ordering is what makes every module-scope
    read (Home stats and guards, Projects count, Pricing `hasPlans`) see API values.
  - On failure with no cache: render the standalone `RouteErrorPage` instead.
  - Keep the scroll-restoration line as-is. Both standalone screens need
    `AppThemeProvider` because `PublicThemeProvider` reads the app theme.

- [ ] **6. Stop the SPA rewrite from swallowing functions in `vercel.json`.**

  ```json
  { "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
  ```

  This is the first deployed function, so the exclusion moves here from phase 05.
  Verify on a preview: `/api/content` returns JSON, `/projects` still serves the SPA,
  `/admin/whatever` still boots the app.

- [ ] **7. Verify no page needed changes.** Every page already reads `@/data` exports;
  `PageState` empty guards now react to real API data. Do not edit pages in this phase.

## Verification

- [ ] `npm run dev` serves app + `/api/content` end to end (the plugin above).
- [ ] All 11 public routes render real content from Postgres at 320, 768, 1440; one
  `h1` in the ready state; no console errors; no horizontal overflow beyond the known
  320 px desktop-scrollbar baseline.
- [ ] Edit one row in the Supabase Table Editor (e.g., an FAQ answer) and confirm the
  public page shows it on reload; restore it after.
- [ ] Unpublish a service (or FAQ) in the table and confirm it disappears from public
  reads (server-side filter proof).
- [ ] Simulate API failure (`/api/content` 404 or bad env): a browser with a cached
  payload still renders content; a browser with cleared storage shows `RouteErrorPage`
  with retry.
- [ ] Dev-only `?state=loading|empty|error|success` previews still behave as before.
- [ ] Production bundle check: `grep -ri "SERVICE_ROLE" dist/` returns nothing; no
  Supabase secret appears in client assets.
- [ ] Four checks pass.

## Checkpoint (owner)

- In Vercel → Project → Settings → Environment Variables, add all five Supabase names
  to **Production, Preview, and Development**: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`. Redeploy after adding them.
- Browse the site from a normal browser and a private window: same content on both (it
  comes from the database now). Edit a line in the Supabase dashboard, wait a minute,
  reload, and see it live.

## Review criteria

One endpoint, one payload, one cache policy; pages untouched; published filtering exists
only server-side; last-good fallback never masks a first-visit failure; no secrets in
client code; static JSON collections remain build-time; the dev server runs the same
handler as production.

## Commit

`feat: serve public content from the database`
