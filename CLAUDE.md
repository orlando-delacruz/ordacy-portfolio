# CLAUDE.md

Front-end SPA plus Vercel functions: React 19, TypeScript 6 (strict), Vite 8, React Router 7, styled-components 6, `lucide-react` (+ `@phosphor-icons/react` for the mobile bottom nav only), Supabase Postgres and Auth. npm only.

Not implemented: analytics, image uploads, CI config. The `/admin` CMS is authenticated with Supabase Auth (password + TOTP) and writes through the serverless API (see Admin).

`AGENTS.md` holds the same conventions in more detail. If the two ever conflict, follow `AGENTS.md`. `README.md` status sections are stale (it claims no git repo and all pages are placeholders). Trust `src/` and `package.json`.

## Commands

```
npm run dev | build | preview | lint | typecheck
npm test
```

- Fast check: `lint` + `typecheck`. Full check: `build` (`tsc -b && vite build`). API rules and map round-trips: `npm test`.
- Visual check when UI changes: desktop and mobile, both themes, and reduced motion if animation is touched.

## Status

- Built: all routes (Home, Projects, Testimonials, Pricing, Contact, About Us, Privacy, Terms) plus a custom `NotFoundPage`. Non-home pages are lazy-loaded in `router.tsx`. The contact form posts to `/api/inquiries`, which saves the row before attempting the EmailJS notification; any non-2xx shows the form's failure panel.
- Shell: fixed desktop sidebar (`lg`+, collapsible from TopBar), mobile bottom nav, skip link. Light and dark themes.
- Team: compact strip inside the homepage hero (`id="team"`, no section title), with `/team/:slug` resume-style profile pages whose hero mirrors the homepage hero. There is no `/team` index and no Team nav item.
- Admin: `/admin` (Dashboard, Inquiries, Website Content, Projects, Testimonials, Services, Pricing, FAQs, Gallery, SEO, Settings), own shell, lazy-loaded, noindex, `Disallow: /admin` in robots.txt.

## Where things live

- `src/app/` router, App, ThemeProvider, `theme-context.ts` (`useAppTheme()`), ThemeTransition, NotFoundPage
- `src/components/{common,layout,navigation,ui}/` shell, nav, `PageHeader`; `ui/` holds shared `Section`, `Lightbox`, `ProfileCoverArt` (`brand` | `member` cover art) + `ui/styles/profile-hero.styled.ts` (shared homepage/member hero layout), and `ui/styles/` (`buttons`, `card`, `icon-badge`, `empty-state`, `section`, `lightbox`)
- `data/database/*.json` is the seed and the source for static content (site, pages, seo, services, plans, faqs, projects, testimonials, team, gallery, inquiries, settings, admin-navigation, legal...). Records are CMS-shaped (stable `id`, `displayOrder`, `isPublished`/`status`, ISO timestamps). `src/data` (`@/data`) exposes `seed` (raw records) plus published, ordered, icon-resolved exports for the public site; types in `src/data/types.ts` (`*Record` = stored shape). JSON stores Lucide icon names, mapped in `src/data/icons.ts`; the API validates against `data/icons.json`. `@data/*` aliases the JSON folder. Pending business facts (email, phone, domain) are `pending: true` and hidden until set.
- Public page copy (headers, section headings/intros, item lists like principles, expectations, pricing notes, contact steps, 404) lives in `pages.json`, read via `pageHeader()`, `sectionCopy()`, `getSection()`; item lists render with `components/ui/ContentItems` (`numbered` | `ruled` | `checklist`). Don't put copy back in JSX.
- Public and admin content lives in Supabase Postgres. Public pages read `GET /api/content` through `@/data`; admin reads and writes go through `src/services` → `/api/admin` and require a Supabase session with the owner allowlist plus the pinned TOTP factor. `data/database/*.json` is the seed and the source for static content.
- `src/services/` data access layer: `index.ts` (typed admin services, `queryInquiries`, `getInquiryStats`, `saveOrder`), `inquiries.ts` (`submitInquiry` → `POST /api/inquiries` plus the one-time legacy draft drain), and `supabase.ts` (lazy browser client + token). UI never touches storage or Supabase directly. Pre-phase-04 drafts in `ordacy-cms:v3:inquiries` are read-only legacy data and are cleared only after the API confirms each one.
- `src/features/admin/`: `layout/` shell, `components/` shared admin UI (`AdminPage`, `FormDialog`, `TextField`, `ConfirmDialog`, `Pagination`, `Tabs`, `States` including `TableSkeleton`, toasts), `hooks/useCollection`, one folder per admin page. Website Content uses a split view (page list + editor).
- `src/features/<route>/` one folder per page. Page sections and sub-components stay inside it, not in `src/components`.
- `src/features/team/`: `TeamMemberPage` (`/team/:slug`), `components/TeamStrip` (hero strip), `sections/TeamHero` + `TeamResume`. The `team` copy group in `pages.json` holds only profile resume headings (admin preview at `/#team`).
- `src/features/home/`: `HomePage.tsx` composes `sections/*`; `home.data.ts` just re-exports `@/data`. Reuse `components/ui` and sections shared with other pages (`PricingPlans`, `Faq` props, `ProjectDetails`); don't duplicate.
- `src/styles/` `theme.ts`, GlobalStyles, breakpoints, typography. Design tokens: neutral light/dark surfaces, teal reserved for action and state; `radii.sm` is 10px; `layout` adds `readingMaxWidth` (68ch) and `formMaxWidth`; `motion` holds duration/easing tokens. Global `scroll-margin-top` keeps `/#id` anchors clear of sticky bars. `src/types/styled.d.ts` augments `DefaultTheme`; update it if `AppTheme` gains a top-level key.

