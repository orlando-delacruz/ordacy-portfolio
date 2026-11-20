# Phase 05 — Keep-alive, backups, cleanup

**Goal:** the free-tier liabilities are handled, the localStorage era is fully retired,
documents tell the truth, and the whole system passes a final sweep.

**Status:** completed. Implementation commit `d128a99`; the final docs/cleanup pass is
committed with it. The owner's EmailJS checkpoint passed (verified server-side send).

**Prerequisites:** Phases 00–04 committed.

## Steps

- [x] **1. Keep-alive.** `api/keepalive.mjs`: `GET` → one real table read through
  PostgREST with the service role (`GET /rest/v1/pages?select=id&limit=1`, body
  discarded), which resets the 7-day inactivity timer; `Cache-Control: no-store`;
  return `204`. Non-`GET` returns `405`. The endpoint requires
  `Authorization: Bearer <CRON_SECRET>` and fails closed with `401` when the variable
  is unset or wrong.
  - The read must return `200`; anything else fails the cron with `500`. The anon key
    is deliberately not used: this project's RLS grants it nothing, so a rejected
    request would prove only that the gateway answered, not Postgres.
  - Vercel sends the `CRON_SECRET` bearer automatically on cron invocations when the
    variable is set; a manual run must send it explicitly.
- [x] **2. Backups.** `api/backup.mjs` on a weekly cron
  (`0 3 * * 1`, Mondays 03:00 UTC): dump every editable table (`pages`, `services`,
  `plans`, `faqs`, `projects`, `testimonials`, `team`, `gallery`, `inquiries`, `seo`)
  plus the `site` and `settings` documents as one JSON file and upload it to a private
  Supabase Storage bucket `backups` (`backups/YYYY-MM-DD.json`); list the bucket and
  delete all but the newest 8 dated files. The payload uses the same camelCase record
  shapes as `src/data/types.ts`, so it can be restored through the admin API's import
  (`PUT /api/admin?resource=<name>`) and document `PUT`s.
  - The endpoint creates the bucket idempotently through the Storage API with the
    service role and forces it private if it already existed public. If the script
    cannot create it, the owner creates the bucket by hand: Supabase → Storage → New
    bucket → name `backups`, **Private**.
  - Storage reports a missing bucket as HTTP 400 with a `NoSuchBucket` body; the
    handler checks the body, not only the status.
  - `GET` only; other methods return `405`. Failures return `500` with no internals.
  - The file contains real inquiries (names and email addresses): the bucket must stay
    private.
  - Manual run for verification: `curl -H "Authorization: Bearer $CRON_SECRET"
    https://<deployment>/api/backup`. `CRON_SECRET` is checked by both cron endpoints
    so they cannot be triggered by strangers.
- [x] **3. Retire the localStorage service layer.** Done in phase 03.
  - `src/services/local-store.ts` and `src/data/storage.ts` are deleted; `createId`
    lives in `src/services/index.ts`.
  - The only remaining content-adjacent browser keys are the last-good public cache
    (`ordacy-content:v1`) and the phase 04 legacy inquiry-draft key, which is read-only
    and drained on public loads.
  - The `seed` export is still used by the bootstrap and static-page source; it is not
    dead.
  - Settings page: “Restore original content” is gone; no dead copy remains.
- [x] **4. Documents.**
  - `AGENTS.md`: reflects the real stack (Supabase, Vercel functions, EmailJS, env var
    names, `npm test`, `npm run check:grid`), documents `docs/implementation/` as the
    plan home, and notes the Vercel Hobby commercial boundary.
  - `README.md`: placeholder/no-Git claims replaced with the real routes, backend,
    commands, environment, deployment, and status; `npm run preview` is documented as
    having no API.
  - These phase files mark completed phases with their commit hash; 05 is `d128a99`
    (implementation), committed with this docs pass.
  - `drainInquiryDrafts()` stays for browsers that still hold pre-phase-04 drafts and
    can be removed one release later.
