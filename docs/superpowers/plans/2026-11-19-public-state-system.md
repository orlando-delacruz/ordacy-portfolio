# Public State System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every public page a consistent loading, empty, error, and action-success state with reusable components, page-specific skeletons, honest async feedback, and a development-only state preview.

**Architecture:** A shared public `PageState` wrapper reads a development-only `?state=` preview, renders a page-specific skeleton or a page-level state panel, and otherwise renders the real page. Shared `StatePanel`, `Spinner`, and skeleton primitives keep the visual language consistent. React Router gets a public hydration fallback and error element. Only the contact submission performs real async work, so it is the only button that gets a spinner.

**Tech Stack:** React 19, Vite 8, React Router 7, TypeScript 6, styled-components 6, lucide-react, Phosphor icons only in the bottom nav. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-19-public-state-system.md`

## Global Constraints

- Public pages only: Home, Projects, Pricing, FAQs, Testimonials, About, Contact, Privacy Policy, Terms of Service, and `/team/:slug`. Admin is untouched. 404 is not part of this system.
- Public content is synchronous. Never add artificial loading latency to production. Skeletons are visible through a dev-only `?state=loading|empty|error|success` query; production ignores the parameter.
- Page-specific skeletons must be built from shared primitives and section skeletons. Every skeleton mirrors the real page layout closely enough that content does not jump when it arrives.
- Skeleton pulse is the single owner-approved exception to the “no ambient loops except the testimonial marquee” rule. `prefers-reduced-motion: reduce` must disable it.
- Empty/error/success copy lives in `data/database/states.json`; never hardcode page-level state copy in JSX. Shared system error copy also lives there.
- Page-level empty state keeps the real page hero above the panel. The hero keeps the page `h1`; the state panel uses `h2`. Loading replaces the page content with its skeleton. Error/empty show the hero plus the state panel; the page closing CTA is not rendered in those states. The standalone route error page uses `h1`.
- Real empty conditions: Projects 0, plans 0, FAQs 0, testimonials + sample testimonials 0, About services 0, legal sections 0. Home has no page-level production empty; optional empty home sections hide. Contact has no production empty. A missing team member stays the existing NotFound page.
- Spinners only for real async work. The contact submit is the only public request today. Do not add spinners to navigation, filters, currency toggles, carousel controls, like, theme, or modal links.
- Use theme tokens, 44px public controls, one icon per action, visible focus, and both themes.
- The project has no test framework. Do not add one. Verify with `npm run typecheck`, `npm run lint`, `npm run check:grid`, `npm run build`, and browser checks.
- Do not commit, stage, reset, or create branches unless the owner explicitly asks. The plan’s commit steps are intentionally omitted.
- Preserve the existing scroll contract, reduced-motion behaviour, content-in-data rule, sample locks, one-icon rule, and `/admin` noindex.

## Review Focus

- **Contact double submit/failure:** the submitting state must disable the button, announce `aria-busy`, and recover or show a failure panel without losing typed data. Task 2.
- **Empty About data:** `AboutUsPage` reads `services[0]`; the page must render its empty state without throwing or mounting the service explorer with no service. Task 3.
- **Route chunk failure and hydration warning:** a failed lazy route must show the public error element, and the initial hydration must show `HydrateFallback` instead of the router default. Task 7.
- **Preview leakage:** the `?state` preview must be ignored outside `import.meta.env.DEV` and must not replace content in production. Task 1 + Task 8.
- **Skeleton layout:** every skeleton must fit 320px without horizontal scroll and approximate the final hero/card/text/control dimensions so content does not jump. Tasks 2–7 + Task 8.

---

### Task 1: Shared state contract and skeleton foundation

**Files:**
- Create: `data/database/states.json`
- Modify: `src/data/types.ts`
- Modify: `src/data/index.ts`
- Create: `src/components/state/types.ts`
- Create: `src/components/state/usePublicPreviewState.ts`
- Create: `src/components/state/StatePanel.tsx`
- Create: `src/components/state/styles/state-panel.styled.ts`
- Create: `src/components/state/PageState.tsx`
- Create: `src/components/state/styles/page-state.styled.ts`
- Create: `src/components/state/Spinner.tsx`
- Create: `src/components/state/styles/spinner.styled.ts`
- Create: `src/components/state/VisuallyHidden.tsx`
- Create: `src/components/skeletons/SkeletonPrimitives.tsx`
- Create: `src/components/skeletons/SkeletonSections.tsx`
- Create: `src/components/skeletons/styles/skeletons.styled.ts`

**Interfaces:**
- Produces `PageStateKey`, `PageStateActionRecord`, `PageStateCopyRecord`, `PageStatesRecord`, `pageStateCopy(page)`, `sharedStateCopy('error' | 'submitError')`, and `contactSuccessCopy()` from `@/data`.
- Produces `PublicPreviewState`, `usePublicPreviewState()`, `StatePanel`, `StateTone`, `PageState`, `Spinner`, `SkeletonBlock`, `SkeletonLine`, `SkeletonCircle`, `SkeletonCard`, `SkeletonButton`, `SkeletonPage`, `SkeletonPageHero`, `SkeletonHomeHero`, `SkeletonSectionHead`, `SkeletonCardGrid`, `SkeletonPlanCards`, `SkeletonProjectCarousel`, `SkeletonFaqWorkspace`, `SkeletonTestimonialCards`, `SkeletonComparison`, `SkeletonContactForm`, `SkeletonLegalDoc`, `SkeletonProfile`, `SkeletonCta`.

- [ ] **Step 1: Add the state copy data**

Create `data/database/states.json` with:

- `shared.error`: title “We couldn't load this page.”, description “Something went wrong. Try again, or go back home.”, actions `[{ label: 'Back home', to: '/', icon: 'Home' }]`.
- `shared.submitError`: title “We couldn't save your inquiry.”, description “Try sending it again. Your details are still in the form.”, actions `[]`.
- `pages.home.empty`: “Nothing published yet.” / “The site is being prepared. Tell us what you need in the meantime.” / action `Contact us` → `/contact`, icon `MessagesSquare`.
- `pages.projects.empty`: “Projects are on the way.” / “Permissioned case studies are on the way. Tell us what you need in the meantime.” / action `Discuss your project` → `/contact`, icon `MessagesSquare`.
- `pages.pricing.empty`: “Plans are being prepared.” / “Pricing will be published soon. Tell us about your project for a scoped quote.” / action `Contact us` → `/contact`, icon `MessagesSquare`.
- `pages.faqs.empty`: “No questions yet.” / “Answers will appear here once they are published. Ask us directly in the meantime.” / action `Ask a question` → `/contact`, icon `MessagesSquare`.
- `pages.testimonials.empty`: “No testimonials yet.” / “Client feedback will appear here once it is approved for publishing.” / action `Start a project` → `/contact`, icon `MessagesSquare`.
- `pages.about.empty`: “More about Ordacy is on the way.” / “The full story is being prepared. Tell us what you need in the meantime.” / action `Contact us` → `/contact`, icon `MessagesSquare`.
- `pages.contact.empty`: “The inquiry form is unavailable.” / “The form can't be shown right now. Please try again later.” / action `Back home` → `/`, icon `Home`.
- `pages['privacy-policy'].empty`: “This policy is being prepared.” / “The full policy will be published here. Contact us if you need the details now.” / action `Contact us` → `/contact`, icon `MessagesSquare`.
- `pages['terms-of-service'].empty`: “These terms are being prepared.” / “The full terms will be published here. Contact us if you need the details now.” / action `Contact us` → `/contact`, icon `MessagesSquare`.
- `pages['team-profile'].empty`: “This profile is being prepared.” / “The team member's details will appear here soon. Meet the rest of the team in the meantime.” / actions `Back to team` → `/#team` (`UsersRound`) and `Contact` → `/contact` (`MessagesSquare`).
- `pages.contact.success`: title “Thank you for sharing your project details.”, description “Your inquiry is saved in this browser. No message has been sent.”, no link actions.