## Hooks (reuse, don't recreate)

- `useDialogFocusTrap`: Tab trap handler for native `<dialog>`s.
- `useMediaQuery`: `matchMedia` via `useSyncExternalStore`.
- `useScrollDirection`: hides/shows mobile bottom nav on scroll.
- `useScrollReveal`: call once per page. It scans `[data-reveal]` elements **present on mount** and sets `data-revealed`; elements added later are NOT observed. The fade-up CSS is in GlobalStyles (`data-reveal="1".."3"` staggers).
- `useRevealOnce`: per-element one-shot `[ref, revealed]` for custom reveal animations.
- `usePageScrollRestoration`: mounted in `RootLayout` and `AdminLayout`, not in pages. Owns all scroll-on-navigate behavior (top on forward, exact position on back, hash jumps). Never add per-page scroll effects.

## Code style

- Named exports only. No semicolons, single quotes, 2-space indent. No Prettier; ESLint checks correctness only.
- `import type` for type-only imports (`verbatimModuleSyntax`). `erasableSyntaxOnly`: no enums, namespaces, or parameter properties. `noUnusedLocals`/`noUnusedParameters` are on.
- `@/` → `src/`. Use it across top-level folders. Inside a feature, existing relative imports are fine (`../home.data`, `./styles/...`); shared UI is imported as `@/components/ui/...`. Don't convert them.
- JSX and logic in `.tsx`; styles in `styles/*.styled.ts` next to the component, imported as `import * as S from './styles/x.styled'`.
- styled-components only: no Tailwind, CSS modules, or inline style objects. Styling-only props use transient `$` names (`$open`, `$collapsed`).
- Theme tokens via `({ theme }) => theme.*` (colors, spacing, radii, typography, breakpoints, transitions, layout). Don't add hardcoded colors; the few existing hex values (dark teal surfaces, cover art, theme-overlay icons) follow their own comments.
- `lightTheme` and `darkTheme` share `AppTheme`: update both when adding tokens, and check both modes.
- Mobile-first `@media (min-width: theme.breakpoints.*)`. Transitions use `theme.transitions.fast/base/slow`.
- Respect `prefers-reduced-motion`. GlobalStyles covers CSS animations only; custom JS animations (theme overlay, lightbox) guard it themselves.
- No new dependencies or abstractions without a strong reason.

## Routing and navigation

- Add a route in **both** `src/app/router.tsx` and `src/components/navigation/navigation.ts`. Sidebar, mobile nav, footer, and TopBar titles derive from `navigation.ts`.
- `getPageTitle()` falls back to "Page not found" for unlisted paths. Keep that.
- `mobileNavItems` entries need a Phosphor `mobileIcon`.
- `HomePage` scrolls to `location.hash` on load; `/#id` links depend on it. Keep `Section` ids: `services`, `pricing`, `work`, `process`, `faqs` (Faq uses its own wrapper, not `Section`).
- Every page calls `usePageMeta(seo.<page>)` (title, description, OG, canonical, noindex; restored on unmount). Copy lives in `data/database/seo.json`. `siteUrl` in `site.json` is an unconfirmed assumption.

