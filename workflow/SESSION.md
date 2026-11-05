# Session Context

## Last Updated
2026-11-06T00:20:49+08:00

## Project Overview
Ordacy portfolio / lead-gen site plus an admin CMS frontend. React 19, TS 6, Vite 8, React Router 7, styled-components 6, lucide-react. Frontend only: no backend, auth, or real persistence. Conventions in `CLAUDE.md` / `AGENTS.md` (both updated this session; AGENTS.md wins on conflict).

## Current Objective
Last task done: "Complete Production-Ready Website and Admin CMS". Every public route and admin route is complete, uses shared `/data` content, and shows no demo/draft wording. Awaiting user review. No task in progress.

## Requirements and Constraints
- All content and records live in `data/database/*.json`. UI → `src/services` (admin) / `@/data` (public) → JSON + browser-local overlay. No content or mock records in JSX.
- Never invent clients, testimonials, results, prices, credentials, integrations, or persistence claims. Prices are static per currency, never converted.
- No "Demo mode", "coming soon", "draft", or "prototype" wording in the UI. Be honest via Settings → Integrations ("Not configured").
- Sample records (`isSample: true`) can never be published.
- No backend, no new dependencies, no git commit/stage/reset/branch ops. Preserve user's uncommitted work.
- User mandates (icons on every button, bold button text, project card/modal layout, pricing rules) still apply.

## Decisions Made
- **Theme:** follows the system theme, with a saved manual override (`ordacy-theme`) and a pre-hydration script in `index.html`. This reverses commit 28459ea, per the user's standard.
- **Data:** JSON in `data/database/` (user asked for `/data/database`), aliased `@data/*`; typed layer in `src/data` (`*Record` = stored shape, icons stored by name → `src/data/icons.ts`).
- **Persistence:** `src/data/storage.ts` (`STORAGE_PREFIX = 'ordacy-cms:v2:'`) is shared. Admin `src/services/local-store.ts` writes it, and the public `@/data` overlays it on load. Admin edits show publicly in that browser after a reload. Bump the prefix version when record shapes change.
- **Projects:** six published concept projects (`type: concept-demo`, fictional scenarios) with challenge, solution and generated SVG screens in `public/projects/<slug>/`, labelled "Concept" publicly.
- **Testimonials:** 6 sample records, admin-only (pending, unpublished, `rating: null`). Public needs approved + `isPublished` + not sample. Until then, home and `/testimonials` show trust content from `pages.json`.
- **Hero:** stats are derived (services, plans, markets). The fake stats, the Like button and the Verified badge were removed.
- **Business terms:** README terms (50/50 payment, ownership after payment, client-owned hosting, optional maintenance, 30-day warranty) are now published, because this spec asked for them.
- **Tagline:** "Build Better. Grow Further." (spec).
- **Admin:** at `/admin/*`, own shell, lazy routes, noindex, `Disallow: /admin`. Sign-in is not implemented, and the profile menu says so.

## Completed Work
- **Public pages:**
  - Home: honest hero, concept carousel, trust section, FAQ "Show all" toggle grouped by category.
  - Projects: filter grid; modal with overview, challenge, solution, SVG screens.
  - Testimonials: principles, journey, CTA; real list appears when published.
  - Pricing: plans, comparison table, "How pricing works", FAQs.
  - Contact: Full name, Project type, plan-based Budget range, optional Target launch date.
  - About: purpose, problems, `ServiceExplorer` tabs, principles, process, who we help, expectations, CTA.
  - Privacy and Terms: Data Privacy Act 2012, project terms, PH law; no draft notice.
  - 404 with links.
- **SEO:**
  - `usePageMeta` on every page: title, description, OG, canonical, noindex, optional JSON-LD. The homepage gets Organization JSON-LD built from site data, and the static copy was removed from `index.html`.
  - `robots.txt`, `sitemap.xml` and the `vercel.json` rewrite are in place.
- **Admin, 11 pages:**
  - Dashboard: figures derived from records.
  - Inquiries: search, filter, pagination 10/15/20, newest first, refresh, details modal, inline status, delete-confirm.
  - Website Content: tabs per page plus Footer and contact.
  - Projects, Testimonials, Services, Pricing, FAQs and Gallery: CRUD, reorder and publish where relevant.
  - SEO: per-page editor plus a structured data preview.
  - Settings: site details, page size, integrations status, Storage restore.
- **Shared UI:**
  - `src/components/ui`: `Section`, `Lightbox` (now has `size="sm"`), `ContentItems` (numbered, ruled or checklist), shared styles.
  - Admin components: `AdminPage`, `FormDialog`, `TextField`, `ConfirmDialog`, `Pagination`, `Tabs`, `States`, `RecordControls` (`DataIcon`), toasts.
