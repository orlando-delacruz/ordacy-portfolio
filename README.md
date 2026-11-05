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

Package manager: **npm** (`package-lock.json` is committed). No UI library, animation library, state management library, backend SDK, or analytics package is installed.

### Architecture principles

- React single-page application with client-side routing.
- Feature-based organization (`src/features`, one folder per page).
- Reusable shared components (`src/components`).
- Centralized design tokens and theme configuration (`src/styles/theme.ts`).
- Styled Components for all component styling.
- Shared application layout and navigation (`RootLayout`, `TopBar`, sidebar / bottom nav).
- TypeScript throughout, including a typed Styled Components theme (`src/types/styled.d.ts`).
- Responsive, mobile-first implementation.

## Project structure

Actual directory layout (abridged to meaningful entries):

```text
ordacy-portfolio/
├── index.html                 # entry HTML: title, meta, fonts, theme pre-hydration script
├── public/
│   └── favicon.svg            # static files served as-is
├── src/
│   ├── main.tsx               # React entry point
│   ├── app/
│   │   ├── App.tsx            # wires theme provider + router
│   │   ├── router.tsx         # route definitions
│   │   ├── ThemeProvider.tsx  # theme state, persistence, animated switching
│   │   ├── ThemeTransition.tsx# full-screen sun/moon theme-switch overlay
│   │   ├── theme-context.ts   # useAppTheme() hook
│   │   └── NotFoundPage.tsx   # 404 page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── RootLayout.tsx # shell: skip link, sidebar, Top Bar, content
│   │   │   └── TopBar.tsx     # responsive Top Bar + mobile More button
│   │   ├── navigation/
│   │   │   ├── navigation.ts  # single source of truth for nav items/routes
│   │   │   ├── DesktopSidebar.tsx
│   │   │   ├── MobileBottomNav.tsx
│   │   │   ├── MobileMoreMenu.tsx  # full-screen secondary navigation
│   │   │   ├── Wordmark.tsx   # theme-aware logo (BrandLogo) + wordmark
│   │   │   └── navigation.styled.ts # shared nav item styles
│   │   └── common/
│   │       └── PagePlaceholder.tsx  # temporary page scaffold
│   ├── features/              # one folder per route
│   │   ├── home/HomePage.tsx
│   │   ├── projects/ProjectsPage.tsx
│   │   ├── testimonials/TestimonialsPage.tsx
│   │   ├── pricing/PricingPage.tsx
│   │   ├── contact/ContactPage.tsx
│   │   ├── about/AboutUsPage.tsx
│   │   └── legal/             # PrivacyPolicyPage, TermsOfServicePage
│   ├── hooks/
│   │   └── useScrollDirection.ts # hides bottom nav on scroll down
│   ├── styles/
│   │   ├── theme.ts           # light/dark tokens + layout widths
│   │   ├── GlobalStyles.ts    # global CSS, reduced-motion handling
│   │   ├── breakpoints.ts     # sm/md/lg/xl
│   │   └── typography.ts      # font family, sizes, weights
│   ├── types/
│   │   └── styled.d.ts        # DefaultTheme typing
│   └── assets/
│       ├── images/            # ordacy-logo.png (light), ordacy-logo-dark-mode.png (dark)
│       ├── icons/             # reserved, currently empty
│       └── fonts/             # reserved, currently empty (webfont via Google Fonts)
└── package.json
```

There is no `utils/` directory, no `.env` files, no Vercel config, and no test setup in the repository.

### Code organization

Components keep their Styled Components in `styles/` folders next to their components (for example `src/features/home/sections/styles/hero.styled.ts`) and import them with `import * as S from './styles/hero.styled'`. Shared style fragments live beside their consumers (for example `src/features/home/components/styles/card.styled.ts`), feature data lives in `*.data.ts`, and reusable hooks live in `use*.ts`.

## Pages and routes

All routes are implemented in `src/app/router.tsx`. Every page currently renders through the shared `PagePlaceholder` component — **routes exist, but final page content does not**.

| Page | Route | Status |
| --- | --- | --- |
| Home | `/` | Placeholder |
| Projects | `/projects` | Placeholder |
| Testimonials | `/testimonials` | Placeholder — states genuine testimonials will be published when available |
| Pricing | `/pricing` | Placeholder |
| Contact | `/contact` | Placeholder |
| About Us | `/about-us` | Placeholder — one-line positioning statement, no invented history |
| Privacy Policy | `/privacy-policy` | Placeholder |
| Terms and Conditions | `/terms-of-service` | Placeholder (URL slug is `terms-of-service`) |
| Not Found | `*` | Implemented 404 page |

### Implementation notes per page

