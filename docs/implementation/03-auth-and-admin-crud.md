# Phase 03 — Auth and admin CRUD

**Goal:** the owner signs in with Supabase Auth (password + TOTP), and every admin edit
travels through authenticated API endpoints into Postgres. The admin UI keeps its
current screens; only the service layer changes.

**Prerequisites:** Phase 02 committed; `@supabase/supabase-js` installed.

## Owner setup checklist

- [ ] Supabase → Authentication → Users → Add user: your email + a strong password.
- [ ] Confirm the email if Supabase asks for it.
- [ ] First login (after the code lands) enrolls TOTP: scan the QR with an authenticator
  app, verify one code. Keep the recovery path: Supabase dashboard can reset the factor.

## Steps

- [ ] **1. Client auth module `src/services/supabase.ts`.** Browser client from
  `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`; exports `supabase` and
  `getAccessToken(): Promise<string | null>`.

- [ ] **2. Login route `/admin/login`.**
  - Add the route in `src/app/router.tsx` and the admin route's `HydrateFallback`.
  - Screen: email + password → if MFA is required, a 6-digit code step; if no verified
    factor exists, enroll (QR + code) then continue.
  - Wrong code/password shows an inline, `role="alert"` error; buttons follow the
    design language (icons, 44px). Page is noindex.
  - Success → `navigate('/admin', { replace: true })`.
  - Sign-out action in the admin shell: clears the session, returns to `/admin/login`.

- [ ] **3. Admin guard.** In the admin shell (`AdminLayout`), redirect to `/admin/login`
  when there is no session, and wait for the initial session check before rendering
  admin content. Never flash admin chrome to a signed-out visitor.

- [ ] **4. Server auth helper `api/_lib/auth.ts`.**
  - Reads `Authorization: Bearer <token>`; verifies with `supabase.auth.getUser(token)`
    using the anon key client.
  - Returns the user or sends `401 { "error": "unauthorized" }`; every admin endpoint
    calls it first. No endpoint trusts a cookie or a client flag.

- [ ] **5. Admin endpoints.**
  - `api/admin/[collection].ts` with a whitelist: `projects`, `testimonials`,
    `services`, `plans`, `faqs`, `team`, `gallery`, `inquiries`, `pages`, `seo`.
    Supports the `Collection` contract: `GET` list, `GET ?id=` one, `POST` create,
    `PATCH ?id=` update, `DELETE ?id=`, `PUT` replace-all (reorder). Validates ids and
    payload shape; 404 on unknown records; 400 on shape errors.
  - `api/admin/documents/[key].ts` for `site` and `settings` (`GET`, `PUT`).
  - camelCase ↔ snake_case mapping through `api/_lib/map.ts`; service-role client only
    inside these handlers.

- [ ] **6. Swap the client service layer.** Rewrite `src/services/index.ts` exports
  (`projectsService`, `testimonialsService`, `servicesService`, `plansService`,
  `faqsService`, `galleryService`, `teamService`, `pagesService`, `seoService`,
  `inquiriesService`, `siteService`, `settingsService`) as HTTP implementations of the
  same `Collection` / `DocumentStore` interfaces, attaching the bearer token.
  `queryInquiries`, `getInquiryStats`, `submitInquiry`, and `createId` keep their
  signatures. Admin pages and `useCollection` are not edited.

- [ ] **7. Settings truth.** Settings page rows: database → “Connected (Supabase)”
  (read-only fact), email → “Not configured” until phase 04, uploads → “Not
  configured”. Remove “Restore original content” and its handler (`restoreOriginalContent`
  is a developer action via the seed script now).

- [ ] **8. Minimal tests.** Add `"test": "node --test tests/"` (TypeScript via
  `--experimental-strip-types` on Node ≥ 22.6; if the machine runs older Node, write the
  tests against plain `.mjs` helpers instead and note it):
  - unauth request → 401;
  - published/approved filters;
  - create/update payload validation;
  - reorder replace-all preserves order.
  Pure helpers (`api/_lib/rules.ts`) hold the logic so tests import them directly.

## Verification

- [ ] Login flow: password → QR enroll → code → `/admin`; wrong code rejected; sign-out
  returns to login; `/admin/anything` while signed out redirects.
- [ ] Session persists across reload; a second browser requires its own login (proof it
  is not localStorage content anymore).
- [ ] CRUD round-trip from admin UI: create a service, edit it, reorder, unpublish,
  delete — visible on the public site within ~60s each time.
- [ ] API calls without a token return 401 (curl or devtools).
- [ ] `npm run typecheck`, `npm run lint`, `npm run check:grid`, `npm run build`,
  `npm test` pass.
- [ ] Browser at 320/768: login page, admin shell, one list page, one editor, no
  overflow, no console errors, focus visible.

## Checkpoint (owner)

Sign in on your machine and on a second device/browser; make one edit on each and see
the other side update after reload. Confirm the authenticator prompt appears and the
admin can be signed out.

## Review criteria

No admin screen logic changed; interfaces preserved; token verified server-side on every
admin call; service-role key server-only; redirect logic has no flash of admin content;
login page accessible and on-brand; tests cover the security-relevant rules.

## Commit

`feat: authenticate admin and persist content through the API`
