# Ordacy Portfolio — CLAUDE.md

## Project

Marketing/portfolio site for Ordacy, a custom business-systems agency. Built with React 19, Vite 8, React Router 7, styled-components 6, TypeScript 6, Lucide icons (Phosphor for bottom-nav active states).

## Commands

```
npm run dev        # Vite dev server
npm run build      # tsc + vite build
npm run typecheck  # tsc only (no emit)
npm run lint       # eslint
npm run preview    # preview production build
```

## Path alias

`@/` → `src/`. Use it everywhere; no relative `../..` climbing.

## Structure

```
src/
  app/           # Router, ThemeProvider, theme-context, NotFoundPage
  components/
    common/      # Shared one-off components (PagePlaceholder)
    layout/      # RootLayout, TopBar
    navigation/  # DesktopSidebar, MobileBottomNav, MobileMoreMenu, Wordmark
  features/      # One folder per route (home, about, pricing, …)
  hooks/         # Custom hooks (useScrollDirection)
  styles/        # theme.ts, GlobalStyles, breakpoints, typography
  types/         # styled.d.ts (ThemeProvider augmentation)
```

Page feature folders live under `src/features/<name>/`. Sections and sub-components go inside the feature folder, not in `src/components`.

## Styling

- Component styles live in `styles/` folders next to their components (e.g. `sections/styles/hero.styled.ts`); import them as `import * as S from './styles/x.styled'`.
- styled-components only. No Tailwind, no CSS modules, no inline style objects.
- Theme tokens come from `theme.ts` via `({ theme }) => theme.*`. Never hard-code colors, spacing, or radii.
- Two themes: `lightTheme` / `darkTheme`. Both must stay in sync when adding color tokens.
- Breakpoints from `theme.breakpoints.*`; use `@media (min-width: …)` mobile-first.
- Use `theme.transitions.fast/base/slow` for transitions.

## Layout conventions

- `RootLayout` owns the shell: fixed sidebar (desktop), mobile bottom nav, skip link, TopBar.
- Sidebar collapses; `Content` margin adjusts via `$collapsed` prop + `sidebarWidths`.
- `MainInner` caps content at `theme.layout.contentMaxWidth` (90rem) and centers it.
- App max-width: `theme.layout.appMaxWidth` (105rem).

## Theme

- Context in `src/app/theme-context.ts`, provider in `ThemeProvider.tsx`.
- `ThemeTransition.tsx` handles animated theme switches.
- Read the current theme with `useTheme()` from styled-components; switch it via context.

## Navigation

- Routes defined in `src/app/router.tsx`.
- Nav items defined in `src/components/navigation/navigation.ts`.
- Adding a route: add to `router.tsx` AND `navigation.ts`.

## Rules

- No new dependencies without a strong reason.
- No abstraction that isn't already in use.
- Accessibility: skip link present; keep `tabIndex`, `aria-*`, and focus styles intact.
- `src/types/styled.d.ts` augments `DefaultTheme`; update it if `AppTheme` gains new top-level keys.
