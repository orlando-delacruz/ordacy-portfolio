# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/portfolio site for Ordacy, a custom business-systems agency. Its purpose is lead generation. Built with React 19, Vite 8, React Router 7, styled-components 6, TypeScript 6, Lucide icons (Phosphor for bottom-nav icons). Client-side SPA only: no backend, no env vars, no analytics.

## Commands

```
npm run dev        # Vite dev server
npm run build      # tsc -b + vite build → dist/
npm run typecheck  # tsc -b (noEmit set in tsconfig.app/node)
npm run lint       # eslint .
npm run preview    # preview production build
```

There is no test runner. Verify changes with `typecheck` + `lint`, and check the page in the browser.

## Path alias

`@/` → `src/` (set in `vite.config.ts` and tsconfig). Use it everywhere; no relative `../..` climbing.

## Structure

```
src/
  app/           # App, router, ThemeProvider, theme-context, ThemeTransition, NotFoundPage
  components/
    common/      # PagePlaceholder (used by every page not built yet)
    layout/      # RootLayout, TopBar
    navigation/  # navigation.ts, DesktopSidebar, MobileBottomNav, MobileMoreMenu, Wordmark
  features/      # One folder per route (home, about, pricing, …)
  hooks/         # useScrollDirection, useDialogFocusTrap
  styles/        # theme.ts, GlobalStyles, breakpoints, typography
  types/         # styled.d.ts (DefaultTheme augmentation)
```

Page feature folders live under `src/features/<name>/`. Sections and sub-components go inside the feature folder, not in `src/components`.

Only the home page is built. All other routes render `PagePlaceholder`. Home is composed in `HomePage.tsx` from `sections/*`. Its copy and lists live in `home.data.ts`. Home-only building blocks (`Section`, `Lightbox`, shared button/card/badge styles) live in `features/home/components/`. `HomePage` scrolls to `location.hash` on load, so section `id`s are link targets (e.g. `/#pricing`). `useHomePageMeta` sets title/description/OG tags and restores them on unmount.

## Styling

- Component styles live in `styles/` folders next to their components (e.g. `sections/styles/hero.styled.ts`); import them as `import * as S from './styles/x.styled'`.
- styled-components only. No Tailwind, no CSS modules, no inline style objects.
- Theme tokens come from `theme.ts` via `({ theme }) => theme.*`. Never hard-code colors, spacing, or radii.
- Two themes: `lightTheme` / `darkTheme`. Both must stay in sync when adding color tokens.
- Breakpoints from `theme.breakpoints.*`; use `@media (min-width: …)` mobile-first.
- Use `theme.transitions.fast/base/slow` for transitions.
- Respect `prefers-reduced-motion` for any animation (GlobalStyles and the theme toggle already do).

## Layout conventions

- `RootLayout` owns the shell: fixed sidebar (desktop, `lg`+), mobile bottom nav, skip link, TopBar.
- Sidebar collapses (toggle button lives in TopBar); `Content` margin adjusts via `$collapsed` prop + `sidebarWidths` (in `navigation.ts`).
- `MainInner` caps content at `theme.layout.contentMaxWidth` (90rem) and centers it.
- App max-width: `theme.layout.appMaxWidth` (105rem); sidebar and content stay together inside it on ultra-wide screens.

## Theme

- `ThemeProvider.tsx` (`AppThemeProvider`) holds theme state. Components read/toggle it with `useAppTheme()` from `src/app/theme-context.ts`. Inside styled components, use the `theme` prop.
- Every visit starts in light mode. No persistence and no `prefers-color-scheme` following; the toggle only switches theme for the current visit.
- `index.html` hard-codes `data-theme="light"` on `<html>` and has a pre-hydration `<style>` with the background colors (`#FEFEFE` / `#001A2C`). Update it if those change in `theme.ts`.
- `ThemeTransition.tsx` plays the timer-driven toggle overlay (theme commits at 420ms, overlay removed at 980ms). Reduced motion switches instantly.

## Navigation

- Routes defined in `src/app/router.tsx` (all children of `RootLayout`; `*` → `NotFoundPage`).
- Nav items defined in `src/components/navigation/navigation.ts`: `primaryNavItems` (sidebar), `mobileNavItems` (bottom nav; each needs a Phosphor `mobileIcon`), `secondaryNavItems` (sidebar + mobile More menu).
- TopBar's page title comes from `getPageTitle()`, which matches the path against `allNavItems`. An unlisted path shows "Page not found".
- Adding a route: add to `router.tsx` AND `navigation.ts`.
- `MobileMoreMenu` is a native `<dialog>` using `useDialogFocusTrap`, plus a `#more` hash so browser back closes it.

## Content rules (from README)

- Never fabricate testimonials, client results, or project details. Only genuine, permitted content.
- Process, payment terms, warranty, and pricing in README are business intent. Do not publish them as copy unless asked; treat prices as unverified.
- README is partly stale (it says no git repo and that all pages are placeholders). Trust the code.
- No `vercel.json` yet: direct loads of nested routes need an SPA rewrite on deploy.

## Rules

- No new dependencies without a strong reason.
- No abstraction that isn't already in use.
- Accessibility: skip link present; keep `tabIndex`, `aria-*`, and focus styles intact. Icon-only buttons need `aria-label`.
- `src/types/styled.d.ts` augments `DefaultTheme`; update it if `AppTheme` gains new top-level keys.