- [ ] **Step 2: Add data types and accessors**

In `src/data/types.ts`, add:

```ts
export type PageStateKey =
  | 'home' | 'projects' | 'pricing' | 'faqs' | 'testimonials'
  | 'about' | 'contact' | 'privacy-policy' | 'terms-of-service' | 'team-profile'

export type PageStateActionRecord = { label: string; to: string; icon: string }
export type PageStateCopyRecord = {
  title: string
  description: string
  actions: readonly PageStateActionRecord[]
}
export type PageStatesRecord = {
  shared: { error: PageStateCopyRecord; submitError: PageStateCopyRecord }
  pages: Record<PageStateKey, { empty: PageStateCopyRecord; success?: PageStateCopyRecord }>
}
```

In `src/data/index.ts`, import `statesJson` as `PageStatesRecord`, resolve action icons with the existing `resolveIcon`, and export:

```ts
export type StateAction = { label: string; to: string; icon: LucideIcon }
export type StateCopy = { title: string; description: string; actions: readonly StateAction[] }
export function pageStateCopy(page: PageStateKey): StateCopy
export function sharedStateCopy(state: 'error' | 'submitError'): StateCopy
export function contactSuccessCopy(): StateCopy
```

All three return a defensive fallback copy if a key is missing; do not throw in the public state layer.

