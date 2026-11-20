# Backend integration — implementation docs

Design locked 2026-11-20. Phases 00–05 below turn the browser-local CMS into a real
persistent backend. Read this file first; each phase file is a self-contained, ordered
procedure with its own checks and review criteria.

Current state at lock time: commit `c12a5bf` (public loading, empty, error, and success
states). Content lives in `data/database/*.json`; admin edits persist in this browser's
localStorage; the contact form writes an inquiry record to localStorage only. No server,
no database, no auth.

## Target architecture

- **Host:** Vercel Hobby (existing). Static SPA + serverless functions in `api/` + one
  daily cron. Hobby is personal, non-commercial use only; this project qualifies as the
  owner's own portfolio. Handing a client's business site to this plan would require
  Vercel Pro or a free commercial host (Cloudflare Pages/Workers, Netlify) — the app is
  a static SPA plus standard fetch handlers, so that move stays a function-layer port.
- **Database:** Supabase Free (Postgres). Project region: Southeast Asia (Singapore),
  nearest to the owner. Free projects pause after ~7 days of low activity; a daily
  keep-alive ping prevents it, Supabase's warning email is the backstop, and the edge +
  browser caches below keep the public site serving content even during a pause.
- **Auth:** Supabase Auth — one owner account (email + password) with TOTP two-factor.
  No hand-rolled password or session code.
- **Email:** EmailJS Free (200/month). Notifications are sent **server-side** from the
  inquiries function via EmailJS's REST API; the private key never ships to the client.
  The inquiry row is written **before** the email is attempted; email failure never
  loses a lead.
- **Public delivery:** `GET /api/content` returns all published editable content in one
  payload, cached at the edge (`s-maxage=60, stale-while-revalidate=86400`). The browser
  keeps the last successful payload in localStorage and uses it if the API ever fails.
  The existing `RouteLoading` skeleton shows during the initial fetch; `RouteErrorPage`
  shows only when there is no cached copy.
- **Admin:** the admin UI is unchanged. `src/services` keeps its `Collection` and
  `DocumentStore` interfaces and gains an HTTP implementation; the UI never talks to
  Supabase directly. Every admin endpoint verifies the caller's Supabase JWT
  server-side; the service-role key exists only in function environment variables.
- **Reliability:** daily `/api/keepalive` cron; weekly `/api/backup` dump to Supabase
  Storage (last 8 kept), because free-tier point-in-time restore is thin.

## Locked decisions

1. **Persistence and inquiries are real; no fake content publicly.** All `isSample`
   records and all six `type: "concept-demo"` projects are removed in phase 00. Public
   pages show their built empty states until real content is entered through admin.
   The sample machinery (badges, locks, fallbacks, `isSample` field) is deleted.
2. **JSON stays as the dev seed and the migration source** (`data/database/*.json`).
   Static, non-admin-editable content stays in JSON forever and is imported at build
   time: `problems`, `process`, `legal`, `states`, `admin-navigation`. Everything the
   admin edits lives in Postgres: `pages`, `services`, `plans`, `faqs`, `projects`,
   `testimonials`, `team`, `gallery`, `inquiries`, `seo`, plus the `site` and `settings`
   documents.
3. **Schema mirrors the TypeScript records exactly** — typed columns for scalars,
   `jsonb` for nested shapes, `text` ids. Keep the project `type` field.
4. **Access control:** RLS enabled on every table with no anon policies. The public
   reads only through `/api/content`; admin writes only through authenticated
   `/api/admin/*`. Functions use the service-role key.
5. **Contact form:** honeypot field plus per-IP-hash throttle (own DB, no third party).
   EmailJS template configured in their dashboard; variables listed in phase 04.
6. **Minimal tests:** `node --test` for the API rules — auth gate, published filtering,
   inquiry validation, throttle, save-before-email order. The repo gains a `test`
   script; AGENTS.md's "no tests" rule is amended in phase 05.
7. **Git cadence:** each phase ends with the four checks, an independent review, the
   owner's checkpoint, and its own commit.
8. **Docs live here.** Every changed decision updates the matching phase file the same
   day.

## Environment variables

Client (Vite exposes only `VITE_*`; safe to ship):

| Name | Source |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | same page (also used for server JWT verification) |

Server only (Vercel env vars + local `.env.local`, which `.gitignore`'s `*.local` covers):

| Name | Source |
| --- | --- |
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_ANON_KEY` | same |
| `SUPABASE_SERVICE_ROLE_KEY` | same page, secret — **never** in client code |
| `EMAILJS_SERVICE_ID` | EmailJS → Email Services |
| `EMAILJS_TEMPLATE_ID` | EmailJS → Email Templates |
| `EMAILJS_PUBLIC_KEY` | EmailJS → Account |
| `EMAILJS_PRIVATE_KEY` | EmailJS → Account (server-side sending) |

## Local development

Vite alone does not run `api/` functions. From phase 01 onward use `npx vercel dev`
(free, no login required for local) or keep `npm run dev` for UI-only work and point the
data layer at a deployed preview API. The four checks stay:

```bash
npm run typecheck
npm run lint
npm run check:grid
npm run build
```

From phase 03 onward add `npm test`.

## Phase index

| Phase | File | Outcome |
| --- | --- | --- |
| 00 | [00-content-cleanup.md](00-content-cleanup.md) | Honest site: samples and concept projects removed, machinery deleted |
| 01 | [01-database-and-seed.md](01-database-and-seed.md) | Supabase project, schema, seeded content |
| 02 | [02-public-live-reads.md](02-public-live-reads.md) | Public site reads the cached API; last-good fallback |
| 03 | [03-auth-and-admin-crud.md](03-auth-and-admin-crud.md) | Owner login with TOTP; admin persists through the API |
| 04 | [04-contact-and-email.md](04-contact-and-email.md) | Real inquiries + EmailJS notification; spam protection |
| 05 | [05-keepalive-backups-cleanup.md](05-keepalive-backups-cleanup.md) | Keep-alive, backups, localStorage retired, final QA |

Each phase file ends with **Checkpoint** (what the owner verifies) and **Commit** (the
message for that phase's single commit).

## Non-goals

No framework migration, no SSR, no realtime updates, no multi-admin roles, no image
uploads this round (Supabase Storage is ready when that phase is requested), no email
beyond the owner notification, no paid tiers, and no fabricated content at any point.
