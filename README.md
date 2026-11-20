# Ordacy

Public website for **Ordacy**, a custom software development and digital solutions service provider serving startups and businesses in the Philippine and international markets.

The website's primary purpose is **client acquisition and lead generation**: communicating services, explaining how Ordacy helps businesses, presenting pricing, showcasing projects, establishing trust, and encouraging inquiries.

- **Brand positioning:** "Better systems. Smarter business."
- **Brand description:** Ordacy builds custom digital systems that help businesses manage their operations, serve customers, and grow with greater clarity and control.
- **Language:** English.

## Technology stack

Verified against `package.json` and the source code:

| Technology | Version | Use |
| --- | --- | --- |
| React | 19 | UI library (single-page application) |
| Vite | 8 | Build tool and dev server |
| TypeScript | 6 | Type safety (`tsc -b` in build and typecheck) |
| React Router | 7 | Client-side routing (`createBrowserRouter`) |
| Styled Components | 6 | Component styling |
| Lucide React | 1.66+ | Icons (most UI) |
| Phosphor Icons | 2.1+ | Bottom-nav regular/fill icon pairs |
| Plus Jakarta Sans | Google Fonts | Primary typeface (loaded in `index.html`) |
| Supabase | — | Postgres content, inquiries, owner Auth (password + TOTP), private Storage backups |
| EmailJS | — | Server-side owner notification from `/api/inquiries` |
| Vercel Functions | — | Node handlers in `api/` (content, admin, inquiries, keepalive, backup) |

Package manager: **npm** (`package-lock.json` is committed). No UI library, animation library, state management library, or analytics package is installed.

### Architecture principles

- React single-page application with client-side routing.
- Feature-based organization (`src/features`, one folder per page).
- Reusable shared components (`src/components`).
- Centralized design tokens and theme configuration (`src/styles/theme.ts`).
- Styled Components for all component styling.
- Shared application layout and navigation (`RootLayout`, `TopBar`, sidebar / bottom nav).
- TypeScript throughout, including a typed Styled Components theme (`src/types/styled.d.ts`).
- Responsive, mobile-first implementation.
- Public content is read from `GET /api/content` and cached at the edge; the browser keeps the last good payload for outages.
- The `/admin` CMS writes through authenticated `POST/PATCH/DELETE /api/admin` calls; Supabase Auth (password + TOTP) is the gate.
- Contact submissions save to Postgres before the EmailJS notification is attempted; failures keep the lead.
- Two Vercel Hobby crons keep the free Supabase project awake and write weekly private backups.

## Project structure

Actual directory layout (abridged to meaningful entries):

```text
ordacy-portfolio/
├── index.html                 # entry HTML: title, meta, fonts, theme pre-hydration script
├── vercel.json                # SPA rewrite + keepalive/backup crons
├── api/                       # Vercel Node functions
│   ├── content.mjs            # public published payload (edge cached)
│   ├── admin.mjs              # authenticated CRUD + documents
│   ├── inquiries.mjs          # public contact submit, then EmailJS
│   ├── keepalive.mjs          # daily Supabase activity ping
│   ├── backup.mjs             # weekly private Storage dump
│   └── _lib/                  # auth, rules, maps, HTTP, cron, backup helpers
├── data/
│   ├── database/              # JSON seed and static-page source
│   └── icons.json             # icon allowlist shared with the API
├── docs/implementation/       # backend phase plans, status, and commits
├── supabase/schema.sql        # tables, RLS, grants
├── scripts/                   # dev API bridge, seed, auth-info, grid check
├── public/                    # favicons, robots.txt, sitemap.xml, documents
├── tests/                     # node --test rules, maps, retention, icon fallback
├── src/
│   ├── main.tsx               # bootstrap: content fetch, draft drain, app mount
│   ├── app/                   # App, router, ThemeProvider, route states
│   ├── components/
│   │   ├── layout/            # RootLayout, TopBar
│   │   ├── navigation/        # nav config, sidebar, bottom nav, More menu
│   │   ├── state/             # PageState, StatePanel, dev previews
│   │   ├── skeletons/         # shared skeleton primitives
│   │   └── ui/                # Section, cards, buttons, lightbox, CTA banner
│   ├── features/              # one folder per public route, plus admin/
│   ├── hooks/                 # scroll, media query, focus trap, reveal
│   ├── services/              # admin + contact HTTP layer, Supabase client
│   ├── styles/                # tokens, global styles, typography
│   ├── types/                 # styled-components theme typing
│   └── assets/                # logo images
└── package.json
```

