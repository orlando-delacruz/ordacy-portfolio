# Phase 03 — Auth and admin CRUD

**Goal:** the owner signs in with Supabase Auth (password + TOTP), and every admin edit
travels through authenticated API endpoints into Postgres. The admin UI keeps its
current screens; only the service layer and shell guard change.

**Status:** implemented. Owner setup and checkpoint below remain for the owner.

**Prerequisites:** Phase 02 committed; `@supabase/supabase-js` installed;
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`,
`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_USER_ID`, and
`ADMIN_TOTP_FACTOR_ID` set locally and on Vercel.

## Owner setup checklist

- [ ] Supabase → Authentication → Providers → Email: turn **Enable sign-ups** off
  before creating the owner, so no other account can exist.
- [ ] Authentication → Users → **Add user**: owner email and a strong password.
  Turn **Auto Confirm User** on so no confirmation email is required.
- [ ] Run `node --env-file=.env.local scripts/auth-info.mjs`; copy the owner's
  `ADMIN_USER_ID` into `.env.local` and the Vercel environment variables.
- [ ] Open `/admin/login`, sign in, scan the QR with an authenticator app, and verify
  one six-digit code. Run the script again; copy the verified TOTP factor id into
  `ADMIN_TOTP_FACTOR_ID` in both environments.
- [ ] If the dashboard exposes it, set Supabase's **maximum enrolled factors** to 1.
  The API already denies extra verified factors, so this only prevents a
  password-holder from locking the owner out by adding one.
- [ ] After removing or resetting the factor from the dashboard, enroll again and
  re-record the new factor id. The API denies access while the recorded id is stale.
- [ ] Keep the recovery path: Supabase → Authentication → Users → the owner's factors
  can remove or reset the TOTP factor from the dashboard.

**Sequencing:** after enrollment the API returns `403` until both `ADMIN_USER_ID` and
`ADMIN_TOTP_FACTOR_ID` are recorded. `.env.local` changes need a dev-server restart,
and Vercel environment changes need a redeploy.

## Implemented decisions

### 1. One flat admin endpoint — `api/admin.mjs`

Plain Node ESM with `req`/`res`, matching `api/content.mjs`. Vercel and the Vite dev
plugin dispatch `api/<name>.mjs` by filename, so a flat handler avoids dynamic-route
tooling:

```text
/api/admin?resource=<name>[&id=<id>]
```

Whitelisted resources:

| Kind | Names | Methods |
| --- | --- | --- |
| Collections | `projects`, `testimonials`, `services`, `plans`, `faqs`, `team`, `gallery`, `inquiries`, `pages`, `seo` | `GET` list, `GET ?id=`, `POST`, `PATCH ?id=`, `DELETE ?id=`, `PUT` (body array, replace-all) |
| Documents | `site`, `settings` | `GET`, `PUT` (body object) |

- Unknown or missing resource → `404`; wrong method → `405` with `Allow`.
- Missing/invalid token → `401 { "error": "unauthorized" }`.
- Authenticated but not the recorded owner (`user.id !== ADMIN_USER_ID`) → `403
  { "error": "forbidden" }`. An unset `ADMIN_USER_ID` rejects every request.
- The owner's recorded verified TOTP factor (`ADMIN_TOTP_FACTOR_ID`) must be the only
  verified factor of any type; an unset, missing, unverified, non-TOTP, or extra
  verified factor → `403 { "error": "forbidden" }`.
- Valid token at AAL1 → `403 { "error": "mfa required" }`.
- Missing record for `GET ?id=`, `PATCH`, or `DELETE` → `404`.
- Shape errors → `400`; duplicate id/slug → `409`.
- `PUT` replace-all upserts the payload first, then deletes only ids the payload no
  longer contains. A failed write cannot empty the table. The admin uses `PUT` only
  for genuine full imports; deletes and moves use per-record calls (see 7).
- Uses `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`; the service-role key never leaves
  the function environment.

`api/_lib/map.mjs` now maps both directions: the existing `map*` row readers and new
`to*Row` writers, registered per table in `collectionMaps`. It also adds
`mapInquiry`/`toInquiryRow`. `api/content.mjs` keeps using the row readers unchanged.

### 2. Server auth helper — `api/_lib/auth.mjs`

- Reads only `Authorization: Bearer <token>`; no cookies, no client flags.
- Verifies the signature with `supabase.auth.getUser(token)` using
  `SUPABASE_URL` + `SUPABASE_ANON_KEY`.
- **Owner allowlist:** `authorizeOwner` requires `user.id === ADMIN_USER_ID`. The
  comparison happens before any service-role client is created; an unset variable
  denies every request instead of admitting every signed-in account.
- **Factor pin:** `auth.admin.mfa.listFactors({ userId })` (service role) lists the
  user's factors, and `authorizeFactor` accepts only `ADMIN_TOTP_FACTOR_ID` with
  `factor_type === 'totp'`, `status === 'verified'`, and the user's **only** verified
  factor of any type. This is what blocks a password-plus-extra-factor session:
  Supabase's factor limit of 1 is the primary prevention, so a second factor cannot be
  enrolled; if that limit is ever raised or bypassed, the pin plus the
  exactly-one-verified-factor rule still denies the session when an extra verified
  factor exists. The trade-off is honest: an extra verified factor locks the admin
  (denial of service for the owner) until it is removed — it never grants access.
  Missing/unverified/unset factors and any extra verified factor fail closed.
  Unverified extra factors may remain.
- Decodes the verified token's payload and requires `aal === 'aal2'`. A password-only
  session can never write admin content.
- Every admin request calls `requireAdmin` first. The pure gate lives in
  `api/_lib/rules.mjs` (`authorizeAdmin`, `authorizeOwner`, `authorizeFactor`,
  `decodeJwtPayload`, `bearerToken`).

### 3. Documents are key-whitelisted

`PUT` bodies are rebuilt field by field from the `SiteRecord` / `SettingsRecord`
shapes in `api/_lib/rules.mjs` — never written verbatim. Unknown keys are dropped,
including the JSON seeds' `_note` comments. `settings` stores only
`inquiriesPageSize` (integer, 1–100).

Collection records are validated with the shared icon allowlist (`data/icons.json`,
also imported by `src/data/icons.ts`), stricter team nested shapes, an absolute
`https` `siteUrl`, and safe URL checks. URL fields accept absolute `http(s)` or rooted
`/` paths. Same-document `#fragment` targets are also accepted because the stored
Contact CTA uses `#inquiry-form`; they cannot execute script. `javascript:`, `data:`,
protocol-relative (`//host`), and backslash forms are rejected.