- **Theme tokens:** `danger` and `status` added to both themes.
- **Dialog focus trap** now includes form fields.

## Current Implementation State
- lint, typecheck and build pass. The main chunk is about 399 kB, with every non-home page lazy-loaded.
- The CDP browser test (scratchpad, not in the repo) passed all 55 checks with no console errors.

## Git Changes
- Branch `develop`. Last commit 28459ea. Nothing committed this session.
- **Staged:** only deletions, from earlier `git rm` calls: `src/components/common/PagePlaceholder.tsx`, `src/features/home/components/*` (moved to `src/components/ui/`), `src/features/home/useHomePageMeta.ts`.
- **Unstaged:** 38 modified files (+1091/−1097), including `AGENTS.md`, `CLAUDE.md`, `README.md` (one line), `index.html`, `router.tsx`, `ThemeProvider.tsx`, `theme.ts`, home sections and styles, page components, `tsconfig.app.json`, `vite.config.ts`.
- **Untracked:**
  - Data and assets: `data/`, `public/projects/`, `public/robots.txt`, `public/sitemap.xml`, `vercel.json`, `workflow/`.
  - Source: `src/data/`, `src/services/`, `src/components/ui/`, `src/components/common/PageHeader.tsx`, `src/features/admin/`, `src/hooks/usePageMeta.ts`, `src/app/themeStorage.ts`, plus new page components and `styles/` folders.
- **Warnings:**
  - LF→CRLF warnings on many files.
  - The `CLAUDE.md` rewrite the user started before this session is preserved, with this session's edits layered on top.

## Important Files
- `data/database/*.json`: all content and records (site, pages, seo, services, plans, faqs, projects, testimonials, gallery, inquiries, legal, settings, admin-navigation).
- `src/data/index.ts`, `types.ts`, `storage.ts`, `icons.ts`: data layer.
- `src/services/index.ts`, `local-store.ts`: admin data access, `queryInquiries`, `getInquiryStats`, `submitInquiry`.
- `src/hooks/usePageMeta.ts`: SEO and `organizationJsonLd`.
- `src/features/admin/**`: CMS.
- `src/features/about/ServiceExplorer.tsx`, `src/components/ui/ContentItems.tsx`.
- `src/app/router.tsx`: public routes plus `/admin` children.

## Issues and Blockers
- **Launch blocker:** contact form submissions only go to the visitor's browser storage. Nothing reaches Ordacy, yet the success message implies receipt.
- **No auth on `/admin`:** anyone with the URL can open it. The question "make it dev-only?" was asked twice and is unanswered.
- `siteUrl` `https://ordacy.com` is unconfirmed (canonical URLs, sitemap, robots). There is no OG image.
- **Copy for the owner to confirm:**
  - revisions handling
  - "update cadence agreed at start"
  - "we do not sell your information"
  - the Privacy Policy's security statement
  - Philippine governing law
- No lawyer has reviewed the legal pages.
- No real testimonials or client projects exist yet. `terser-brunch` is still unexplained.
- GitHub MCP server failed to connect (authorization header badly formatted). Unrelated.

## Testing and Verification
- `npm run lint`, `npm run typecheck`, `npm run build`: pass.
- **Headless Chrome (CDP) end-to-end, 55 checks:**
  - Admin flows: inquiries search, filter, page, status, details, delete; FAQ add and reorder; testimonial lock; content save; SEO validation; pricing.
  - Public completeness on every route: one h1, no forbidden wording, no dead links.
  - Public features: FAQ toggle, projects filter and modal with SVGs, service explorer keyboard, contact fields, 404 links.
  - Data and privacy: an admin edit shows on the public site after a reload; no sample names leak publicly.
- Screenshots in light and dark at 375, 390, 820, 1280 and 1440px. No horizontal overflow on any route.
- **Not done:** a screen reader pass, and a live Vercel deploy check.

## Pending Tasks
- User review of the full site and CMS.
- Decide whether `/admin` is dev-only until auth exists.
- Contact delivery (backend or email service) before launch.
- Confirm the domain; add an OG image; confirm the flagged policy wording; get legal review.
- Replace sample testimonials with real, approved ones; add real client projects if any.
- Decide whether to commit. The staged deletions plus untracked files need `git add` when the user chooses.

## Next Recommended Steps
1. User reviews `npm run dev` at `/` and `/admin`.
2. Answer the `/admin` dev-only question and confirm the domain.
3. Plan the backend phase: contact delivery, auth, a database replacing `local-store.ts` (same async API).

## Important Warnings
- Never present sample testimonials or concept projects as real clients or results. Keep the `isSample` publish lock and public filters.
- Never claim auth, database, email or uploads are connected.
- Bump `STORAGE_PREFIX` in `src/data/storage.ts` whenever a stored record shape changes, or old saved data can break pages.
- Don't commit or discard the user's work without asking.
