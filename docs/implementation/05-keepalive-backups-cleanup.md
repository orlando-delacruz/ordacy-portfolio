# Phase 05 — Keep-alive, backups, cleanup

**Goal:** the free-tier liabilities are handled, the localStorage era is fully retired,
documents tell the truth, and the whole system passes a final sweep.

**Prerequisites:** Phases 00–04 committed.

## Steps

- [ ] **1. Keep-alive.** `api/keepalive.mjs`: `GET` → one lightweight Supabase REST
  request (`GET /rest/v1/?select=count&limit=1` with the anon key, which resets the
  7-day inactivity timer); `Cache-Control: no-store`; return `204`. Add the cron to
  `vercel.json` (the API rewrite exclusion already exists from phase 02):

  ```json
  {
    "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }],
    "crons": [{ "path": "/api/keepalive", "schedule": "0 9 * * *" }]
  }
  ```

  Hobby allows one run per day — this schedule is exactly at that limit.

- [ ] **2. Backups.** `api/backup.mjs` on a weekly cron
  (`0 3 * * 1`, Mondays 03:00): dump every editable table plus the two documents as one
  JSON file and upload to a private Supabase Storage bucket `backups`
  (`backups/YYYY-MM-DD.json`); list the bucket and delete all but the newest 8 files.
  Add the second cron entry. Owner step: create the private `backups` bucket in the
  Supabase dashboard (Storage → New bucket, private).
  Manual run for verification: `curl -H "Authorization: Bearer $CRON_SECRET" …` — add a
  `CRON_SECRET` env var checked by both cron endpoints so they cannot be triggered by
  strangers.

- [x] **3. Retire the localStorage service layer.** Done in phase 03.
  - `src/services/local-store.ts` and `src/data/storage.ts` are deleted; `createId`
    lives in `src/services/index.ts`.
  - The only remaining content-adjacent browser key is the last-good public cache
    (`ordacy-content:v1`) plus phase 03's local inquiry drafts, which phase 04
    replaces with the real inquiries endpoint.
  - Remove the now-unused `seed` export from `src/data/index.ts` if nothing imports it
    (`grep` first; the seed script reads JSON directly).
  - Settings page: “Restore original content” is gone; confirm no dead copy remains.

- [ ] **4. Documents.**
  - `AGENTS.md`: replace “no backend, env vars, tests” with the real stack (Supabase,
    Vercel functions, EmailJS, env var names, `npm test`); document `docs/implementation/`
    as the plan home; remove sample-machinery bullets; keep design language, controls,
    and state-system sections; note the Vercel Hobby commercial boundary.
  - `README.md`: update the status sections that still claim placeholders and no Git
    (the stale claims AGENTS already warns about).
  - These phase files: mark completed phases with their commit hash.

- [ ] **5. Final QA sweep.**
  - Harden icon resolution during hydration: an unknown icon name in the database
    must not fail the whole payload — fall back per item, like the state layer does.
  - All 11 public routes at 320/380/768/1440 in a production build served by
    `npx vercel dev` (or a preview deployment), ready + dev preview states. Note:
    `npm run preview` has no API; record that in AGENTS.md/README.
  - The "one `h1`" check counts visible headings. Legal pages keep their print-only
    `h1` inside `display: none` (intentional print semantics, not a defect).
  - Admin: every page, one create/edit/delete/reorder, sign-out, signed-out redirect.
  - Contact: real submission end-to-end; honeypot and throttle spot checks.
  - Both themes on Home, Contact, one legal page; reduced motion on a skeleton; keyboard
    focus through state panels and login.
  - Secrets: `grep -r "SERVICE_ROLE\|EMAILJS_PRIVATE\|CRON_SECRET" dist/` empty.
  - Controlled failure: bad `SUPABASE_URL` in a preview env → cached public content
    still serves; fresh visitor gets `RouteErrorPage`.

## Verification

- [ ] Four checks + `npm test` pass.
- [ ] Cron entries appear in the Vercel dashboard after deploy; `/api/keepalive` returns
  204; `/api/backup` writes one file and retention leaves at most 8.
- [ ] `grep -ri "localStorage" src/` shows only the last-good content cache (and any
  unrelated UI preferences), never content services.
- [ ] No route regressed; no console errors; no horizontal overflow beyond the known
  320 px desktop-scrollbar baseline.

## Checkpoint (owner)

Open the deployed URL on your phone and desktop, sign in, edit one FAQ, submit one
inquiry, and confirm the email. That is the production system.

## Review criteria

Cron endpoints are protected; backups restore-able (unzip one and compare counts);
localStorage path gone; docs truthful; licensing/terms boundary documented; all four
checks and tests green.

## Commit

`chore: keep-alive, backups, and backend cleanup`