- [ ] **Step 3: Add preview and state primitives**

`usePublicPreviewState.ts`:

```ts
export type PublicPreviewState = 'loading' | 'empty' | 'error' | 'success'
export function usePublicPreviewState(): PublicPreviewState | null
```

Return `null` when `!import.meta.env.DEV`. Otherwise read `new URLSearchParams(window.location.search).get('state')` and return only the four valid values.

`StatePanel` props:

```ts
export type StateTone = 'empty' | 'error' | 'success'
type StatePanelProps = {
  tone: StateTone
  title: string
  description: string
  icon?: LucideIcon
  actions?: ReactNode
  headingLevel?: 1 | 2
  compact?: boolean
}
```

Default icons: `Inbox` for empty, `CircleAlert` for error, `CheckCircle2` for success. Render `role="alert"` for error and `role="status"` otherwise. The title is `h1` when `headingLevel === 1`, otherwise `h2`. The icon tile uses the accent for empty/success and danger text for error. Center the panel; `compact` reduces the vertical padding for the contact form failure.

`PageState` props:

```ts
type PageStateProps = {
  page: PageStateKey
  hero: ReactNode
  skeleton: ReactNode
  empty?: boolean
  children: ReactNode
}
```

Behaviour, in order:

1. `loading` preview → render `skeleton` only.
2. `error` preview → render `hero` plus a page-state section containing an error `StatePanel` at heading level 2, with a `Try again` `PrimaryAction` and the shared error actions as `SecondaryButton`s. In dev preview, “Try again” removes the `state` query and reloads; otherwise reload.
3. `empty` preview or `empty === true` → render `hero` plus a page-state section containing an empty `StatePanel` at heading level 2 with `pageStateCopy(page)`. Render the first data action as the primary link and any additional actions as secondary links.
4. Otherwise render `hero` plus `children`.
5. `success` preview is ignored here; the contact form owns it.

The page-state section uses the public section rhythm (`clamp(3.5rem, 8vw, 5.5rem)`), the content max width, and centered content. No closing CTA is rendered by `PageState`.

`VisuallyHidden` is a small `span` with the standard clip/absolute styles for skeleton labels.

- [ ] **Step 4: Add the shared spinner**

`Spinner` props: `{ size?: 14 | 16 | 18 | 20 | 24; label?: string }`. It renders a `Loader2` with a 0.8s linear infinite rotation, `role="status"` and a visually hidden label only when labelled. Inside the contact button it is `aria-hidden`; the button supplies `aria-busy` and the visible “Sending…”. Under `prefers-reduced-motion: reduce` the rotation stops; the loading state remains communicated by the text.

- [ ] **Step 5: Add skeleton primitives and pulse**

In `SkeletonPrimitives.tsx`, export:

```ts
SkeletonBlock  // $w?: string, $h?: string, $r?: string, $tone?: 'default' | 'dark'
SkeletonLine   // $w?: string; h defaults 0.875rem
SkeletonCircle // $size?: string
SkeletonCard   // bordered surface with $pad?: string
SkeletonButton // 2.75rem tall, $w?: string
SkeletonPill   // pill height 1.75rem, $w?: string
SkeletonPage   // role=status, aria-busy, VisuallyHidden label, visual children aria-hidden
```

`SkeletonBlock` default background is `theme.colors.background.subtle`; the `dark` tone uses `rgba(254,254,254,0.1)` on navy. The pulse is a 1.6s ease-in-out alternate opacity animation (`0.55 → 0.9`); `@media (prefers-reduced-motion: reduce)` removes it. All skeleton shapes inherit the animation.

