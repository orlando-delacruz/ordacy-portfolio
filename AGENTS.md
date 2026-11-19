# AGENTS.md

Marketing/portfolio SPA for Ordacy. React 19 + Vite 8 + React Router 7 + TypeScript 6 + styled-components 6. npm only; no backend, env vars, tests, or CI config.

## Commands

- `npm run dev` — Vite dev server
- `npm run lint` and `npm run typecheck` — fast verification
- `npm run build` — full verification (`tsc -b && vite build` → `dist/`)
- `npm run preview` — serve the production build

There is no test script or test framework. Verify changes with lint, typecheck, build, and a browser check; don't add a test runner unless asked.

## Where things live

- `src/app/router.tsx` — all routes; `src/app/App.tsx` wires providers.
- `src/components/navigation/navigation.ts` — single source of truth for nav labels, paths, icons, and Top Bar page titles.
- `src/features/<route>/` — one folder per page. All pages are built; Home lives under `src/features/home/` (`sections/`, shared `components/`, copy/data in `home.data.ts`); content comes from `data/database/*.json` via `@/data`; shared UI is in `src/components/ui`.
- `src/styles/theme.ts` — design tokens; `src/types/styled.d.ts` — styled-components theme typing.
- `RootLayout` owns the shell (sidebar, Top Bar, mobile bottom nav, skip link, content width). Pages render content only.
- Shared surfaces: `src/components/ui/CtaBanner.tsx` is the teal closing banner used by Home and Projects; `src/features/projects/components/ProjectCard.tsx` is the image-led card used by the Home 3D carousel (`ProjectsCarousel.tsx`), the Projects desktop white-card grid, and the Projects mobile horizontal row list (below `md`, with segmented filter bar + pagination).
- Shared logic: `src/hooks` (`useDialogFocusTrap` for any modal dialog, `useMediaQuery`, `useScrollDirection`), `useHomePageMeta` (`src/features/home`). Theme state lives in `src/app/ThemeProvider.tsx` (always starts light, see below).

`README.md`'s status sections predate the homepage build: it still claims all pages are placeholders and that there is no Git repository. Trust `src/` and `package.json` over it.

## Admin (CMS frontend, no backend yet)

- `/admin/*` lives in `src/features/admin/` with its own shell (not `RootLayout`); routes are lazy children in `router.tsx`, nav config in `data/database/admin-navigation.json`.
- All content and records live in `data/database/*.json`. Admin UI reads and writes only through `src/services` (async; local store persisted to localStorage). Public pages read `@/data`, which overlays the same saved edits (`src/data/storage.ts`), so both views share one data model. Never put content or mock records in JSX.
- No auth exists: keep noindex and robots `Disallow: /admin`; no "Demo mode" wording, but never claim authentication, a database, email, or uploads are connected (Settings lists them as "Not configured"). Edits are browser-local only.
- Illustrative records carry `isSample: true`, show a "Sample" badge, and can never be approved or published as real; keep that lock and the public filters. Sample testimonials additionally appear publicly only through `sampleTestimonials`, with a visible `Sample` badge and sample-specific copy.

## Routing and content

- Add a route in **both** `router.tsx` and `navigation.ts`. Top Bar titles, sidebar/mobile nav, and footer all derive from `navigation.ts`; an unlisted route makes the Top Bar show "Page not found". Bottom-nav entries additionally require a Phosphor `mobileIcon` (`MobileNavigationItem`). Dynamic routes (`/team/:slug`) are resolved in `getPageTitle()` via the published data.
- Homepage `/#<id>` links rely on `HomePage`'s hash-scroll effect. New homepage sections should use `Section` with an `id` (e.g. `services`, `pricing`, `work`, `faqs`). The hero team strip uses `id="team"` on a plain `div`.
- Every page calls `usePageMeta(seo.<page>)` for title, description, OG, canonical and noindex.
- Content integrity: only genuine testimonials and permissioned projects; never invent quotes, client results, or case studies. The home Projects carousel and Testimonials marquee still run on placeholder data marked as such in `home.data.ts` (picsum screenshots included — swap in real assets before launch).

## Buttons and labels (user mandates — don't regress these)

- Every button carries an icon: text buttons, nav/sidebar/footer links, toggles, and tabs. Only pure image buttons (hero cover/avatar) are exempt.
- Button text is bold site-wide (nav links semibold at rest, bold when active). `SecondaryButton` is a filled subtle-background button, not an outline.
- Project cards: one row of actions; globe icon left of the label. Desktop shows `Visit` + `Details`; mobile stretches `Visit Website` with an icon-only Details button.
- Project modal (`Details` dialog): thumbnail first, screenshots under it in a single horizontally scrolling thumb row; card and modal descriptions render the same `summary` text; modal actions wrap to two rows.

## Design language (Quiet Authority — keep it consistent)

