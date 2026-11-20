# Phase 04 — Contact and email

**Goal:** the contact form creates a real inquiry row and emails the owner through
EmailJS. The inquiry is saved before the email is attempted; an email failure never
loses a lead or shows the visitor an error.

**Status:** completed — commit `30c5ff5`. The EmailJS account setup and the real-inbox
send were verified in the phase 05 sweep.

**Prerequisites:** Phase 03 committed (admin can read the Inquiries page); the
`inquiry_throttle` table from phase 01 (no schema change in this phase);
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set.

## Fixed decisions

### 1. Public endpoint — `api/inquiries.mjs`

Plain Node ESM with `req`/`res`, matching `api/content.mjs` and `api/admin.mjs`.
Vercel and the Vite dev plugin both dispatch `api/<name>.mjs` by filename.

```text
POST /api/inquiries
Content-Type: application/json
```

| Situation | Status | Body |
| --- | --- | --- |
| Saved and emailed (or email failed) | `201` | `{ "ok": true, "id": "inquiry-…" }` |
| Same id already stored (retry/drain) | `200` | `{ "ok": true, "id": "inquiry-…", "duplicate": true }` |
| Honeypot filled | `201` | `{ "ok": true }` — no row, no email |
| Validation failure | `400` | `{ "error": "invalid inquiry", "fields": { … } }` |
| More than 3 in the 15-minute window | `429` | `{ "error": "too many inquiries; try again later" }` |
| Other method | `405` | `Allow: POST` |
| Missing `INQUIRY_IP_SALT`, database failure | `500` | `{ "error": … }` |

Every response sets `Cache-Control: no-store`.

Validation is server-side and independent of the form:

| Field | Rule |
| --- | --- |
| `name` | required, trimmed, 2–120 characters |
| `email` | required, trimmed, valid address, ≤ 200 characters |
| `message` | required, trimmed, 10–5000 characters |
| `business` | optional, ≤ 120 characters |
| `service` | optional, ≤ 120 characters |
| `plan` | optional, ≤ 160 characters |
| `launchDate` | optional, real `YYYY-MM-DD` date |
| `id` | optional, `inquiry-` prefix, ≤ 100 characters |
| `website` | honeypot; a non-empty value short-circuits to `201` before validation |

- **Idempotency:** a client-supplied `id` (the old browser draft id) is checked before
  the throttle and the insert. An existing id returns `200` without another row or
  email. A duplicate-key race on insert is treated the same way. A normal submission
  gets `inquiry-<uuid>` server-side.
- **Honeypot:** the hidden `website` field is checked first; bots get the success they
  expect and touch nothing.
- **Throttle:** salted SHA-256 of the client IP (`x-forwarded-for` first entry, socket
  address as the dev fallback) is stored in `inquiry_throttle` (`ip_hash`,
  `window_start`, `request_count`). Three requests are allowed per 15-minute window;
  the fourth and later return `429` without inserting. An expired, future, or
  malformed window starts a new one. Raw IPs are never stored or logged.
  `INQUIRY_IP_SALT` is required: unset fails closed with `500`, because storing
  unsalted hashes would make them reversible. The read-then-write count can undercount
  two simultaneous requests by one; that is acceptable for contact-form spam control.
- **Order:** validate → idempotency → throttle → insert (`status: 'new'`, ISO
  `submittedAt`, nulls for empty optionals) → EmailJS. The email call is wrapped in
  try/catch; a failure logs the inquiry id and the endpoint still returns `201`.

### 2. EmailJS send (server-side)

Verified against EmailJS's REST docs (`/docs/rest-api/send/`, 2026-11-20):
`POST https://api.emailjs.com/api/v1.0/email/send`, `Content-Type: application/json`:

```json
{
  "service_id": "<EMAILJS_SERVICE_ID>",
  "template_id": "<EMAILJS_TEMPLATE_ID>",
  "user_id": "<EMAILJS_PUBLIC_KEY>",
  "accessToken": "<EMAILJS_PRIVATE_KEY>",
  "template_params": {
    "name": "…",
    "email": "…",
    "business": "…",
    "service": "…",
    "plan": "…",
    "message": "…",
    "launch_date": "…",
    "submitted_at": "…"
  }
}
```

The public key is the API's `user_id`; the private key is its `accessToken` field (not
a separate `private_key` field). Empty optionals become `""` so the template has no
`undefined`. The request aborts after 8 seconds. Non-2xx responses throw with a short
description; the handler logs `inquiry <id>: email notification failed` and keeps the
saved row. Secrets come only from `EMAILJS_*` server environment variables and never
reach client code or `dist/`.

### 3. Client submission

- `src/services/inquiries.ts` owns `submitInquiry` (`POST /api/inquiries`) and
  `drainInquiryDrafts`; `src/services/index.ts` re-exports them so existing contact
  imports keep working. Any non-2xx (including `429`) throws, and the form shows its
  existing compact failure panel with the visitor's values retained.