- **Homepage:** intended conversion-focused sections (hero, problems, pricing, projects, testimonials, how it works, FAQs, final CTA, footer) are **planned, not built**. Current page is a placeholder.
- **Projects:** portfolio rules (client permission, clearly labeled concept demos, no fabricated results, details in a modal) are **planned conventions, not enforced or implemented**.
- **Testimonials:** only genuine testimonials may ever be published; fabrication is prohibited. The page currently publishes none.
- **Pricing:** tiers (Starter / Growth / Custom), PHP/USD toggle, and contact-form CTAs are **planned, not built**. Treat any future prices as subject to verification.
- **Contact:** the inquiry form (fields, validation, spam protection, submission, confirmation, thank-you page) is **planned, not built**. No backend, database, email provider, or spam-protection integration exists in the codebase.

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

Process, timelines, payment terms, ownership, hosting, maintenance, and warranty details are **not yet published anywhere in the codebase** — all content pages are placeholders. Do not present the following as live website copy; they are recorded here as stated business intent only:

- Process: Discovery → Proposal and Scope → Design and Development → Testing and Handover.
- Timelines confirmed individually per scope; no universal completion promise.
- Payments: standard 50% upfront, 50% before final handover; larger projects may differ in writing.
- Ownership: client owns agreed custom deliverables after full payment; source code as specified in the agreement; third-party/pre-existing components keep original licensing.
- Hosting: client-owned hosting, domain, and accounts preferred; Ordacy assists with setup; recurring costs are the client's unless agreed otherwise.
- Maintenance optional and quoted separately; standard warranty intent is 30 days post-launch/handover covering reproducible spec failures (excluding new features, scope changes, client modifications, misuse, third-party outages).

## SEO and performance

Actual state (verified in `index.html`, `public/`, and source):

- Present: page `<title>`, meta description, `theme-color`, Google Fonts preconnects, semantic landmarks/headings, bundled optimized logo PNGs.
- **Missing / not implemented:** Open Graph tags, canonical URLs, `robots.txt`, sitemap, structured data, route-level code splitting (`React.lazy`), image lazy loading / responsive images, and any Vercel SPA-rewrite configuration (no `vercel.json` exists).

Do not describe SEO as complete.

## Prerequisites

- Node.js 20+ and npm (npm is the package manager; `package-lock.json` is committed).
- No environment variables, secrets, or external services are required — the app currently has no backend, database, email, analytics, or CMS integrations.

## Installation

```bash
npm install
npm run dev
```

## Development commands

All from `package.json` (verified — no other scripts exist):

- `npm run dev` — start the development server
- `npm run build` — type-check (`tsc -b`) and create a production build (`vite build` → `dist/`)
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run the TypeScript compiler

## Environment configuration

None. There are no `.env` files, no `.env.example`, and no `import.meta.env` usage in the source. If integrations (contact backend, analytics) are added later, document their variables here and provide an `.env.example` without secret values.

## Deployment

Intended platform is Vercel, but **no deployment configuration exists yet** (no `vercel.json`, no rewrites). For a Vite SPA on Vercel, direct access/refresh of nested routes (e.g. `/pricing`) requires a rewrite of all paths to `/index.html`; until that is configured, only root-path serving is guaranteed. Build output is `dist/` via `npm run build`. Verify deployment claims against live configuration before documenting them as working.

## Development workflow

- Iterative, page-by-page: public website first. Intended page order: Homepage → Projects → Pricing → Contact → legal pages → 404. Testimonials and About Us routes already exist as placeholders.
- A private admin dashboard is planned for a later phase and is **not present** in the codebase — do not document or build it as part of the public site.
- Rules: implement incrementally with review per page; prefer simple, maintainable solutions; no unnecessary dependencies; no overengineering; preserve shared-component behavior; avoid unrelated refactoring; test by impact.

## Project status

| Area | Status |
| --- | --- |
| App shell, navigation, Top Bar, More menu | Implemented |
| Light/dark themes, persistence, animated transition | Implemented |
| Brand logo (light/dark), wordmark styling | Implemented |
| Width constraints (1440 content / 1680 app) | Implemented |
| All 8 public routes + 404 | Implemented (routes only) |
| Page content (hero, pricing tiers, forms, copy) | Planned — all pages are placeholders |
| Contact form + backend/email/spam protection | Planned — no integration exists |
| Pricing tiers, PHP/USD toggle | Planned |
| Project modals, testimonials content | Planned (genuine content only) |
| SEO (OG, sitemap, robots, structured data) | Missing |
| Vercel deployment config + SPA rewrites | Missing |
| Admin dashboard | Planned, later phase |

## Repository safety

This repository uses Git. Do not commit, push, create/switch branches, merge, rebase, reset, or discard work unless explicitly asked. Inspect status/diffs read-only.