The repository has `.env.example` (copy to gitignored `.env.local`), a Vercel config, and a Node test suite; there is no `utils/` directory.

### Code organization

Components keep their Styled Components in `styles/` folders next to their components (for example `src/features/home/sections/styles/hero.styled.ts`) and import them with `import * as S from './styles/hero.styled'`. Shared style fragments live beside their consumers (for example `src/features/home/components/styles/card.styled.ts`), feature data lives in `*.data.ts`, and reusable hooks live in `use*.ts`.

## Pages and routes

All routes are implemented in `src/app/router.tsx` and rendered from published Supabase content.

| Page | Route | Status |
| --- | --- | --- |
| Home | `/` | Built |
| Projects | `/projects` | Built; shows its honest empty state until a permissioned project is published |
| Testimonials | `/testimonials` | Built; shows its empty state until approved client feedback is published |
| Pricing | `/pricing` | Built; prices are business intent and should be verified before launch |
| FAQs | `/faqs` | Built |
| Contact | `/contact` | Built; real inquiry form |
| About Us | `/about-us` | Built |
| Privacy Policy | `/privacy-policy` | Built; not lawyer-reviewed |
| Terms and Conditions | `/terms-of-service` | Built; URL slug is `terms-of-service` |
| Team profile | `/team/:slug` | Built per published member |
| Admin | `/admin/*` | Built; password + TOTP, noindex |
| Not Found | `*` | Built 404 page |

### Implementation notes per page

- **Homepage:** hero, services, pricing, projects carousel, testimonials, process, FAQs, final CTA, and footer are built. Optional sections hide when they have no published records.
- **Projects:** image-led cards with a details dialog; the grid and mobile row show an empty state while no permissioned projects exist.
- **Testimonials:** only genuine, approved testimonials are published. With none, the page shows its empty state and the trust content below it.
- **Pricing:** Starter / Growth / Custom tiers with a PHP/USD toggle; the toggle has an accessible name only. No recommended badge or tinted panel.
- **Contact:** validation and throttle run server-side; a honeypot absorbs bots; the inquiry is saved before EmailJS is attempted. The visible success panel says "Inquiry received." Email delivery is verified server-side.

## Navigation system

Route metadata lives in `src/components/navigation/navigation.ts` — the single source of truth for labels, paths, and icons.

### Desktop sidebar (`DesktopSidebar.tsx`)

- Fixed, collapsible sidebar (expanded 264px, compact 84px) with icon tooltips in compact mode.
- Collapse/expand is controlled from an **icon-only button in the Top Bar** (there is no Collapse item in the sidebar).
- Primary links: Home, Projects, Testimonials, Pricing, Contact.
- Secondary links: About Us, Privacy Policy, Terms and Conditions.
- No More item. Active state is a teal-tinted background with teal text — no left-side indicator.

### Mobile bottom navigation (`MobileBottomNav.tsx`)

Icon-only, five equal 68×48 buttons sharing one vertical centerline: Home, Projects, **Contact**, Pricing, Testimonials.

- Contact stays centered, fully inside the bar, with a teal circular highlight, telephone icon, and a subtle repeating echo ring (disabled under `prefers-reduced-motion`).
- All buttons expose `aria-label`s; there is no visible text.
- The bar hides on scroll down and reappears on scroll up (`useScrollDirection`), respects safe-area insets, and has 0.5rem top/bottom padding.

### Top Bar (`TopBar.tsx`)

- **Mobile:** Ordacy logo + wordmark on the left; theme toggle and a More (hamburger) button on the right.
- **Desktop:** sidebar-collapse icon button and the current page title on the left; theme toggle (and the mobile-only More button, hidden on desktop) on the right.
- The More button opens a native-`<dialog>` **full-screen menu** with About Us, Privacy Policy, and Terms and Conditions only. It supports close-button, Escape, backdrop browser-back (`#more` hash), scroll locking, focus return, and a Tab trap.

### Brand

`Wordmark.tsx` exports the theme-aware `BrandLogo` (light/dark PNGs from `src/assets/images`) and the `ORDACY` wordmark: Plus Jakarta Sans, bold (700), 20px, `-0.04em` letter spacing, theme-aware color. Used in the sidebar, mobile Top Bar, and More menu.

## Theme system

Implemented in `src/app/ThemeProvider.tsx` + `src/styles/theme.ts`, exposed via `useAppTheme()`.