`SkeletonSections.tsx` provides the shared compositions listed in Interfaces. The `SkeletonHomeHero` mirrors the home cover/profile/team strip; `SkeletonPageHero` is the shared PageHero band with an optional action row (disabled for the team profile, whose actions live in the profile strip). Card skeletons use the real card radii and 16:10 project media; the comparison skeleton adapts to the current stacked/table layouts with the same breakpoints; the form skeleton uses 2.75rem fields and a 44px submit; the legal doc skeleton uses a TOC column and text lines; the profile skeleton uses the page hero, profile strip, resume columns, and skills band.

- [ ] **Step 6: Verify the foundation**

Run:

```bash
npm run typecheck
npm run lint
npm run check:grid
npm run build
```

Expected: all pass. No page renders these components yet; browser verification begins in Task 2.

### Task 2: Contact vertical slice

**Files:**
- Create: `src/features/contact/skeletons/ContactSkeleton.tsx`
- Modify: `src/features/contact/ContactPage.tsx`
- Modify: `src/features/contact/ContactForm.tsx`
- Modify: `src/features/contact/styles/contact.styled.ts` only where the state panel/spinner needs spacing

**Interfaces:**
- Consumes: `PageState`, `StatePanel`, `Spinner`, `SkeletonPage`, `SkeletonPageHero`, `SkeletonSectionHead`, `SkeletonContactForm`, `pageStateCopy`, `contactSuccessCopy`, `usePublicPreviewState`.
- Produces: the working state pattern for every later page.

- [ ] **Step 1: Compose `ContactSkeleton`**

Wrap the visual in `SkeletonPage label="Loading contact page"`. Render `SkeletonPageHero`, then the contact layout: a form card skeleton with the header icon/title, two field rows, a full field, a 2-up row, a textarea block, and a submit button; an aside with a section head, three step cards, and an assurances row; then `SkeletonCta`.

- [ ] **Step 2: Wrap the contact page**

Extract the existing `<PageHero ... />` as the `hero` prop. Put the existing `<S.Layout>…</S.Layout>` and closing CTA inside `PageState` children:

```tsx
<PageState
  page="contact"
  hero={<PageHero ... />}
  skeleton={<ContactSkeleton />}
>
  ...existing layout and CTA...
</PageState>
```

Pass `previewSuccess={usePublicPreviewState() === 'success'}` to `<ContactForm />`. Do not pass any production success state.

- [ ] **Step 3: Add the contact form states**

- Add `previewSuccess?: boolean` to `ContactForm`; initialise `status` to `'sent'` when true.
- Replace the `Loader2` submit icon with `<Spinner size={18} />`; add `aria-busy={status === 'sending'}` to the submit button; keep it disabled while sending.
- Replace the existing success markup with `StatePanel tone="success" headingLevel={2} title={contactSuccessCopy().title} description={contactSuccessCopy().description} actions={<S.SecondaryAction ...>Send again</S.SecondaryAction>}`. Keep the form card header above it.
- Replace the submit failure `S.ErrorText` with a compact `StatePanel tone="error" headingLevel={2}` using `sharedStateCopy('submitError')`, no duplicate retry button (the form submit remains available). Preserve the failure focus target with a ref or wrap the panel in a focusable container.
- Keep field validation errors inline as they are.

- [ ] **Step 4: Verify the contact slice**

Run the four project checks. In the browser at 380 and 768:

```text
/contact?state=loading  → skeleton, no hero, no overflow
/contact?state=empty    → hero + empty panel + actions
/contact?state=error    → hero + error panel + Try again/Back home
/contact?state=success  → form card success panel
```

Submit a valid inquiry: spinner appears, button is disabled and `aria-busy="true"`, success panel appears, “Send again” restores the form. Submit invalid fields: inline errors remain. Confirm the preview query is ignored when `import.meta.env.DEV` is false (code check).

### Task 3: Home and About

**Files:**
- Create: `src/features/home/skeletons/HomeSkeleton.tsx`
- Create: `src/features/about/skeletons/AboutSkeleton.tsx`
- Modify: `src/features/home/HomePage.tsx`
- Modify: `src/features/about/AboutUsPage.tsx`
- Modify: `src/features/home/sections/Projects.tsx`
- Modify: `src/features/about/AddressExplorer.tsx` or `ServiceExplorer.tsx` only if the empty guard requires it

**Interfaces:**
- Consumes Task 1 primitives and `PageState`.
- Produces `HomeSkeleton` and `AboutSkeleton`, plus the conditional home section rules.

- [ ] **Step 1: Compose `HomeSkeleton`**

