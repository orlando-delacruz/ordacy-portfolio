# Phase 01 — Database and seed

**Goal:** a real Supabase Postgres database whose tables mirror the app's record types,
seeded from the cleaned JSON.

**Prerequisites:** Phase 00 committed; a Supabase account (free, no card).

## Owner setup checklist (identity steps — the agent can drive the clicks)

- [ ] Create an account at supabase.com (GitHub or email; click the verification email).
- [ ] Create a project: name `ordacy-portfolio`, region **Southeast Asia (Singapore)**,
  database password saved in a password manager.
- [ ] Project Settings → API: copy **Project URL**, **anon public key**, and
  **service_role secret**.
- [ ] Add all three plus the `VITE_*` pair to Vercel → Project → Settings →
  Environment Variables (Production, Preview, Development) and to a local `.env.local`
  (covered by `.gitignore`'s `*.local`).

## Steps

- [ ] **1. Add the client dependency.** `npm install @supabase/supabase-js`. This is the
  only new runtime dependency in the plan.

- [ ] **2. Write `supabase/schema.sql`.** One table per editable collection, mirroring
  `src/data/types.ts` exactly:
  - Collections (`id text primary key`, scalar columns typed, nested shapes `jsonb`;
    `display_order` / `is_published` / timestamps only where the record type has
    them — `pages` and `seo` do not): `pages`, `services`, `plans`, `faqs`,
    `projects`, `testimonials`, `team`, `gallery`, `inquiries`, `seo`.
  - Documents: `site` and `settings`, single row keyed by a `key text primary key`
    (`'site'`, `'settings'`), `value jsonb`.
  - Operational: `inquiry_throttle` (`ip_hash text primary key`, `window_start
    timestamptz`, `request_count integer`), used by phase 04. Not seeded.
  - Every table: `alter table … enable row level security;` and **no policies** — anon
    and authenticated clients get nothing directly. Explicitly revoke their table
    privileges and grant all to `service_role`, because some projects do not carry the
    default grants; only the service role (functions) reads and writes.
  - Keep the project `type` column; no `is_sample` column exists anywhere.
  - Name columns in `snake_case`; the API maps them back to the camelCase TS records.

- [ ] **3. Apply the schema.** Owner pastes `supabase/schema.sql` into the Supabase SQL
  Editor and runs it (no CLI dependency). Confirm all 13 tables appear in Table Editor
  (12 content tables plus `inquiry_throttle`).

- [ ] **4. Write `scripts/seed-supabase.mjs`.**
  - Reads `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (run with
    `node --env-file=.env.local scripts/seed-supabase.mjs`).
  - Wipes each target table (`delete` without a filter) and inserts the cleaned
    `data/database/*.json` records for: pages, services, plans, faqs, projects,
    testimonials, team, gallery, inquiries, seo; plus `site` and `settings` documents.
  - Maps camelCase → snake_case explicitly (no reflection magic).
  - Prints a per-table row count and fails loudly on the first error.
  - Document at the top: this script is destructive by design; run it only to
    (re)initialize a database from the JSON seed.

- [ ] **5. Run the seed** and compare counts with the JSON files.

## Verification

- [ ] Supabase Table Editor shows every row; row counts match the JSON files; `projects`,
  `testimonials`, `gallery`, `inquiries` are empty by design.
- [ ] No secrets in the repo: `git status` clean apart from the intended files; grep for
  the service-role key value returns nothing.
- [ ] `npm run typecheck`, `npm run lint`, `npm run check:grid`, `npm run build` pass.
- [ ] A direct REST request with the **anon** key to any table returns no rows
  (RLS deny-all proof), while a function using the service role can read.

## Checkpoint (owner)

Open the Supabase Table Editor and see your real content sitting in the tables. Confirm
the four empty collections are empty.

## Review criteria

Schema mirrors the record types with no drift; RLS deny-all on every table; seed is
deterministic, destructive-by-design, and documents that; no client-bundle secrets; no
app behavior changed yet.

## Commit

`feat: add supabase schema and seed script`
