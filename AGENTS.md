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
- `src/features/<route>/` — one folder per page. Home is fully built under `src/features/home/` (`sections/`, shared `components/`, copy/data in `home.data.ts`); every other page route still renders `PagePlaceholder` (the 404 is custom).
- `src/styles/theme.ts` — design tokens; `src/types/styled.d.ts` — styled-components theme typing.
- `RootLayout` owns the shell (sidebar, Top Bar, mobile bottom nav, skip link, content width). Pages render content only.
- Shared logic: `useDialogFocusTrap` (`src/hooks`, for any modal dialog), `useHomePageMeta` (`src/features/home`), theme persistence in `src/app/themeStorage.ts` (key must stay in sync with `index.html`, see below).

`README.md`'s status sections predate the homepage build: it still claims all pages are placeholders and that there is no Git repository. Trust `src/` and `package.json` over it.

## Routing and content

- Add a route in **both** `router.tsx` and `navigation.ts`. Top Bar titles, sidebar/mobile nav, and footer all derive from `navigation.ts`; an unlisted route makes the Top Bar show "Page not found". Bottom-nav entries additionally require a Phosphor `mobileIcon` (`MobileNavigationItem`).
- Homepage `/#<id>` links rely on `HomePage`'s hash-scroll effect. New homepage sections should use `Section` with an `id` (e.g. `services`, `pricing`, `work`, `faqs`).
- Only `HomePage` updates `document.title` and page/OG meta tags; every other route keeps the static `index.html` metadata.
- Content integrity: only genuine testimonials and permissioned projects; never invent quotes, client results, or case studies. The Testimonials and Projects sections intentionally show empty states until real content is approved.

## Styling and theme

- styled-components only — no Tailwind, CSS modules, or inline style objects.
- Component styles live in `styles/` folders next to their components (e.g. `sections/styles/hero.styled.ts`), imported as `import * as S from './styles/x.styled'`; keep JSX and coordination in the component file. Section styled files re-export shared pieces from `../components/styles/` (`buttons`, `icon-badge`, `empty-state`, `card`) — reuse them instead of duplicating.
- Use tokens from `theme.ts` (`colors`, `spacing`, `radii`, `typography`, `breakpoints`, `transitions`, `layout`); mobile-first `@media (min-width: theme.breakpoints.*)`.
- `lightTheme` and `darkTheme` share the `AppTheme` shape. Update both when adding tokens; check both modes.
- Styling-only props use transient `$` names (`$open`, `$collapsed`) so they don't reach the DOM.
- A few deliberate hex values remain for dark-mode teal surfaces and cover art; follow the existing comments rather than adding new hardcoded colors.
- Preserve `aria-*`, `tabIndex`, focus styles, and the skip link when editing layout/navigation.
- Custom JS animations (theme overlay, lightbox) guard `prefers-reduced-motion` themselves; `GlobalStyles` only covers CSS animations.

## Theme pre-hydration

`index.html` inlines theme detection before React mounts using the `ordacy-theme` localStorage key and hardcoded background colors. If you change the key or default background tokens, update `index.html` **and** `src/app/themeStorage.ts` together to avoid a theme flash.

## Imports, TypeScript, and style

- `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`). Use `@/` across top-level folders; within a feature folder, existing code uses relative imports (`../components/...`, `../home.data`), and `styles/` subfolders climb with `../../components/styles/...`.
- TS is strict: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type`), and `erasableSyntaxOnly` (no enums/namespaces/parameter properties).
- Code style is no semicolons, single quotes, 2-space indent, named exports only. No Prettier config; ESLint checks correctness only.
- Icons default to `lucide-react`; the mobile bottom nav uses `@phosphor-icons/react` because it has designed `regular`/`fill` weights. Keep that exception scoped to the bottom nav.
- No new dependencies or abstractions without a strong reason.

## Deployment

No deployment config exists. If deploying the Vite SPA to Vercel, add a rewrite of all paths to `/index.html`, otherwise nested routes 404 on refresh.