`SkeletonPage label="Loading home page"` with: `SkeletonHomeHero` (cover band, avatar circle, name/bio lines, stats, actions, two team cards), marketing pricing cards, project carousel cards, testimonial cards, process steps, FAQ rows, and `SkeletonCta`.

- [ ] **Step 2: Wrap Home**

Restructure `HomePage` so `<Hero />` is the `PageState` hero and the remaining sections are children. Use `page="home"` and `empty={false}`. Hide optional sections with no data:

- `<Pricing />` only when `plans.length > 0`.
- `<Projects />` keeps its intentional empty state, but that block now uses `StatePanel` with the existing `projects.empty` copy and the existing Discuss your project action. Remove `empty-state.styled` if no imports remain.
- `<Testimonials />` only when real or sample testimonials exist.
- `<Process />` only when `steps.length > 0`.
- `<Faq />` only when `faqs.length > 0`.
- `<FinalCta />` always.

Import the data arrays needed for these guards. Do not duplicate the Hero.

- [ ] **Step 3: Compose `AboutSkeleton`**

`SkeletonPage label="Loading about page"` with page hero, intro paragraphs, service explorer/sidebar + panel, approach cards, process path, audience cards, expectations, and CTA.

- [ ] **Step 4: Wrap About**

Extract the existing PageHero as `hero`. Use `page="about"`, `empty={services.length === 0}`, `skeleton={<AboutSkeleton />}`. Keep the service state initialisation safe (`services[0]?.id ?? ''`). The empty branch must not render the explorers or process sections.

- [ ] **Step 5: Verify**

Run the four checks. Browser at 320/380/768/1440:

- Home ready; home loading/empty/error previews; no hero duplication; no overflow.
- About ready; about loading/empty/error; temporarily force `services` empty in dev to confirm the real empty path and that `services[0]` does not throw; restore.
- Reduced motion: no pulse.

### Task 4: Projects and Pricing

**Files:**
- Create: `src/features/projects/skeletons/ProjectsSkeleton.tsx`
- Create: `src/features/pricing/skeletons/PricingSkeleton.tsx`
- Modify: `src/features/projects/ProjectsPage.tsx`
- Modify: `src/features/pricing/PricingPage.tsx`
- Modify: `src/features/projects/styles/projects-page.styled.ts` only to remove the old inline empty block if it becomes unused

**Interfaces:**
- Consumes Task 1 primitives, `PageState`.
- Produces the two collection-page state behaviours.

- [ ] **Step 1: Compose the skeletons**

`ProjectsSkeleton`: page hero, section head, segmented filter bar, project carousel/cards, CTA.

`PricingSkeleton`: page hero, plan cards, comparison stack below xl and table above xl, how-it-works cards, FAQ rows, CTA.

- [ ] **Step 2: Wrap Projects**

Use `page="projects"`, `empty={count === 0}`, hero = existing PageHero, skeleton = `ProjectsSkeleton`, children = the existing work Section and CTA. Remove the old `S.EmptyState` internal branch; `PageState` now owns the empty presentation. Keep filters, pagination, carousel, and details modal unchanged in the ready state.

- [ ] **Step 3: Wrap Pricing**

Use `page="pricing"`, `empty={plans.length === 0}`, hero = `PricingHero`, skeleton = `PricingSkeleton`, children = the existing plans, compare, how-it-works, FAQ, and CTA. Guard the ready content with the plans data so an empty collection cannot render an empty comparison.

- [ ] **Step 4: Verify**

Run the four checks. Browser at 320/380/768/1440: ready pages, loading/empty/error previews, no overflow, no duplicated hero, Projects filters still work, Pricing currency toggle and comparison still work. Force `count`/`plans` to zero in dev temporarily and confirm the real empty path.

### Task 5: FAQs and Testimonials

**Files:**
- Create: `src/features/faqs/skeletons/FaqsSkeleton.tsx`
- Create: `src/features/testimonials/skeletons/TestimonialsSkeleton.tsx`
- Modify: `src/features/faqs/FaqsPage.tsx`
- Modify: `src/features/testimonials/TestimonialsPage.tsx`
- Modify: `src/components/ui/EmptyState.tsx` to compose `StatePanel`
- Delete: `src/components/ui/styles/no-results.styled.ts` once no imports remain

**Interfaces:**
- Consumes Task 1 primitives, `PageState`.
- Produces the FAQ/testimonial state behaviours and the compatibility `EmptyState` wrapper.

