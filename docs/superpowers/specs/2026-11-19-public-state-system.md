# Public State System — Design Spec

**Date:** 2026-11-19
**Owner decisions:** recorded from the state-system grilling session.

## Goal

Give every public page a consistent loading, empty, error, and (where a real action completes) success state, with reusable public components, page-specific skeletons, and honest async feedback.

## Current reality

- Public content is read synchronously from `data/database/*.json` through `@/data`; there is no content API and no artificial latency in production.
- The real async boundaries are lazy route chunks (React Router) and the contact inquiry write (`submitInquiry`, browser-local today).
- Public components today have an `EmptyState` for no-results and the contact form's inline success/error, but no shared public page-state system or skeletons.
- The admin has its own states and table skeleton; admin is out of scope.

## State model

| State | Trigger |
| --- | --- |
| Loading | Lazy route hydration/fallback; development-only `?state=loading` preview. |
| Empty | A page's primary collection is empty; development-only `?state=empty` preview on any public page. |
| Error | Route error boundary; failed contact submission; development-only `?state=error` preview. |
| Success | A completed user action. Only the contact form today; development-only `?state=success` on the contact page. |
| Ready | Default; real content renders. |

## Preview contract

- `?state=loading|empty|error|success` is read **only in development** (`import.meta.env.DEV`).
- Production ignores the parameter and never adds artificial delay.
- `loading` holds the page skeleton for review.
- `empty`/`error` render the page hero plus the shared state panel.
- `success` is honored only by the contact page/form.
- 404 is a page in its own right and is excluded from skeleton/state coverage.

## Page coverage

All public routes except 404:

- Home
- Projects
- Pricing
- FAQs
- Testimonials
- About
- Contact
- Privacy Policy
- Terms of Service
- Team profiles (`/team/:slug`)

## Visual rules

- **Reusable primitives:** skeleton block, line, circle, pill, card, plus shared section skeletons (page hero, section head, cards, form, legal document, profile/resume).
- **Page-specific compositions:** every page gets a skeleton that mirrors its real hero, sections, cards, forms, and CTA using those primitives.
- **Pulse:** the owner explicitly approved a slow opacity pulse on skeletons as the single exception to the “no ambient loops except the testimonial marquee” rule. `prefers-reduced-motion: reduce` makes skeletons static.
- **State panel:** one dynamic `StatePanel` for empty/error/success with an icon, title, description, and actions. Page-level empty/error keeps the page hero above the panel; the loading skeleton replaces the full page content including a hero placeholder.
- **Copy:** empty/success copy belongs in data (`data/database/states.json`), not JSX. Error copy is shared system copy in the same file. Actions are data-driven where they are links; the error retry is component behavior.
- **Buttons:** spinners only for real async work. The contact submit is the only public request today; navigation, filters, toggles, carousel controls, and links stay instant. No decorative spinners.

## Empty policy

- Page-level empty state for each page’s primary collection:
  - Projects: total published projects = 0.
  - Pricing: plans = 0.
  - FAQs: FAQs = 0.
  - Testimonials: real testimonials and sample testimonials both = 0.
  - About: services = 0.
  - Legal: document sections = 0.
- Home: no page-level production empty; hide optional sections whose data is empty.
- Contact: no production empty; preview only.
- Team profile: a missing member stays the existing not-found page; empty/error preview only.
- The FAQ no-match result state remains a local search empty (not page-level).

## Accessibility

- Skeletons: a single `role="status"` region with a visually hidden “Loading …” label; visual shapes `aria-hidden`.
- Error panel: `role="alert"`; success/empty: `role="status"`; focus moves to the panel after an action failure/success where applicable.
- The page hero keeps the page's `h1`; the page-level state panel uses an `h2` beneath it. The standalone route error page uses an `h1`.
- Panel actions keep the existing 44px controls, one icon per action, and visible focus.
- Pulse is disabled under reduced motion.

## Out of scope

- Admin states/components.
- A real backend, network layer, or artificial production latency.
- New dependencies or a test runner.
- Commit/stage/branch operations unless the owner explicitly asks.

## Verification

No test framework exists. Every task verifies with `npm run typecheck`, `npm run lint`, `npm run check:grid`, and `npm run build`, plus browser checks at 320/380/768/1440 in both themes, with reduced motion for the pulse, and with each `?state=` preview.