- Whitespace first: public sections use fluid vertical rhythm (`clamp(3.5rem, 8vw, 5.5rem)`); separate sections with rhythm, not nested cards.
- Neutral surfaces; teal is reserved for actions, active states, and small highlights. Static cards are border-only with no shadow; hover elevation only on clickable elements.
- Motion only for state change: entrances, dialogs, drawers, tabs, toasts, route fades (200ms). No ambient loops except the testimonial marquee. Every animation respects `prefers-reduced-motion`.
- Controls are 44px public / 40px admin, 44px on coarse pointers. Icon-only buttons always carry `aria-label`.
- In-page anchors (`/#id`) clear sticky bars via the global `scroll-margin-top` — no per-section offset hacks.
- Scroll contract (`usePageScrollRestoration`, mounted in both shells): PUSH/REPLACE without a hash starts at the top; with a hash it jumps to the element; browser back/forward restores the exact saved position. `#more` is menu UI state, never an anchor — the manager ignores it. Never add per-page scroll effects or render `<ScrollRestoration />`.
- Admin: `$sticky` toolbars for long lists, `TableSkeleton` for data tables, split-view (list + editor) for Website Content. Toasts: 3s success, 6s error. Tables stay paginated, so headers scroll with content.
- Copy budgets: page header ≤110 chars, section description ≤80, card summary ≤100, FAQ answer ≤240, helper text only when it prevents an error. Legal/financial terms, warnings, and sample labels are never trimmed for brevity.

- styled-components only — no Tailwind, CSS modules, or inline style objects.
- Component styles live in `styles/` folders next to their components (e.g. `sections/styles/hero.styled.ts`), imported as `import * as S from './styles/x.styled'`; keep JSX and coordination in the component file. Section styled files re-export shared pieces from `../components/styles/` (`buttons`, `icon-badge`, `empty-state`, `card`) — reuse them instead of duplicating.
- Use tokens from `theme.ts` (`colors`, `spacing`, `radii`, `typography`, `breakpoints`, `transitions`, `layout`); mobile-first `@media (min-width: theme.breakpoints.*)`. Shared one-off dark-mode/problem-tone overrides live in the section styled file — check both modes.
- `lightTheme` and `darkTheme` share the `AppTheme` shape. Update both when adding tokens; check both modes.
- Styling-only props use transient `$` names (`$open`, `$collapsed`) so they don't reach the DOM.
- A few deliberate hex values remain for dark-mode teal surfaces and cover art; follow the existing comments rather than adding new hardcoded colors.
- Preserve `aria-*`, `tabIndex`, focus styles, and the skip link when editing layout/navigation.
- Custom JS animations (theme overlay, lightbox) guard `prefers-reduced-motion` themselves; `GlobalStyles` only covers CSS animations.

## Spacing and sizing (4/8-point grid)

- Spacing and fixed sizes are multiples of **4px**; prefer **8px** steps at 16px and above. Allowed: 4, 8, 12, 16, 24, 32, 40, 48, 64, 96. Use `theme.spacing` tokens where one exists; no new tokens for one-offs.
- Fixed widths/heights follow the same steps. Control heights stay 44px public / 40px admin.
- **Exempt, by rule**: container widths and column layouts, fluid/`clamp()`/percentage dimensions, font sizes and line heights (separate type scale), 1–3px borders and hairlines, optical radii, and background/position percentages. Dynamic card widths follow the column system — never fix a width just to satisfy the grid.
- **Icons**: multiples of 4 (16/20/24/28/32). **14 and 18 are approved optical sizes** for inline and button icons; never introduce new off-grid icon sizes.
- True optical exceptions carry a `grid-exempt: <reason>` comment so `npm run check:grid` skips them.

## Pricing section notes

- No `Recommended` badge and no tinted price panel — Growth is distinguished by accent border/price and primary CTA only. Currency toggle has no visible text label (accessible name only).
- Plan `NameRow` stacks title above category badge on mobile, side-by-side at `lg`.

## Theme pre-hydration

Theme is the saved manual choice, else the OS theme (followed live). `index.html` has the pre-hydration script and background colors. If you change the default background tokens in `theme.ts`, update `index.html` too to avoid a flash.

## Imports, TypeScript, and style

- `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`). Use `@/` across top-level folders; within a feature folder, existing code uses relative imports (`../components/...`, `../home.data`), and `styles/` subfolders climb with `../../components/styles/...`.
- TS is strict: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type`), and `erasableSyntaxOnly` (no enums/namespaces/parameter properties).
- Code style is no semicolons, single quotes, 2-space indent, named exports only. No Prettier config; ESLint checks correctness only.
- Icons default to `lucide-react`; the mobile bottom nav uses `@phosphor-icons/react` because it has designed `regular`/`fill` weights. Keep that exception scoped to the bottom nav.
- No new dependencies or abstractions without a strong reason.

## Deployment

`vercel.json` rewrites all paths to `/index.html`.