- [ ] **Step 1: Compose the skeletons**

`FaqsSkeleton`: page hero, topic filter row, search field, FAQ accordion rows, CTA.

`TestimonialsSkeleton`: page hero, testimonial card grid with pagination, CTA.

- [ ] **Step 2: Wrap FAQs**

Use `page="faqs"`, `empty={faqs.length === 0}`, hero = existing PageHero, skeleton = `FaqsSkeleton`, children = the questions Section and CTA. Leave `FaqBrowser` unchanged; it keeps its no-match result state, now rendered through the updated `EmptyState` wrapper.

- [ ] **Step 3: Update `EmptyState`**

Replace the old markup with:

```tsx
<StatePanel
  tone="empty"
  icon={icon}
  title={title}
  description={description}
  actions={children}
/>
```

This keeps the existing FAQ no-match caller working while making the no-results visual part of the reusable state system. Remove `no-results.styled.ts` if it becomes unused. The Home Projects empty block is updated separately in Task 3.

- [ ] **Step 4: Wrap Testimonials**

Use `page="testimonials"`, `empty={items.length === 0}` where `items = hasReal ? testimonials : sampleTestimonials`; hero = `TestimonialsHero`, skeleton = `TestimonialsSkeleton`, children = the feedback Section and CTA. Do not treat real testimonials being absent while samples exist as empty.

- [ ] **Step 5: Verify**

Run the four checks. Browser at 320/380/768/1440: ready/loading/empty/error on both; FAQ search no-match still shows the local state and clear action; testimonials samples still render when real testimonials are absent; pagination still works.

### Task 6: Legal and Team profiles

**Files:**
- Create: `src/features/legal/skeletons/LegalSkeleton.tsx`
- Create: `src/features/team/skeletons/TeamProfileSkeleton.tsx`
- Modify: `src/features/legal/LegalPage.tsx`
- Modify: `src/features/team/TeamMemberPage.tsx`

**Interfaces:**
- Consumes Task 1 primitives, `PageState`.
- Produces legal/team states and the `PageStateKey` mapping (`privacy-policy`, `terms-of-service`, `team-profile`).

- [ ] **Step 1: Compose the skeletons**

`LegalSkeleton`: page hero, document meta, TOC column, and long-form body lines, CTA.

`TeamProfileSkeleton`: page hero, profile strip (avatar/name/role/facts/actions), resume profile/experience/education cards, side credentials/contact cards, skills groups, CTA.

- [ ] **Step 2: Wrap Legal**

Use the page key derived from `seo.path` (`/privacy-policy` → `privacy-policy`, otherwise `terms-of-service`). Hero = existing PageHero. `empty={document.sections.length === 0}`. Skeleton = `LegalSkeleton`. Children = the existing doc and CTA. The active-section hook still runs only in the ready branch or with an empty array safely.

- [ ] **Step 3: Wrap Team profiles**

After the missing-member NotFound check, use `page="team-profile"`, `empty={false}`, hero = `<TeamHero member={member} />`, skeleton = `TeamProfileSkeleton`, children = `<TeamResume />` and the closing CTA. A missing member must still render `NotFoundPage`, not the team state panel.

- [ ] **Step 4: Verify**

Run the four checks. Browser at 320/380/768/1440: both legal pages and both team profiles in ready/loading/empty/error; no duplicated hero; legal empty forced with `sections=[]`; team missing slug still 404; profile actions unaffected.

### Task 7: Route loading and error boundaries

**Files:**
- Create: `src/components/layout/PublicThemeProvider.tsx`
- Modify: `src/components/layout/RootLayout.tsx` to use `PublicThemeProvider`
- Create: `src/app/RouteLoading.tsx`
- Create: `src/app/RouteErrorPage.tsx`
- Create: `src/app/styles/route-state.styled.ts`
- Modify: `src/app/router.tsx`

**Interfaces:**
- Produces `PublicThemeProvider({ children })`, which supplies the fluid public theme using the current app theme.
- Produces `RouteLoading` (generic skeleton) and `RouteErrorPage` (public route error element), both wrapped in `PublicThemeProvider`.
- Consumes `SkeletonPage`, `SkeletonPageHero`, `SkeletonCta`, `StatePanel`, `sharedStateCopy`, and `usePageMeta`.

- [ ] **Step 1: Extract the public theme provider**