### 4. Login and MFA — `/admin/login`

- Route is a sibling of the guarded `/admin` layout in `src/app/router.tsx`, with
  `HydrateFallback` and `errorElement`.
- `src/services/supabase.ts` exports `getSupabase()`, which loads
  `@supabase/supabase-js` on first admin use and returns the singleton, plus
  `getAccessToken()`. Only `VITE_*` values are used in the bundle, and public pages
  never download the auth SDK.
- Password step → `signInWithPassword`.
  - No verified TOTP factor: remove abandoned unverified factors, `mfa.enroll`
    (`factorType: 'totp'`, friendly name `Ordacy Admin`), show the QR and setup key,
    then verify the code.
  - Existing verified factor: `mfa.challenge` + `mfa.verify`.
- Wrong credentials/code show an inline `role="alert"` error and do not navigate.
- Success → `/admin` with `replace`.
- Mount verifies the session with `getUser()` so a revoked token does not bounce back
  to the admin shell. `Use a different account` clears the session.
- Login is noindex via `usePageMeta` with the inline `path: '*'` record.
- Icons on buttons, 44px controls, visible focus, theme tokens, no horizontal overflow
  at 320/768.

### 5. Admin guard and sign-out

`AdminLayout` renders no admin chrome until `getUser()` succeeds and
`mfa.getAuthenticatorAssuranceLevel()` reports `currentLevel === 'aal2'`. Missing,
revoked, or expired sessions redirect to `/admin/login`, and the stale local session
is cleared with `signOut({ scope: 'local' })`. An AAL1 session is intentionally kept:
the same session carries the password step into the TOTP challenge, so clearing it
would only force the owner to type the password again. Only sessions that no longer
authenticate are cleared. The profile menu shows the signed-in email and a **Sign
out** action that clears the session and returns to login.

The service layer also clears the local session on a `401`/`403` response, so a token
revoked in another browser returns to login instead of showing a broken shell.

### 6. Client service layer

`src/services/index.ts` now implements the existing `Collection` / `DocumentStore`
contracts over `/api/admin`, attaching `Authorization: Bearer <token>`:

- `projectsService`, `testimonialsService`, `servicesService`, `plansService`,
  `faqsService`, `galleryService`, `teamService`, `pagesService`, `seoService`,
  `inquiriesService`, `siteService`, `settingsService`.
- `get`, `update`, and `remove` map a `404` to `NotFoundError`; other non-2xx
  responses become readable errors consistent with the old store.
- `queryInquiries`, `getInquiryStats`, `submitInquiry`, and `createId` keep their
  signatures. `submitInquiry` stays browser-local until phase 04; local drafts use the
  old `ordacy-cms:v3:inquiries` key and remain visible/editable in this browser.
- Admin pages and `useCollection` are not edited except for the move/delete calls
  below. A consequence: the Services screen has no create/delete buttons (it edits,
  publishes, and reorders existing services), so end-to-end create/delete for a
  service uses the authenticated endpoint while edit/unpublish/reorder use the UI.
  FAQ and other managers still prove UI create/edit/delete.