## Theme

- Theme = saved manual choice (`localStorage` key `ordacy-theme`), else the OS theme, followed live until the user picks one.
- `index.html` has a pre-hydration script (same rule), `theme-color`, and backgrounds (`#fefefe` / `#001a2c`). Update it if the default background tokens in `theme.ts` change.
- Don't casually rewrite `ThemeProvider`/`ThemeTransition`: theme commits at 420ms, overlay removed at 980ms, timers are cleared on unmount, a ref guards re-toggle, and reduced motion switches instantly.

## Dialogs, buttons, accessibility

- Dialogs (`Lightbox`, `MobileMoreMenu`) are native `<dialog>` + `showModal()` + `useDialogFocusTrap`. Preserve Escape, backdrop click, body/html scroll lock, and focus restoration. `MobileMoreMenu` also uses a `#more` hash so browser back closes it.
- Keep skip link, `aria-*`, `tabIndex`, focus styles. Icon-only buttons need `aria-label`.
- User mandates, don't regress: every button/nav link/toggle/tab carries an icon (pure image buttons exempt); button text is bold; `SecondaryButton` is a filled subtle button, not an outline.
- Project cards: one row of actions, globe icon left of label; desktop `Visit` + `Details`, mobile `Visit Website` + icon-only Details. Modal: thumbnail first, screenshots in one horizontally scrolling row, same `summary` text as the card, actions wrap to two rows.
- Pricing: no "Recommended" badge or tinted price panel (Growth is set apart by accent border/price and primary CTA). Currency toggle (PHP/USD) has no visible text label, only an accessible name. Prices are static values in `data/database/plans.json`, shown as-is per currency. Never compute conversions or invent prices; treat prices as unverified business intent.

## Content integrity

- Never invent clients, projects, testimonials, names, results, or business claims.
- The home Testimonials section renders the published approved testimonials and stays
  hidden when none exist; `/testimonials` shows its page-level empty state instead,
  with the trust content (working principles, project journey) always rendered below.
  Never invent quotes or client results.
- Hero stats come from `site.profileStats` (Views, Projects, Likes), edited in Settings. The like button toggles the visitor's own like state (stored as `ordacy-hero-liked` in this browser) with `aria-pressed`; the Likes stat stays the content value.
- Process, payment terms (50/50), ownership, hosting, optional maintenance, and the 30-day warranty from `README.md` are now published (FAQs, About, Pricing notes, Terms). Keep every page consistent with those terms; don't invent new commitments.

## Admin

- No "Demo mode" wording anywhere in the UI. The admin is authenticated by Supabase Auth (password + TOTP) and every API request is server-checked against `ADMIN_USER_ID` and `ADMIN_TOTP_FACTOR_ID`; Email notifications read "Connected (EmailJS)" only after the phase 04 checkpoint verifies a real send, and File storage stays "Not configured" until uploads land.
- Admin edits persist in Supabase through `/api/admin` and appear on the public site after the content cache refreshes. Inquiries are stored separately from content: the contact form posts to `/api/inquiries`, which saves the row before attempting the EmailJS notification. `ordacy-cms:v3:inquiries` holds only pre-phase-04 drafts and is drained once per public load, clearing each draft only after the API confirms it.
- There are no sample records: only real client feedback and permissioned client
  projects are stored. Public testimonials require `status: approved` +
  `isPublished`; with none, the public empty states are the honest fallback.
- Projects are stored only for permissioned client work. Never present a project as
  client work without permission or attach results that were not provided.
- Every admin view must have content on first load; empty collections show their empty states, and search/filter no-results use the local empty state. Dashboard figures are derived from records, never hardcoded.
- Gallery has no upload storage: images are added by URL; the UI says so.

## Known limitations

- Image uploads are not connected; images are added by URL. EmailJS notification sends server-side when the `EMAILJS_*` keys are set; the owner's verified test send is the phase 04 checkpoint.
- `vercel.json` rewrites all paths to `/index.html` (untested on a live deploy). `robots.txt`/`sitemap.xml` assume `https://ordacy.com`.
- Legal pages reference the Philippine Data Privacy Act of 2012 but have not been reviewed by a lawyer (no in-page notice). The contact success panel says "Inquiry received."; email delivery is server-side and pending the owner's checkpoint. No OG image yet.
- `terser-brunch` in devDependencies looks unused (nothing in the repo references it) but its purpose is unconfirmed. Don't remove it without investigating and justifying.
