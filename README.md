# Ordacy

Public website for Ordacy — practical digital solutions for growing businesses.

Built with React, Vite, TypeScript, React Router, Styled Components, and Lucide icons.

## Features

- **Responsive navigation** — collapsible desktop sidebar, icon-only mobile bottom navigation, and a shared Top Bar with page titles and a mobile More menu.
- **Light and dark themes** — global theme system with system-preference fallback, `localStorage` persistence, and an animated sun/moon transition between modes.
- **Theme-aware branding** — the Ordacy logo automatically switches between light- and dark-mode variants.
- **Consistent layout** — content capped at 1440px and the overall application at 1680px, centered on ultra-wide screens.
- **Accessibility** — semantic landmarks, skip link, labeled icon-only controls, managed focus in dialogs, and `prefers-reduced-motion` support throughout.

## Getting started

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

## Commands

- `npm run dev` — start the development server
- `npm run build` — type-check and create a production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run the TypeScript compiler

## Project structure

- `src/app` — application root, router, theme provider, and theme transition
- `src/components/layout` — Top Bar and root layout shell
- `src/components/navigation` — sidebar, bottom navigation, More menu, brand, and shared route definitions
- `src/components/common` — shared presentational components
- `src/features` — page-level features, one folder per route
- `src/styles` — theme tokens, breakpoints, typography, and global styles
- `src/types` — shared type declarations
- `src/assets` — bundled images and icons (including the light/dark logo variants)
- `public` — static files served as-is (`favicon.svg`)

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/projects` | Projects |
| `/testimonials` | Testimonials |
| `/pricing` | Pricing |
| `/contact` | Contact |
| `/about-us` | About Us |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-service` | Terms and Conditions |

Content pages currently use a shared placeholder component and are ready to be replaced with final copy.

## Theming

Theme tokens live in `src/styles/theme.ts`. `AppThemeProvider` (`src/app`) owns the active theme, persists the choice, and exposes it through `useAppTheme()`. Components consume tokens via Styled Components' `ThemeProvider` — use tokens instead of hardcoded colors so both themes stay correct.

## Typography

Plus Jakarta Sans is loaded from Google Fonts in `index.html` and applied globally as the default font family.
