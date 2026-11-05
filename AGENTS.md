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
- Shared logic: `src/hooks` (`useDialogFocusTrap` for any modal dialog, `useMediaQuery`, `useScrollDirection`), `useHomePageMeta` (`src/features/home`). Theme state lives in `src/app/ThemeProvider.tsx` (always starts light, see below).

`README.md`'s status sections predate the homepage build: it still claims all pages are placeholders and that there is no Git repository. Trust `src/` and `package.json` over it.

## Admin (CMS frontend, no backend yet)

- `/admin/*` lives in `src/features/admin/` with its own shell (not `RootLayout`); routes are lazy children in `router.tsx`, nav config in `data/database/admin-navigation.json`.
- All content and records live in `data/database/*.json`. Admin UI reads and writes only through `src/services` (async; local store persisted to localStorage). Public pages read `@/data`, which overlays the same saved edits (`src/data/storage.ts`), so both views share one data model. Never put content or mock records in JSX.
- No auth exists: keep noindex and robots `Disallow: /admin`; no "Demo mode" wording, but never claim authentication, a database, email, or uploads are connected (Settings lists them as "Not configured"). Edits are browser-local only.
- Illustrative records carry `isSample: true`, show a "Sample" badge, and can never be published; keep that lock and the public `isSample` filters.

## Routing and content

- Add a route in **both** `router.tsx` and `navigation.ts`. Top Bar titles, sidebar/mobile nav, and footer all derive from `navigation.ts`; an unlisted route makes the Top Bar show "Page not found". Bottom-nav entries additionally require a Phosphor `mobileIcon` (`MobileNavigationItem`).
- Homepage `/#<id>` links rely on `HomePage`'s hash-scroll effect. New homepage sections should use `Section` with an `id` (e.g. `services`, `pricing`, `work`, `faqs`).
- Every page calls `usePageMeta(seo.<page>)` for title, description, OG, canonical and noindex.
- Content integrity: only genuine testimonials and permissioned projects; never invent quotes, client results, or case studies. The home Projects carousel and Testimonials marquee still run on placeholder data marked as such in `home.data.ts` (picsum screenshots included — swap in real assets before launch).

## Buttons and labels (user mandates — don't regress these)

- Every button carries an icon: text buttons, nav/sidebar/footer links, toggles, and tabs. Only pure image buttons (hero cover/avatar) are exempt.
- Button text is bold site-wide (nav links semibold at rest, bold when active). `SecondaryButton` is a filled subtle-background button, not an outline.
- Project cards: one row of actions; globe icon left of the label. Desktop shows `Visit` + `Details`; mobile stretches `Visit Website` with an icon-only Details button.
- Project modal (`Details` dialog): thumbnail first, screenshots under it in a single horizontally scrolling thumb row; card and modal descriptions render the same `summary` text; modal actions wrap to two rows.

## Styling and theme

- styled-components only — no Tailwind, CSS modules, or inline style objects.
- Component styles live in `styles/` folders next to their components (e.g. `sections/styles/hero.styled.ts`), imported as `import * as S from './styles/x.styled'`; keep JSX and coordination in the component file. Section styled files re-export shared pieces from `../components/styles/` (`buttons`, `icon-badge`, `empty-state`, `card`) — reuse them instead of duplicating.
- Use tokens from `theme.ts` (`colors`, `spacing`, `radii`, `typography`, `breakpoints`, `transitions`, `layout`); mobile-first `@media (min-width: theme.breakpoints.*)`. Shared one-off dark-mode/problem-tone overrides live in the section styled file — check both modes.
- `lightTheme` and `darkTheme` share the `AppTheme` shape. Update both when adding tokens; check both modes.
- Styling-only props use transient `$` names (`$open`, `$collapsed`) so they don't reach the DOM.
- A few deliberate hex values remain for dark-mode teal surfaces and cover art; follow the existing comments rather than adding new hardcoded colors.
- Preserve `aria-*`, `tabIndex`, focus styles, and the skip link when editing layout/navigation.
- Custom JS animations (theme overlay, lightbox) guard `prefers-reduced-motion` themselves; `GlobalStyles` only covers CSS animations.

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