Move the `useAppTheme` lookup and the fluid `StyledThemeProvider` from `RootLayout` into a new `PublicThemeProvider` component. Use it in `RootLayout`. Use it around `RouteLoading` and `RouteErrorPage` so state pages keep the fluid public typography even though they render outside `RootLayout`.

- [ ] **Step 2: Create `RouteLoading`**

A standalone full-page skeleton for initial hydration: a minimal brand row, page hero skeleton, and a generic content/section/CTA skeleton. It must not depend on `RootLayout`, public data, or lazy route modules. Wrap it in `PublicThemeProvider`.

- [ ] **Step 3: Create `RouteErrorPage`**

Use the shared error copy and `StatePanel tone="error" headingLevel={1}`. Actions: `Try again` → `window.location.reload()` and the shared error links. The page must be usable without the public layout and must not expose the raw error. Call `usePageMeta` with an inline noindex record: `{ path: '*', title: 'Something went wrong | Ordacy', description: 'The page could not be loaded. Try again or return home.', canonical: null, ogTitle: null, ogDescription: null, ogImage: null, noindex: true }`. The `*` path suppresses the derived canonical like the 404 SEO record. Wrap it in `PublicThemeProvider`.

- [ ] **Step 4: Wire the router**

On the public `/` route object add:

```tsx
HydrateFallback: RouteLoading,
errorElement: <RouteErrorPage />,
```

Do not change the admin route. The 404 child stays.

- [ ] **Step 5: Verify**

Run the four checks. In the browser:

- Initial load no longer logs “No `HydrateFallback` element provided”.
- Temporarily add `throw new Error('route test')` in `ProjectsPage`; navigate to `/projects`; confirm the public `RouteErrorPage` renders; remove the throw.
- Confirm the admin route is unaffected.
- Confirm the error/loading text uses the fluid public type at 380px.

### Task 8: Full public QA sweep

**Files:**
- Modify: `AGENTS.md` only to document the public state system and dev preview convention (short section; no admin changes)
- No other implementation files unless a QA failure requires a fix

**Interfaces:**
- Consumes every task above.

- [ ] **Step 1: Run the project checks**

```bash
npm run typecheck
npm run lint
npm run check:grid
npm run build
```

- [ ] **Step 2: Preview every page/state**

For each of `/`, `/projects`, `/pricing`, `/faqs`, `/testimonials`, `/about-us`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/team/orlando-dela-cruz`, `/team/darcy-tabafunda`:

- Ready at 320, 380, 768, 1440.
- `?state=loading`, `?state=empty`, `?state=error` at 320 and 768.
- Contact also `?state=success`.
- Confirm the hero appears exactly once in empty/error, the skeleton replaces the page, and the state actions navigate.
- Confirm no horizontal page overflow and no console errors.

- [ ] **Step 3: Check themes, motion, and keyboard**

- Both light and dark modes on Home, Contact, and one legal page.
- `prefers-reduced-motion: reduce`: skeleton pulse stops; the contact spinner still communicates via the “Sending…” text.
- Tab through the skeleton/state/contact success/error; focus visible; error panel alerts announced.
- Mock the contact failure by temporarily throwing in `submitInquiry`; confirm the compact error panel and retained form data; remove the throw.

- [ ] **Step 4: Confirm preview isolation**

Build the production bundle and confirm `?state=loading` does not replace content (the parameter is ignored when `import.meta.env.DEV` is false). No production latency is added.

- [ ] **Step 5: Final report**

List the files added/changed, the pages verified, the checks that passed, any forced-data checks and their restoration, and any remaining risks. Do not commit.

## Self-Review

- Spec coverage: all public routes except 404, preview, page skeletons, StatePanel, spinners, empty policy, route errors/fallback, data copy, accessibility, failure modes.
- Type consistency: `PageStateKey` is used consistently by the data accessor, PageState, and pages; `StateCopy` actions resolve icons before reaching `PageState`; `PublicPreviewState` includes `success` but only Contact acts on it.
- Review Focus lines map to Task 2 (contact), Task 3 (About), Task 7 (route), Task 1/8 (preview isolation), and Tasks 2–7/8 (skeleton layout). The remaining checks — reduced motion, testimonials sample fallback, hero duplication — are explicit in Tasks 1, 3, 5, and 8.
- No test framework is added; verification matches the project’s existing commands.
- No commit steps; the owner has not authorized Git writes.