- The form keeps its spinner, success panel, focus behavior, and validation. The
  honeypot was already present and meets the contract: hidden `website` input inside a
  visually hidden wrapper, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`.
  A filled field shows the success panel without a request.
- The browser-local inquiry path is removed: `inquiriesService` reads and writes the
  API only, with no draft merge. `ordacy-cms:v3:inquiries` is now read-only legacy
  data.
- **One-time drain:** on each public load (never `/admin`), `drainInquiryDrafts` reads
  the old key, POSTs each record with its original id, and removes it only after the
  POST succeeds. Failures keep the record (and everything after it) for the next load.
  The id makes a retried drain idempotent, so no duplicate row or second email. Storage
  that cannot be updated keeps the key; the next load repeats safely. Phase 05 removes
  the drain with the rest of the legacy local code.

### 4. Copy truth

- `data/database/states.json` contact success: **Inquiry received.** /
  **Thanks — we'll get back to you shortly.** The browser-only wording is gone.
- Settings → Email notifications stays **Not configured** until the owner's EmailJS
  setup produces a real send. Its text now says inquiries are saved to the database
  first and EmailJS adds the owner email. At the checkpoint, after the test email
  arrives, change the row to `Connected (EmailJS)` with a matching description in
  `src/features/admin/settings/SettingsAdminPage.tsx`. File storage remains
  `Not configured`.

### 5. Tests

`tests/inquiries.test.mjs` (Node's runner, no dependencies) covers:

- payload validation accept/reject, including optional caps, real dates, id prefix;
- client IP extraction and salted hashing (no raw IP in the hash);
- throttle: three allowed, fourth denied, still denied at 14:59.999, reset at 15:00,
  malformed/future windows;
- honeypot short-circuit before any dependency;
- idempotent existing id and duplicate-insert race;
- save-before-email order: a throwing sender still returns `201` with the saved row and
  the failure log;
- denied throttle stops before the insert; invalid payloads touch no dependency;
- EmailJS body shape (`user_id`, `accessToken`, template variables);
- `405` for non-POST and `500` fail-closed when the salt is missing.

## Owner setup checklist

- [ ] Create an EmailJS account (free: 200 emails/month, no card).
- [ ] Email Services → connect your Gmail (or Outlook) account; note the **Service ID**.
- [ ] Email Templates → new template. Recipient: your email. Variables:
  `{{name}}`, `{{email}}`, `{{business}}`, `{{service}}`, `{{plan}}`,
  `{{message}}`, `{{launch_date}}`, `{{submitted_at}}`. Note the **Template ID**.
  Suggested body: `New inquiry from {{name}} ({{email}})`, the optional fields, then
  `{{message}}`.
- [ ] Account → copy the **Public Key** and **Private Key**.
- [ ] Add `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`,
  `EMAILJS_PRIVATE_KEY`, and `INQUIRY_IP_SALT` (any long random string) to `.env.local`
  and the Vercel environment variables; restart the dev server / redeploy.
- [ ] Send one test inquiry after the code lands, confirm the email, and mark it
  “not spam” once.
- [ ] Only after that send succeeds, set Settings → Email notifications to
  `Connected (EmailJS)`.

## Verification

- [x] Without EmailJS keys: a valid submission returns `201`, the row appears in
  admin Inquiries, the server logs the email failure, and the success panel shows the
  new receipt copy.
- [x] Invalid payloads return `400` with the field list; a filled honeypot returns
  `201` with no row; the fourth submission in a window returns `429`; an idempotent
  repeat id leaves one row.
- [x] Draft drain: a seeded `ordacy-cms:v3:inquiries` record is POSTed with its id on a
  public load and the key is cleared.
- [x] Settings copy remains truthful while EmailJS is unconfigured (the `Connected`
  change above is the checkpoint step).
- [x] Verification inquiries deleted; `inquiries` empty again; test throttle rows
  removed.
- [x] Contact form at 320 and 768: honeypot invisible to keyboard and assistive tech,
  failure panel with retained values when the API is unreachable, no console errors,
  no overflow.
- [x] `npm test`, `npm run typecheck`, `npm run lint`, `npm run check:grid`,
  `npm run build` pass.
- [x] No `EMAILJS_PRIVATE_KEY` or `INQUIRY_IP_SALT` in `dist/`.

## Checkpoint (owner)

Send a real inquiry from your phone: it arrives by email and appears in admin. Reply in
your head — this is the production path now. Then flip Settings → Email notifications
to `Connected (EmailJS)` and commit that with the phase.

## Review criteria

Validation, idempotency, honeypot, and throttle are server-side; the honeypot is
invisible to real users and assistive tech; email failure cannot fail the visitor's
submission; the inquiry is saved before the email is attempted; the EmailJS private key
is server-only; the existing form states are untouched; the draft drain never drops
local data and never duplicates a delivered inquiry.

## Commit

`feat: deliver inquiries to the database and by email`