- Light/dark toggle, persisted to `localStorage`.
- Falls back to `prefers-color-scheme`, then light.
- An inline `index.html` script applies the saved/system theme before React mounts to avoid a wrong-theme flash; `color-scheme` and `theme-color` stay in sync.
- Components consume centralized tokens (backgrounds, surfaces, text, borders, brand, shadows) — no hardcoded theme colors in components.

### Theme transition animation (implemented)

Toggling the theme plays a ~950ms full-screen overlay in the destination theme color: the outgoing Lucide icon (Sun for light→dark, Moon for dark→light) rotates/scales out while the incoming icon rotates/scales in with a teal glow, then the overlay fades. Repeat clicks during the animation are ignored; commit and removal are timer-driven so the theme cannot get stuck; `prefers-reduced-motion` switches instantly with no overlay.

## Design system

- **Brand colors:** `#00DAB9` (primary), `#00CDAF` (secondary), `#00585E` (deep), `#00243E` (navy), `#FEFEFE` (white). The dark theme complements these with deep-navy surfaces (`#001A2C`, `#022238`, `#041E31`), near-white text (`#F1F8F7`), and a `#5FE7D4` accent.
- **Typography:** Plus Jakarta Sans only. Display/body sizes, weights (400–800), and tight/normal/relaxed line heights in `src/styles/typography.ts`.
- **Icons:** Lucide React for most UI; Phosphor Icons for the mobile bottom nav's regular/fill pair.
- **Direction:** modern, clean, professional, minimal, business-oriented, mobile-first, consistent spacing and hierarchy.

## Responsive layout

- **Desktop:** fixed sidebar + main content + Top Bar. The Top Bar and page content share one centered container.
- **Width caps** (`src/styles/theme.ts` → `layout`): content max `1440px` (`contentMaxWidth`), whole application max `1680px` (`appMaxWidth`).
- **Ultra-wide:** sidebar and content travel together inside the centered 1680px wrapper — the sidebar is offset from the viewport edge and the content region is capped beside it, so neither drifts apart nor stretches.
- **Tablet/mobile:** sidebar hidden below `lg`; compact Top Bar with icon-only bottom navigation; no horizontal overflow at any tested breakpoint (320–2000px).

## Business policies and service information

The business offers these service categories: Custom Business Management Systems; Booking and Scheduling Systems; Internal Dashboards and Admin Tools; Inventory and Sales Systems; Custom Websites and Web Applications; CRM and Customer Management Systems.

Process, timelines, payment terms, ownership, hosting, maintenance, and warranty details are published in the FAQ, About, Pricing notes, and Terms content (`data/database/faqs.json`, `pages.json`, `legal.json`). Keep every page consistent with these terms and do not invent new commitments:

- Process: Discovery → Proposal and Scope → Design and Development → Testing and Handover.
- Timelines confirmed individually per scope; no universal completion promise.
- Payments: standard 50% upfront, 50% before final handover; larger projects may differ in writing.
- Ownership: client owns agreed custom deliverables after full payment; source code as specified in the agreement; third-party/pre-existing components keep original licensing.
- Hosting: client-owned hosting, domain, and accounts preferred; Ordacy assists with setup; recurring costs are the client's unless agreed otherwise.
- Maintenance optional and quoted separately; standard warranty is 30 days post-launch/handover covering reproducible spec failures (excluding new features, scope changes, client modifications, misuse, third-party outages).

## SEO and performance

Actual state (verified in `index.html`, `public/`, and source):

- Present: per-page `<title>`, description, canonical, and Open Graph tags via `usePageMeta`; `robots.txt` (with `Disallow: /admin`) and `sitemap.xml`; `theme-color`; semantic landmarks and one visible `h1` per page; route-level code splitting for non-home pages; bundled optimized logo PNGs.
- **Missing / not implemented:** Open Graph image, structured data, image lazy loading / responsive images, and an auto-generated sitemap (the file is static).
- `robots.txt` and `sitemap.xml` assume `https://ordacy.com`; `siteUrl` in `site.json` is unconfirmed.

Do not describe SEO as complete.

## Prerequisites