### 7. Per-record deletes and moves

Deletes call `remove(id)`. Moves call `update(id, { displayOrder })` once per record
whose number changed, through `saveOrder` in `src/services/index.ts`. `replaceAll`
(HTTP `PUT`) is kept for genuine full imports only. This removes the stale-snapshot
class of bugs: a device that loaded an old list can no longer delete another device's
new record or resurrect one that was already deleted.

### 8. Settings truth

- Authentication → `Connected (Supabase Auth with TOTP)`.
- Database → `Connected (Supabase)`.
- Email notifications → `Not configured` (until phase 04).
- File storage → `Not configured`.
- The Storage panel and **Restore original content** are removed. Re-seeding is the
  developer script `node --env-file=.env.local scripts/seed-supabase.mjs`.
- Copy no longer claims edits live in this browser.

### 9. Minimal tests

`api/_lib/rules.mjs` holds the pure rules: resource whitelist, bearer parsing, JWT
payload decode, AAL gate, **owner allowlist, factor pin**, record validation, **icon
allowlist, URL safety, team nested shapes**, document rebuilds, and list ordering.
`tests/rules.test.mjs` also round-trips every collection through
`api/_lib/map.mjs` in both directions and imports `data/icons.json` through the rules.
It uses Node's built-in runner; no test dependencies.

`scripts/auth-info.mjs` is the read-only service-role helper that prints
`ADMIN_USER_ID` and each user's factor ids/status. Usage:

```bash
node --env-file=.env.local scripts/auth-info.mjs
```

`package.json` uses:

```json
"test": "node --test \"tests/**/*.test.mjs\""
```

The planned `node --test tests/` form fails on the installed Node 24.19.0 (the runner
treats the directory as a module); the glob is the working equivalent.

### Files removed early

`src/services/local-store.ts` and `src/data/storage.ts` are deleted in this phase
rather than phase 05: no content path reads them anymore. `createId` now lives in
`src/services/index.ts`. Phase 05's localStorage-retirement step is therefore already
complete for content services.

## Verification

- [x] Password → QR enrollment → code → `/admin`; wrong code and wrong password show
  inline alerts and do not navigate.
- [x] Sign-out returns to login; `/admin` and `/admin/*` redirect while signed out.
- [x] Session survives reload; a second browser context requires its own password and
  code, then sees the same database records.
- [x] Admin CRUD: service created through the authenticated API (no UI create control),
  edited and unpublished through the UI, absent from the public API/site, then
  deleted; FAQ created, edited, and deleted fully through the UI; service order moved
  and persisted after reload, then restored.
- [x] No token → `401`; password-only AAL1 token → `403 { "error": "mfa required" }`;
  invalid token → `401`.
- [x] Owner allowlist: a valid AAL2 token for a different user → `403
  { "error": "forbidden" }` with no content read. An unset `ADMIN_USER_ID` denies
  every request.
- [x] Factor pin: the recorded verified TOTP id passes only while it is the sole
  verified factor; a different verified factor id, any extra verified TOTP or non-TOTP
  factor, an unverified recorded factor, and a non-TOTP recorded factor are denied.
  The owner's real ids are required for the production pass; the probe used a temporary
  user's matching id to prove the pass path.
- [x] FAQ and gallery deletes go through `DELETE ?id=`, and moves through one `PATCH`
  per changed record; both survive reload.
- [x] `/admin/login` renders while `/api/content` returns 500/404 (the public API is
  skipped for `/admin` paths).
- [x] Settings save persisted after reload; `site` and `settings` JSON contain no
  `_note`; `settings` holds only `inquiriesPageSize`.
- [x] Temporary auth user and all test records deleted; content tables back to 48 rows
  plus the `site` and `settings` documents (the seed's 50 rows). Public Testimonials
  returned to its empty state.
- [x] `npm run typecheck`, `npm run lint`, `npm run check:grid`, `npm run build`,
  `npm test` pass.
- [x] Login, admin shell, FAQ list, and FAQ editor at 320 and 768: no horizontal
  overflow, no console errors, visible keyboard focus.
- [x] No service-role key in `dist/`.

## Checkpoint (owner)

Sign in on your machine and on a second device/browser; make one edit on each and see
the other side update after reload. Confirm the authenticator prompt appears and the
admin can be signed out.

## Review criteria

No unrelated admin screen structure changed; interfaces preserved; every admin request verifies
a Supabase JWT server-side, requires the recorded owner id and the sole verified TOTP factor id,
and requires AAL2; both owner variables fail closed; service-role key server-only; no
flash of admin chrome while signed out; login is accessible and on-brand; documents
cannot store `_note` or unknown keys; deletes and moves are per-record, `PUT` is
import-only; tests cover the security-relevant rules.

## Commit

`feat: authenticate admin and persist content through the API`