- [x] **5. Final QA sweep.**
  - Icon resolution during hydration falls back per item on an unknown name (the item
    keeps `MessagesSquare`), warns once per field and value with both the field and the
    bad name, and never fails the whole payload. Page-section action icons use the same
    fallback. `resolveIcon` stays strict for the static `problems`, `steps`, and legal
    CTA content; seed-backed collections use the fallback. The pure helper is
    `src/data/icon-fallback.mjs`, tested in `tests/icon-fallback.test.mjs`.
  - All 11 public routes at 320/380/768/1440 on the dev server with the real API:
    one visible `h1` in the ready state, no horizontal overflow, no page or console
    errors; Projects and Testimonials show their honest empty states.
  - `?state=loading|empty|error|success` previews checked on representative pages.
    `success` is contact-only: the preview renders the real page, while the real
    completed submission was exercised on `/contact`.
  - Note: `npm run preview` has no API; content falls back to the last-good browser
    cache or the error page. Recorded in `AGENTS.md`/`README.md`.
  - The “one `h1`” check counts visible headings. Legal pages keep their print-only
    `h1` inside `display: none` (intentional print semantics, not a defect).
  - Admin: dashboard, FAQ create/edit/delete round-trip, Settings inspection,
    sign-out redirect, and a fresh signed-out `/admin` redirect.
  - Contact: real submission end-to-end; honeypot and throttle were covered by the
    phase 04 tests; the live row and throttle behaviour were confirmed again.
  - Both themes on Home, Contact, and one legal page; reduced motion on a loading
    skeleton; keyboard focus through state panels and the admin login.
  - Secrets: `grep -r "SERVICE_ROLE\|EMAILJS_PRIVATE\|CRON_SECRET" dist/` is empty.
  - Controlled failure: with a bad `SUPABASE_URL` in a throwaway mode, a fresh visitor
    gets `RouteErrorPage` and a browser holding the last-good payload still renders the
    cached content.
  - Cron endpoints: `/api/keepalive` `401` without the secret, `204` with it, `405` on
    `POST`; `/api/backup` `401` without the secret, `200` with it and one object in the
    bucket, `405` on `POST`; retention verified by the pure test in
    `tests/backup.test.mjs`.

## Verification

- [x] Four checks + `npm test` pass.
- [x] Cron entries appear in `vercel.json`; `/api/keepalive` returns `204`;
  `/api/backup` wrote one file and retention leaves at most 8 (pure test).
- [x] `grep -ri "localStorage" src/` shows only the last-good content cache, the legacy
  draft drain, and unrelated UI preferences (theme, hero like).
- [x] No route regressed; no console errors; no horizontal overflow at 320, 380, 768,
  1440.
- [x] EmailJS end-to-end checkpoint: after the owner enabled “API access from
  non-browser environments,” a direct send returned `200 OK` and a real submission
  through `/api/inquiries` returned `201` with no email-failure log. Settings is
  `Connected (EmailJS)`. All verification inquiries were deleted; the inbox starts
  empty.

## Owner checklist

- [ ] Add `CRON_SECRET` (any long random string) and the `EMAILJS_*` /
  `INQUIRY_IP_SALT` values to Vercel environment variables (Production, Preview, and
  Development), then redeploy. Vercel crons fire automatically with the bearer secret.
- [x] Enable “API access from non-browser environments” in EmailJS → Account →
  Security; verified sends now work and Settings shows `Connected (EmailJS)`.
- [x] Confirm the `backups` bucket exists and is **private**, and that one backup file
  appears after a manual `/api/backup` call with the secret.
- [x] The QA inquiry was deleted; the inbox starts empty.

## Checkpoint (owner)

Open the deployed URL on your phone and desktop, sign in, edit one FAQ, submit one
inquiry, and confirm the email. That is the production system.

## Review criteria

Cron endpoints are protected; backups restore-able (open one and compare counts);
localStorage path gone; docs truthful; licensing/terms boundary documented; all four
checks and tests green.

## Commit

`chore: back up content weekly and keep supabase awake` (`d128a99`), followed by the
final docs/cleanup pass committed with it.