- Node.js 20+ and npm (npm is the package manager; `package-lock.json` is committed).
- Supabase and EmailJS values for the live backend, admin, and inquiry email; copy `.env.example` to `.env.local` and see [Environment configuration](#environment-configuration).
- For live email, enable "API access from non-browser environments" in EmailJS → Account → Security; without it, server-side sends return 403.

## Installation

```bash
npm install
npm run dev
```

## Development commands

All from `package.json` (verified):

- `npm run dev` — Vite dev server with the real `api/*.mjs` handlers
- `npm run build` — type-check (`tsc -b`) and create a production build (`vite build` → `dist/`)
- `npm run preview` — preview `dist/`. It has no API handlers, so public content uses the last-good browser cache or shows the error page; use `npm run dev` for backend work
- `npm run lint` — run ESLint
- `npm run typecheck` — run the TypeScript compiler
- `npm run check:grid` — verify spacing/radius/icon sizes against the 4/8-point grid
- `npm test` — Node test runner for API rules, map round-trips, backup retention, and icon fallback

## Environment configuration

`npm run dev` loads `.env.local` (`.gitignore`'s `*.local` covers it); copy
`.env.example` and fill the values. Vercel needs the same names in project settings.
Never put a server-only value behind a `VITE_` name.

| Name | Scope | Source |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Client (public by design) | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Client (public by design) | Same page |
| `SUPABASE_URL` | Server only | Same page |
| `SUPABASE_ANON_KEY` | Server only | Same page |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Same page, secret |
| `ADMIN_USER_ID` | Server only | `node --env-file=.env.local scripts/auth-info.mjs`; unset denies every admin request |
| `ADMIN_TOTP_FACTOR_ID` | Server only | Same script; re-record after any factor reset; unset denies every admin request |
| `EMAILJS_SERVICE_ID` | Server only | EmailJS → Email Services |
| `EMAILJS_TEMPLATE_ID` | Server only | EmailJS → Email Templates |
| `EMAILJS_PUBLIC_KEY` | Server only | EmailJS → Account |
| `EMAILJS_PRIVATE_KEY` | Server only | EmailJS → Account |
| `INQUIRY_IP_SALT` | Server only | Any long random string; unset makes `/api/inquiries` fail closed |
| `CRON_SECRET` | Server only | Any long random string; `api/keepalive.mjs` and `api/backup.mjs` fail closed with `401` without it. Vercel cron requests carry it automatically |

Vercel needs every server name in Production, Preview, and Development, then a redeploy. The owner also needs to enable EmailJS's "API access from non-browser environments" setting and confirm the private Supabase Storage bucket `backups` exists. `api/backup.mjs` creates the bucket on first run, forces it private, uploads `backups/YYYY-MM-DD.json`, and keeps the newest 8 dated files.

## Deployment

The app deploys to Vercel as a static SPA plus Node functions in `api/`. `vercel.json` rewrites every non-API path to `/index.html` and schedules two Hobby-compatible crons:

- `/api/keepalive` — `0 9 * * *` (daily) resets the Supabase free-tier inactivity timer.
- `/api/backup` — `0 3 * * 1` (Mondays 03:00 UTC) writes the weekly private backup.

Verify the cron entries appear in the Vercel dashboard after deploying, then run one manual backup with `Authorization: Bearer <CRON_SECRET>` and confirm a file appears in the `backups` bucket. Build output is `dist/` via `npm run build`. Do not claim a live deployment or email delivery until it has been verified.

## Development workflow

- Public pages, the state system, and the authenticated admin are built. Treat `docs/implementation/` as the record of the backend phases; each phase file carries its status and commit.
- Rules: implement incrementally with review; prefer simple, maintainable solutions; no unnecessary dependencies; no overengineering; preserve shared-component behavior; avoid unrelated refactoring; test by impact. Run `npm test` when the API rules, backups, or data maps change.

## Project status

| Area | Status |
| --- | --- |
| App shell, navigation, Top Bar, More menu | Implemented |
| Light/dark themes, persistence, animated transition | Implemented |
| Brand logo (light/dark), wordmark styling | Implemented |
| Width constraints (1440 content / 1680 app) | Implemented |
| Public routes, team profiles, 404 | Implemented |
| Public page content and state system | Implemented; empty collections show their honest empty states |
| Contact form, database save, spam protection | Implemented |
| EmailJS notification | Implemented; server-side sends verified (EmailJS) |
| Pricing tiers, PHP/USD toggle | Implemented; verify prices before launch |
| Project cards/modal, testimonials | Implemented; publish genuine content only |
| Admin CMS (password + TOTP, CRUD) | Implemented |
| Keep-alive and weekly backups | Implemented; bucket created and one local backup written; Vercel env/cron confirmation pending |
| SEO (page tags, robots, sitemap) | Implemented; OG image and structured data missing |
| Vercel config (SPA rewrite + crons) | Implemented; live cron verification pending |

## Repository safety

This repository uses Git. Do not commit, push, create/switch branches, merge, rebase, reset, or discard work unless explicitly asked. Inspect status/diffs read-only.
