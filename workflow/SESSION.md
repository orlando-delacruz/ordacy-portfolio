# Session Context

## Last Updated
2026-11-20T17:58:01+08:00

## Project Overview
Ordacy portfolio / lead-gen SPA plus an authenticated CMS, now full-stack: React 19 + Vite 8 + React Router 7 + TypeScript 6 + styled-components 6 front end; Node ESM Vercel functions in `api/`; Supabase Postgres for content and Supabase Auth (password + TOTP) for the owner; EmailJS for inquiry notifications. Public pages read one cached payload from `GET /api/content`; the admin writes through `/api/admin`; the contact form posts to `/api/inquiries`. `data/database/*.json` is the dev seed and static-content source. Conventions in `AGENTS.md` (wins on conflict). Implementation docs live in `docs/implementation/` (design decisions plus phases 00–05). Branch `develop`, HEAD `e6185de`, up to date with `origin/develop`.

## Current Objective
No implementation is in progress. The backend integration (phases 00–05) is complete, independently reviewed, committed, and pushed. What remains is owner deployment and verification: Vercel environment variables, a deploy, a production smoke test, and cron/backup confirmation.

## Requirements and Constraints
- Free tiers only, no payment method: Supabase Free (pauses after ~7 days without database activity; a daily keepalive prevents it), Vercel Hobby (personal, non-commercial only — a client's business site needs Pro or a commercial-friendly host such as Cloudflare Pages/Netlify), EmailJS Free (200 emails/month). Neon was runner-up (auto-wake, but no built-in auth/storage); Firebase was rejected (NoSQL restructure plus Blaze-only storage).
- Security invariants: `SUPABASE_SERVICE_ROLE_KEY`, `EMAILJS_PRIVATE_KEY`, `CRON_SECRET`, `INQUIRY_IP_SALT`, `ADMIN_USER_ID`, `ADMIN_TOTP_FACTOR_ID` are server-only, never behind a `VITE_` name. Every admin request verifies the bearer token, the owner id, the pinned TOTP factor (which must be the only verified factor), and AAL2; all fail closed when unset. Supabase sign-ups are disabled. RLS is deny-all with explicit service-role grants.
- Inquiries: save-first (a failed EmailJS send never loses a lead and never fails the visitor), honeypot before validation/throttle/insert, salted-IP throttle (3 per 15 minutes), idempotent retries by draft id. The database is the record; email is the notification.
- Deletes use `remove(id)`; moves use one `update(id, { displayOrder })` per changed record. `replaceAll` (HTTP `PUT`) is import-only so a stale device cannot overwrite another device's edits.
- `supabase/schema.sql` is drop/create (fresh installs only) and `scripts/seed-supabase.mjs` wipes every table including real inquiries. Export first; never run either casually against live data.
- Content integrity: no sample or placeholder records; only real client feedback and permissioned client projects; concept demos clearly labeled; empty states are the honest fallback. Never claim an integration is connected before a real send or upload proves it.
- Public UI decisions from earlier sessions remain: no active sidebar rails, Menu/Pages groups, custom scrollbars, eye icon before View Profile, name above role, About breakpoints, FAQ `All` label, one icon per control, 44px public / 40px admin controls, global 1.5 line-height, one `ClosingCta` plus global footer per public page, print rules, scroll contract, reduced motion.
- `/save` may write only `workflow/SESSION.md`; Git is read-only for it.

## Decisions Made
- Stack: Supabase Postgres + Supabase Auth + Storage (later uploads); Vercel functions plus one daily cron; EmailJS server-side REST. Public reads come from one edge-cached endpoint (`s-maxage=60`, `stale-while-revalidate=86400`) with a last-good browser cache; `RouteLoading` during bootstrap; `RouteErrorPage` only when no cache exists.
- API handlers are plain Node ESM `.mjs`, so Vercel and the Vite dev plugin (`scripts/api-dev.mjs`, loading `.env.local`) share one implementation. `npm run dev` serves the real API; `npm run preview` does not.
- Auth: owner allowlist plus pinned TOTP factor that must be the sole verified factor; AAL2 on every admin request. The login page handles enrollment and challenge. A 403 no longer clears the session (only 401 does) so a misconfiguration shows an error instead of a fake logout.
- Seed policy: all `isSample` records and the six concept-demo projects were removed; sample machinery deleted; profile stats initialize at "0" (blank hides a stat).
- Docs: `docs/implementation/README.md` plus phases 00–05, each with checkpoint, commit, and review criteria. AGENTS/CLAUDE/README updated to the full-stack truth.
- The serverless throttle read-then-write can undercount concurrent requests by one; documented shortcut, acceptable for contact spam.
- Email template: English, full structured fields, subject `New inquiry from {{name}} — {{service}}`, Reply-To the client; the endpoint sends empty strings for missing optional fields.
- State system (earlier this session): page-specific skeletons, shared `PageState`/`StatePanel`/`Spinner`, dev-only `?state=` preview, action-only success (contact), pulsing skeletons with reduced-motion static.

## Completed Work
- Public state system, commit `c12a5bf`: loading/empty/error/success across every public route, route `HydrateFallback`/`errorElement`, `PublicThemeProvider`.
- Phase 00, `5a05023`: all sample/concept content and machinery removed, stale copy corrected, honest empty states.
- Phase 01, `007ff22`: 13-table Supabase schema (RLS deny-all plus explicit service-role grants), destructive seed script, 50 rows seeded.
- Phase 02, `d9069a9`: `/api/content`, live-binding hydration before app import, edge cache, last-good browser cache, dev API plugin, `/api` rewrite exclusion.
- Phase 03, `1bd1d92`: password + TOTP login, owner allowlist, sole-factor pin, AAL2 gate, authenticated admin CRUD, per-record moves/deletes, validation hardening, 16 tests. Security review closed open sign-ups, any-AAL2-user access, and the extra-factor AAL2 path.
- Phase 04, `30c5ff5`: `/api/inquiries` with validation, honeypot, salted-IP throttle, save-first EmailJS, draft drain, truthful success copy. 13 more tests.
- Phase 05, `d128a99` + `e6185de`: daily keepalive (service-role table read), weekly private backups with 8-file retention, icon fallback, final QA, docs truth, 38 total tests.
- EmailJS verified after the owner enabled non-browser API access: direct REST send `200 OK`; real submission through the API `201` with no email-failure log; Settings shows `Connected (EmailJS)`. Verification inquiries and throttle rows were deleted.
- Profile stats sweep, `e8ef379` + `96a2a1e`: fabricated hero numbers removed, clearing works, zeros initialized.

## Current Implementation State
- Locally the full system works: public content from Supabase, admin auth with TOTP, real contact saves plus email, secret-gated keepalive/backup, private `backups` bucket holding one 34,887-byte dump (an earlier QA snapshot).
- Database: pages 9, services 6, plans 3, faqs 18, projects 0, testimonials 0, team 2, gallery 0, inquiries 0, seo 10 (48 collection rows) plus `site` and `settings`. Throttle table empty. Auth: one owner user with one verified TOTP factor; sign-ups disabled.
- `.env.local` holds all 13 variables including a generated 64-character `CRON_SECRET`; it is ignored (`*.local`) and must never be committed. Vercel environment variables are not yet confirmed by the owner.
- The dev server on 5173 may predate recent config/env changes; restart before trusting a mismatch.

## Git Changes
- Repository `C:/Users/SSD-ORLANDO/Documents/Project/ordacy-portfolio`; branch `develop`; HEAD `e6185de`; up to date with `origin/develop` (0 ahead, 0 behind).
- Working tree clean at the start of this save: no staged, unstaged, untracked, deleted, or renamed files. `.env.local` is ignored.
- Session commits: `c12a5bf` state system; `6984cb8` implementation docs; `5a05023` phase 00; `007ff22` phase 01; `d9069a9` phase 02; `1bd1d92` phase 03; `30c5ff5` phase 04; `d128a99` + `e6185de` phase 05; `e8ef379` + `96a2a1e` profile stats. All are pushed.
- This save modifies only `workflow/SESSION.md`; afterward it is the sole modified file. No commits, staging, resets, or branch operations were performed.

## Important Files
- Backend: `api/content.mjs`, `api/admin.mjs`, `api/inquiries.mjs`, `api/keepalive.mjs`, `api/backup.mjs`, `api/_lib/*` (`auth`, `rules`, `map`, `http`, `inquiries`, `cron`, `backup`), `supabase/schema.sql`, `scripts/seed-supabase.mjs`, `scripts/auth-info.mjs`, `scripts/api-dev.mjs`, `vercel.json`, `.env.example`.
- Data/services: `src/data/index.ts` (hydration and live bindings), `src/data/icon-fallback.mjs`, `src/services/index.ts`, `src/services/inquiries.ts`, `src/services/supabase.ts`, `data/database/*.json`, `data/icons.json`.
- State system: `src/components/state/*`, `src/components/skeletons/*`, feature `skeletons/` folders, `src/app/RouteLoading.tsx`, `src/app/RouteErrorPage.tsx`, `src/app/router.tsx`, `src/main.tsx`.
- Admin/contact: `src/features/admin/login/*`, `AdminLayout.tsx`, `AdminTopBar.tsx`, `src/features/admin/settings/SettingsAdminPage.tsx`, `src/features/admin/inquiries/*`, `src/features/contact/ContactForm.tsx`.
- Docs/workflow: `docs/implementation/README.md` plus `00`–`05`, `AGENTS.md`, `CLAUDE.md`, `README.md`, `workflow/save-session.md`, `workflow/load-session.md`, `workflow/SESSION.md`.

## Issues and Blockers
- Deployment is unverified: Vercel env vars (13 names), deploy, production smoke test, cron and backup confirmation are pending. This is the only backend launch blocker.
- Vercel Hobby is personal, non-commercial; a client's business site needs Pro or a commercial-friendly host.
- EmailJS free tier is 200/month and deliverability rides on the connected Gmail; the database is the record either way.
- Keepalive depends on the Vercel cron firing; Supabase's warning email is the backstop, and the caches keep the site serving content during a pause.
- Legal pages are not lawyer-reviewed; no OG image; hero PNGs remain large (home 1.84MB, wave 1.52MB) — all pre-existing.
- Phase 05 review: no re-review was run after the two-line `NoSuchBucket` discriminator change; it is covered by inspection and the passing backup tests. The live 9-file retention deletion and the “existing public bucket” path were not exercised.
- The backup snapshot still contains the earlier QA inquiry (private bucket); the next backup reflects the clean state.
- The admin browser session was signed out by the QA sweep; the owner must sign in again.
- No CI; tests cover API rules, backup planning, and icon fallback only; there is no UI test framework.

## Testing and Verification
- `npm test` 38/38 pass; `npm run typecheck`, `npm run lint`, `npm run check:grid`, `npm run build` all pass (latest build 6,873 modules).
- Live evidence: `/api/content` returns `200` with correct counts; `/api/admin` returns `401` without a token and with the publishable bearer, `403` for the wrong owner and the wrong factor, `200` only for the matching owner + sole verified factor (temporary user, deleted); direct anon PostgREST reads `401`.
- EmailJS: direct REST `200 OK` after enabling non-browser API access; real submission `201` with the row saved and no email-failure log; Settings `Connected (EmailJS)`.
- Keepalive: `401` without the secret, `204` with it, `405` on POST; the service-role table read succeeded. Backup: `401` without the secret, `405` on POST, `200` with the secret; private bucket and one object confirmed; retention covered by tests.
- Browser QA: all 11 public routes at 320/380/768/1440, admin CRUD, two-browser persistence, light/dark themes, reduced motion, keyboard focus, secrets scan of `dist/` (no server secrets), controlled failure (cached vs error page).
- Not performed: production deployment verification, real-device or screen-reader audit, actual print dialog, live retention deletion, Vercel cron dashboard confirmation, a fresh dark-mode sweep after the final docs-only changes.

## Pending Tasks
- Owner deployment: add the 13 environment variables to Vercel (Production, Preview, Development), deploy (commits are pushed), then verify the public site, admin login, and one real inquiry.
- Confirm both crons in the Vercel dashboard and one fresh file in the private `backups` bucket.
- Optional launch polish: optimize the hero PNGs, confirm client permissions/assets, lawyer review of legal copy, add an OG image.
- Keep `workflow/SESSION.md` uncommitted unless the owner asks.

## Next Recommended Steps
1. Deploy with the Vercel env vars and run the production smoke test (public site on two devices, admin login, one inquiry → row + email, then delete it).
2. Confirm the two cron jobs and one backup object in the Vercel/Supabase dashboards.
3. Then optional launch polish (images, legal review, OG image).
4. Keep Git read-only until the owner asks for commits.

## Important Warnings
- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `EMAILJS_PRIVATE_KEY`, `CRON_SECRET`, `INQUIRY_IP_SALT`, or `ADMIN_*` to the client; only `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are public. Do not re-enable Supabase sign-ups; keep the owner allowlist, the sole verified TOTP factor pin, and the AAL2 gate.
- Changing `.env.local` requires a dev-server restart; changing Vercel values requires a redeploy.
- `schema.sql` is drop/create and `seed-supabase.mjs` wipes tables including real inquiries. Export first; never run them against live data casually.
- Preserve per-record deletes and moves; do not reintroduce `replaceAll` for single records.
- Keep the inquiry flow order (honeypot → validation → idempotency → throttle → insert → email) and the salted-IP hashing.
- Keep the public UI decisions and the state system; the `?state=` preview must stay dev-only and production must never add artificial latency.
- `npm run preview` has no API; use `npm run dev` or a Vercel preview for end-to-end checks.
- The dev server can serve stale transforms; restart before trusting a mismatch.
- `/save` writes only `workflow/SESSION.md`.

## Execution Recommendation
- Phase: Build complete / QA complete; deployment pending
- Current mode: not verified
- Recommended next mode: owner deployment and production verification
- Current model: DeepSeek V4.1 Flash 1017
- Recommended model: keep the current setup; no escalation needed for configuration
- Effort: low to medium
- Ultracode: OFF
- Token optimization: follow the deployment checklist; return only if a production check fails
- Reason: all code, docs, and local verification are complete and pushed; the remaining work is environment configuration and owner sign-off.
