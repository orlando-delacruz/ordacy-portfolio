-- Ordacy portfolio — Supabase (Postgres) schema.
--
-- Apply ONCE, by hand, in the Supabase SQL Editor (no CLI dependency).
-- Re-running the file resets the database: it drops and recreates every
-- table below, so it is only for initial setup or a deliberate re-init
-- followed by `node --env-file=.env.local scripts/seed-supabase.mjs`.
-- It also deletes real contact inquiries (leads); export them first.
--
-- The tables mirror the record types in `src/data/types.ts` exactly:
--   * scalar fields are typed columns;
--   * nested objects and arrays of objects are `jsonb`;
--   * string arrays are `text[]`;
--   * every id is `text` (the app generates slugs and prefixed ids);
--   * timestamps stay `text` holding the ISO strings the app already
--     stores and compares. `timestamptz` would normalize the value and
--     rewrite the string, so `text` keeps round-trip fidelity.
-- Column names are snake_case; the API maps them back to the app's
-- camelCase records (see scripts/seed-supabase.mjs for the mapping).

-- Clean drop/create strategy. The script runs once against a fresh project;
-- an `if not exists` strategy would silently keep an outdated table after a
-- column change. Drop first so the result always matches this file.
begin;

drop table if exists public.pages;
drop table if exists public.services;
drop table if exists public.plans;
drop table if exists public.faqs;
drop table if exists public.projects;
drop table if exists public.testimonials;
drop table if exists public.team;
drop table if exists public.gallery;
drop table if exists public.inquiries;
drop table if exists public.seo;
drop table if exists public.site;
drop table if exists public.settings;
drop table if exists public.inquiry_throttle;

-- PageRecord
create table public.pages (
  id text primary key,
  label text not null,
  path text not null,
  header jsonb,
  sections jsonb not null
);

-- ServiceRecord
create table public.services (
  id text primary key,
  icon text not null,
  title text not null,
  description text not null,
  problem text not null,
  capabilities text[] not null,
  use_cases text[] not null,
  audience text not null,
  display_order integer not null,
  is_published boolean not null
);

-- PlanRecord
create table public.plans (
  id text primary key,
  name text not null,
  icon text not null,
  category text not null,
  prices jsonb not null,
  positioning text not null,
  fits text[] not null,
  cta text not null,
  cta_icon text not null,
  display_order integer not null,
  is_published boolean not null
);

-- FaqRecord
create table public.faqs (
  id text primary key,
  icon text not null,
  category text not null,
  question text not null,
  answer text not null,
  featured boolean not null,
  pricing_page boolean not null,
  display_order integer not null,
  is_published boolean not null
);

-- ProjectRecord (the `type` discriminator is kept by design)
create table public.projects (
  id text primary key,
  slug text not null unique,
  title text not null,
  type text not null check (type in ('client-project', 'concept-demo')),
  icon text not null,
  category text not null,
  summary text not null,
  details text not null,
  challenge text not null,
  solution text not null,
  features text[] not null,
  image jsonb not null,
  screenshots jsonb not null,
  url text,
  is_published boolean not null,
  display_order integer not null,
  created_at text not null,
  updated_at text not null
);

-- TestimonialRecord
create table public.testimonials (
  id text primary key,
  quote text not null,
  name text not null,
  role text not null,
  company text not null,
  rating integer check (rating is null or rating between 1 and 5),
  initials text not null,
  status text not null check (status in ('pending', 'approved')),
  is_published boolean not null,
  display_order integer not null,
  created_at text not null
);

-- TeamMemberRecord
create table public.team (
  id text primary key,
  slug text not null unique,
  name text not null,
  role text not null,
  initials text not null,
  avatar jsonb,
  resume_url text,
  headline text not null,
  summary text not null,
  facts jsonb not null,
  skills text[] not null,
  skill_groups jsonb,
  experience jsonb not null,
  education jsonb not null,
  certifications jsonb not null,
  languages text[] not null,
  display_order integer not null,
  is_published boolean not null,
  created_at text not null,
  updated_at text not null
);

-- GalleryImageRecord
create table public.gallery (
  id text primary key,
  src text not null,
  title text not null,
  alt text not null,
  caption text,
  display_order integer not null,
  is_published boolean not null,
  created_at text not null
);

-- InquiryRecord
create table public.inquiries (
  id text primary key,
  full_name text not null,
  email text not null,
  company text,
  project_type text,
  budget_range text,
  details text not null,
  target_launch_date text,
  status text not null check (status in ('new', 'in-progress', 'completed')),
  submitted_at text not null
);

-- SeoRecord (PageSeo + id)
create table public.seo (
  id text primary key,
  path text not null,
  title text not null,
  description text not null,
  canonical text,
  og_title text,
  og_description text,
  og_image text,
  noindex boolean not null default false
);

-- SiteRecord / SettingsRecord documents. `value` holds the record exactly
-- as the app expects it (camelCase keys, timestamps as ISO strings).
create table public.site (
  key text primary key check (key = 'site'),
  value jsonb not null
);

create table public.settings (
  key text primary key check (key = 'settings'),
  value jsonb not null
);

-- Operational store for the contact form's per-IP throttle (Phase 04).
-- Keys are salted IP hashes; no personal data. Server-only like everything
-- else here.
create table public.inquiry_throttle (
  ip_hash text primary key,
  window_start timestamptz not null,
  request_count integer not null
);

-- Row Level Security, enabled everywhere with no policies.
-- Deliberate deny-all: anon and authenticated callers get no direct table
-- access, so there is no policy surface to get wrong. The public reads only
-- through /api/content and the admin writes only through authenticated
-- /api/admin/*; both use the service-role key, which bypasses RLS.
alter table public.pages enable row level security;
alter table public.services enable row level security;
alter table public.plans enable row level security;
alter table public.faqs enable row level security;
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.team enable row level security;
alter table public.gallery enable row level security;
alter table public.inquiries enable row level security;
alter table public.seo enable row level security;
alter table public.site enable row level security;
alter table public.settings enable row level security;
alter table public.inquiry_throttle enable row level security;

-- Defense in depth: RLS already denies rows, and these revokes remove the
-- table privileges Supabase grants to anon/authenticated by default.
-- service_role gets explicit grants below: some projects do not carry the
-- default grants, which would otherwise block the service role too.
revoke all on
  public.pages, public.services, public.plans, public.faqs,
  public.projects, public.testimonials, public.team, public.gallery,
  public.inquiries, public.seo, public.site, public.settings,
  public.inquiry_throttle
from anon, authenticated;

grant all on
  public.pages, public.services, public.plans, public.faqs,
  public.projects, public.testimonials, public.team, public.gallery,
  public.inquiries, public.seo, public.site, public.settings,
  public.inquiry_throttle
to service_role;

commit;
