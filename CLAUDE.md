# CLAUDE.md

Ordacy portfolio and client-acquisition site (lead generation). Frontend-only SPA: React 19, TypeScript 6 (strict), Vite 8, React Router 7, styled-components 6, `lucide-react` (+ `@phosphor-icons/react` for the mobile bottom nav only). npm only.

Not implemented: backend, database, auth, real CMS persistence, analytics, API/contact-form delivery, env vars, tests. The `/admin` CMS frontend exists, with browser-local edits and no sign-in (see Admin).

`AGENTS.md` holds the same conventions in more detail. If the two ever conflict, follow `AGENTS.md`. `README.md` status sections are stale (it claims no git repo and all pages are placeholders). Trust `src/` and `package.json`.

## Commands

```
npm run dev | build | preview | lint | typecheck
```

- Fast check: `lint` + `typecheck`. Full check: `build` (`tsc -b && vite build`).
- No test runner. Don't add one unless asked.
- Visual check when UI changes: desktop and mobile, both themes, and reduced motion if animation is touched.

## Status

- Built: all routes (Home, Projects, Testimonials, Pricing, Contact, About Us, Privacy, Terms) plus a custom `NotFoundPage`. Non-home pages are lazy-loaded in `router.tsx`. Frontend only: the contact form submits to a stub (`submitInquiry`, `// BACKEND: replace`).
- Shell: fixed desktop sidebar (`lg`+, collapsible from TopBar), mobile bottom nav, skip link. Light and dark themes.
- Admin: `/admin` (Dashboard, Inquiries, Website Content, Projects, Testimonials, Services, Pricing, FAQs, Gallery, SEO, Settings), own shell, lazy-loaded, noindex, `Disallow: /admin` in robots.txt.

## Where things live

- `src/app/` router, App, ThemeProvider, `theme-context.ts` (`useAppTheme()`), ThemeTransition, NotFoundPage
- `src/components/{common,layout,navigation,ui}/` shell, nav, `PageHeader`; `ui/` holds shared `Section`, `Lightbox`, and `ui/styles/` (`buttons`, `card`, `icon-badge`, `empty-state`, `section`, `lightbox`)
- `data/database/*.json` is the single source of content and mock records (site, pages, seo, services, plans, faqs, projects, testimonials, gallery, inquiries, settings, admin-navigation, legal...). Records are CMS-shaped (stable `id`, `displayOrder`, `isPublished`/`status`, ISO timestamps). `src/data` (`@/data`) exposes `seed` (raw records) plus published, ordered, icon-resolved exports for the public site; types in `src/data/types.ts` (`*Record` = stored shape). JSON stores Lucide icon names, mapped in `src/data/icons.ts`. `@data/*` aliases the JSON folder. Pending business facts (email, phone, domain) are `pending: true` and hidden until set.
- Public page copy (headers, section headings/intros, item lists like principles, expectations, pricing notes, contact steps, 404) lives in `pages.json`, read via `pageHeader()`, `sectionCopy()`, `getSection()`; item lists render with `components/ui/ContentItems` (`numbered` | `ruled` | `checklist`). Don't put copy back in JSX.
- Public and admin share one data source: `src/data/storage.ts` (`readStored`, prefix `ordacy-cms:v2:`) overlays saved admin edits onto the seed when the public site loads. Bump the prefix version whenever a stored record shape changes.
- `src/services/` data access layer: `local-store.ts` (async collections/documents seeded from `/data`, persisted to localStorage) and `index.ts` (typed services, `queryInquiries`, `getInquiryStats`, `submitInquiry`). UI never touches storage directly; swap this layer for API calls later.
- `src/features/admin/`: `layout/` shell, `components/` shared admin UI (`AdminPage`, `FormDialog`, `TextField`, `ConfirmDialog`, `Pagination`, `Tabs`, `States`, `RecordControls`, toasts), `hooks/useCollection`, one folder per admin page.
- `src/features/<route>/` one folder per page. Page sections and sub-components stay inside it, not in `src/components`.
- `src/features/home/`: `HomePage.tsx` composes `sections/*`; `home.data.ts` just re-exports `@/data`. Reuse `components/ui` and sections shared with other pages (`PricingPlans`, `Faq` props, `ProjectDetails`); don't duplicate.
- `src/styles/` `theme.ts`, GlobalStyles, breakpoints, typography. `src/types/styled.d.ts` augments `DefaultTheme`; update it if `AppTheme` gains a top-level key.

## Hooks (reuse, don't recreate)

- `useDialogFocusTrap`: Tab trap handler for native `<dialog>`s.
- `useMediaQuery`: `matchMedia` via `useSyncExternalStore`.
- `useScrollDirection`: hides/shows mobile bottom nav on scroll.
- `useScrollReveal`: call once per page. It scans `[data-reveal]` elements **present on mount** and sets `data-revealed`; elements added later are NOT observed. The fade-up CSS is in GlobalStyles (`data-reveal="1".."3"` staggers).
- `useRevealOnce`: per-element one-shot `[ref, revealed]` for custom reveal animations.

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
- The home Testimonials section and /testimonials show trust content (working principles, project journey) until approved genuine testimonials exist; then the marquee/list appears.
- Hero stats are derived from data (services, plans, markets). Never show invented metrics.
- Process, payment terms (50/50), ownership, hosting, optional maintenance, and the 30-day warranty from `README.md` are now published (FAQs, About, Pricing notes, Terms). Keep every page consistent with those terms; don't invent new commitments.

## Admin

- No "Demo mode" wording anywhere in the UI. Be honest instead: no authentication exists (anyone who opens `/admin` sees it, so it must never hold real client data until a backend with server-side auth exists; frontend route guards are not security), and Settings → Integrations lists Authentication, Database, Email and File storage as "Not configured". Never claim any of them is connected.
- Admin edits persist only in the current browser's localStorage (`ordacy-cms:v2:*`) and appear on the public site in that browser after a reload; other visitors never see them. Settings → "Restore original content" clears them. The contact form writes to the same store, so submissions show in admin Inquiries on that device only; nothing is emailed or sent.
- Sample content: illustrative inquiries, testimonials, and gallery images have `isSample: true`, show a "Sample" badge in admin, and can never be published (controls locked; public filters drop `isSample`). Sample testimonials have `rating: null`. Public testimonials require `status: approved` + `isPublished` + not sample.
- Projects are six published concept projects (`type: concept-demo`, `isSample: false`) built on fictional scenarios, labeled "Concept" on the site, with generated SVG screens in `public/projects/<slug>/`. Never present them as client work or attach results.
- Every admin view must have content on first load; empty states are only for searches/filters that return nothing. Dashboard figures are derived from records, never hardcoded.
- Gallery has no upload storage: images are added by URL; the UI says so.

## Known limitations

- No backend: the contact form is a stub and nothing is sent or stored.
- `vercel.json` rewrites all paths to `/index.html` (untested on a live deploy). `robots.txt`/`sitemap.xml` assume `https://ordacy.com`.
- Legal pages reference the Philippine Data Privacy Act of 2012 but have not been reviewed by a lawyer (no in-page notice). The contact success message implies receipt, but nothing is delivered until a backend exists: a launch blocker. No OG image yet.
- `terser-brunch` in devDependencies looks unused (nothing in the repo references it) but its purpose is unconfirmed. Don't remove it without investigating and justifying.
