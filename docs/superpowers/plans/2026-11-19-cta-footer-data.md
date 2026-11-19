# CTA, Footer & Data Centralization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every public page the same closing CTA banner and the same footer, drive all CTA and footer copy from the JSON data layer, slim the desktop team card, and remove the current inconsistencies.

**Architecture:** A new `actions` subdocument on page sections stores each CTA's two buttons (label, target, Lucide icon name). One `ClosingCta` component renders those records through the single default `CtaBanner` design; the per-page variants (`gradient`, `compact`, `stacked`, inverse button, mobile banner) are removed. Legal documents carry the same CTA shape as a nested `cta` object. `SiteFooter` moves from the Home feature into the root layout, with its group titles centralized in `navigation.ts`. The admin Website Content editor gains a two-button editor for CTA sections.

**Tech Stack:** React 19, TypeScript 6, styled-components 6, React Router 7, Vite 8, JSON content records, Lucide icon map.

**Spec:** No separate spec. The approved values are in Global Constraints.

## Global Constraints

- CTA and footer copy lives in `data/database/*.json`; no CTA labels, titles, descriptions, or links in JSX.
- Every public page ends with the CTA banner: Home, Projects, Pricing, Testimonials, About, FAQs, Contact, Privacy Policy, Terms of Service, both team profiles, and the 404.
- Every public page shows the footer. `/admin` keeps its own shell and gets no marketing footer.
- The banner is the Home design only: eyebrow badge with `Handshake`, title, description, exactly two actions, primary navy with the trailing arrow, secondary transparent. No gradient, compact, stacked, or inverse variants.
- CTA action order is primary first, secondary second. The primary carries the trailing arrow; the secondary does not.
- CTA icons come from `src/data/icons.ts` by name. Add `Compass` and `House` there because those names are not currently in the map.
- Keep the storage prefix `ordacy-cms:v2:`. `actions` is optional; `mergePageSections` backfills it from the seed for records saved before this change.
- Legal documents are not admin-editable today; their CTA object is JSON-only and must be noted as such.
- The team card keeps its 2px teal avatar ring and founder tint; only its vertical padding changes at `md` to `16px` (horizontal stays `24px`).
- No new dependencies, no inline styles, no hardcoded colors, no new spacing tokens.
- Do not commit, stage, or discard anything without explicit approval.

## CTA copy and actions

| Page | Section | Eyebrow | Title | Description | Primary | Secondary |
|---|---|---|---|---|---|---|
| Home | `final-cta` | Let's work together | Build Better Together. | Tell us about your project. We will propose a solution that fits how you work. | Start a project → `/contact` · Rocket | Explore our services → `/about-us#services` · Compass |
| Projects | `start` | Let's work together | Have something similar in mind? | Tell us about your project. We will suggest the right scope, approach, and solution. | Start a project → `/contact` · Rocket | See pricing → `/pricing` · Wallet |
| Pricing | `cta` | Let's work together | Start from a clear price. | Choose a starting point, then we will scope the rest together. | Start a conversation → `/contact` · MessagesSquare | See concept projects → `/projects` · FolderKanban |
| Testimonials | `cta` | Let's work together | Ready to talk about your project? | Share your goals. We'll propose a solution that fits how you work. | Start a conversation → `/contact` · MessagesSquare | See concept projects → `/projects` · FolderKanban |
| About | `work-with-us` | Let's work together | Work with us. | Tell us what you need. We will talk through the right scope together. | Start a project → `/contact` · Rocket | See pricing → `/pricing` · Wallet |
| FAQs | `cta` | Let's work together | Still have a question? | Send it over and we'll reply with a clear answer. | Ask us directly → `/contact` · MessagesSquare | See pricing → `/pricing` · Wallet |
| Contact | `cta` (new) | Let's work together | Send us the details. | Tell us about your project and we'll reply with a clear next step. | Send an inquiry → `#inquiry-form` · MessagesSquare | See pricing → `/pricing` · Wallet |
| Team profiles | `cta` (new) | Let's work together | Work with us. | Tell us what you need. We will talk through the right scope together. | Start a project → `/contact` · Rocket | See pricing → `/pricing` · Wallet |
| 404 | `cta` (new) | Let's work together | Let's get you back on track. | Head back home or tell us what you were looking for. | Back to home → `/` · House | Contact → `/contact` · MessagesSquare |
| Privacy | `cta` (new) | Let's work together | Questions about this policy? | Contact us if anything here needs clarification. | Contact us → `/contact` · MessagesSquare | Back to home → `/` · House |
| Terms | `cta` (new) | Let's work together | Questions about these terms? | Contact us if anything here needs clarification. | Contact us → `/contact` · MessagesSquare | Back to home → `/` · House |

## Review Focus

- A page record saved before this change has no `actions`; the merge must backfill them from the seed, or those pages would render an empty banner.
- The Contact primary is a hash (`#inquiry-form`); it must render a real anchor that scrolls under the sticky bar, not a router link that changes the URL unexpectedly.
- The 404 currently renders four suggestion links; replacing them with the banner must leave one clear primary action and no duplicated navigation.
- The footer move must not render twice on Home and must not appear inside `/admin`.
- Admin action edits must validate the link and icon names; an unknown icon makes `resolveIcon` throw at render time.

---

### Task 1: Add the CTA data model and seed content

**Files:**
- Modify: `src/data/types.ts:54-64`, `:337-343`
- Modify: `src/data/icons.ts`
- Modify: `src/data/index.ts:64-90`
- Modify: `data/database/pages.json` (the CTA sections and new sections below)
- Modify: `data/database/legal.json` (`privacy.cta`, `terms.cta`)

**Interfaces:**
- Produces: `PageCtaAction = { label: string; to: string; icon: string }`.
- Produces: `PageSectionRecord.actions?: readonly PageCtaAction[] | null`.
- Produces: `PageCta = { eyebrow: string; title: string; description: string; actions: readonly PageCtaAction[] }` and `LegalDocument.cta: PageCta`.
- Produces: `actions` backfilled by `mergePageSections`.
- Consumes later: `ClosingCta` and the pages that pass these records.

- [ ] **Step 1: Extend the types**

In `src/data/types.ts` add:

```ts
export type PageCtaAction = {
  label: string
  to: string
  icon: string
}
```

Add `actions?: readonly PageCtaAction[] | null` to `PageSectionRecord`, and add `cta: PageCta` to `LegalDocument` with:

```ts
export type PageCta = {
  eyebrow: string
  title: string
  description: string
  actions: readonly PageCtaAction[]
}
```

- [ ] **Step 2: Add the missing icon names**

In `src/data/icons.ts`, add `Compass` and `House` to the imported Lucide icons and to the `icons` map so `resolveIcon('Compass')` and `resolveIcon('House')` work.

- [ ] **Step 3: Backfill actions for old saved pages**

In `mergePageSections`, extend the per-section fill so a stored section missing `actions` receives the seed section's actions, matching the existing `mobile` backfill. Keep saved `actions` when present.

- [ ] **Step 4: Fill the page CTA records**

For each page in the copy table, add `"eyebrow": "Let's work together"` and the `actions` array to the existing CTA section. Add the new `cta` section to `contact`, `team`, and `not-found` in `pages.json` with the table's copy, `"label": "Call to action"`, and `"items": null`. Keep every other section untouched.

- [ ] **Step 5: Add the legal CTA records**

In `data/database/legal.json`, add the table's `cta` object to both `privacy` and `terms`.

- [ ] **Step 6: Verify the data**

Run `npm run typecheck`. Then list every CTA section and its action icons:

```bash
node -e "const p=require('./data/database/pages.json');const l=require('./data/database/legal.json');const ids=['home','projects','pricing','testimonials','about','faqs','contact','team','not-found'];for(const id of ids){const page=p.find(x=>x.id===id);const s=page&&page.sections.find(x=>Array.isArray(x.actions));console.log(id, s?'ok':'MISSING', s?(s.actions.map(a=>a.icon).join(',')):'')}for(const d of [l.privacy,l.terms])console.log('legal',d.cta.actions.map(a=>a.icon).join(','))"
```

Expected: every id prints `ok` and only `Rocket`, `Compass`, `Wallet`, `MessagesSquare`, `FolderKanban`, and `House` appear. Confirm each name exists in `src/data/icons.ts`.

### Task 2: Build the shared closing CTA

**Files:**
- Create: `src/components/ui/ClosingCta.tsx`
- Modify: `src/components/ui/styles/cta-banner.styled.ts`

**Interfaces:**
- Consumes: `PageCtaAction`, `resolveIcon`.
- Produces: `ClosingCta` with props `{ id?: string; titleId: string; eyebrow: string | null; title: string; description?: string | null; actions: readonly PageCtaAction[] }`.
- Produces: `PrimaryAnchor` in `cta-banner.styled.ts` for hash targets. Existing variants stay until Task 3 removes their last use.

- [ ] **Step 1: Add the anchor primary**

Extract the shared primary declarations into a `primaryStyles` `css` block and apply it to both `PrimaryButton` (Link) and a new `PrimaryAnchor` (anchor), so a hash CTA has the same look, hover, and arrow. Leave `InverseButton`, `SecondaryButton`, and the `CtaBanner` variants untouched for now.

- [ ] **Step 2: Create `ClosingCta`**

Render `CtaBanner` with the `Handshake` eyebrow icon (when an eyebrow is present), the title/description, and exactly two actions. Map each action's icon with `resolveIcon`. Use `PrimaryAnchor` when `to` starts with `#`, otherwise `PrimaryButton`; always append `ButtonArrow` to the primary. Use `SecondaryButton` for the second action. If fewer than two actions exist, render only what is present.

- [ ] **Step 3: Verify**

Run `npm run typecheck` and `npm run lint`; expected: pass. Nothing uses `ClosingCta` yet, and the old variants still compile.

### Task 3: Wire the six existing CTA pages

**Files:**
- Modify: `src/features/home/sections/FinalCta.tsx`
- Modify: `src/features/projects/ProjectsPage.tsx`
- Modify: `src/features/pricing/PricingPage.tsx`
- Modify: `src/features/testimonials/TestimonialsPage.tsx`
- Modify: `src/features/about/AboutUsPage.tsx`
- Modify: `src/features/about/styles/about.styled.ts`
- Modify: `src/features/faqs/FaqsPage.tsx`
- Modify: `src/components/ui/CtaBanner.tsx`
- Modify: `src/components/ui/styles/cta-banner.styled.ts`
- Delete: `src/features/about/MobileCta.tsx`, `src/features/about/styles/mobile-cta.styled.ts`

**Interfaces:**
- Consumes: `ClosingCta` and the Task 1 records.
- Produces: every existing closing CTA renders the same banner.

- [ ] **Step 1: Replace each inline banner**

In each page, replace the current `CtaBanner`/section markup and hardcoded buttons with `ClosingCta`, passing the section record from `getSection`/`sectionCopy`, the page's existing `titleId`, and `actions={section.actions ?? []}`.

- [ ] **Step 2: Remove the About desktop/mobile split**

Render one `ClosingCta` for the `work-with-us` section at every width. Remove the `isDesktop` branch for the closing block, the `S.CtaWrap` wrapper, the `MobileCta` import, and the `Closing`/`CtaBanner`/`LayoutGrid`/`MessagesSquare` imports if they become unused. Delete the `CtaWrap` styled export.

- [ ] **Step 3: Replace the FAQs section**

Render the `faqs.cta` record through `ClosingCta` instead of the `Section` + `PrimaryButton`. Remove the now-unused `PrimaryButton` import.

- [ ] **Step 4: Remove the variants and dead code**

Now that no page passes them, remove the `stacked`, `gradient`, and `compact` props and CSS from `CtaBanner`/`cta-banner.styled.ts` (the ring always renders; one padding, margin, description width, and actions layout). Remove `InverseButton`. Delete `MobileCta.tsx` and `mobile-cta.styled.ts`. Delete the `CtaWrap` styled export.

- [ ] **Step 5: Verify**

Run `npm run typecheck` and `npm run lint`. Load Home, Projects, Pricing, Testimonials, About, and FAQs at 1445 and 390: every closing CTA shows the eyebrow, title, description, and two actions in the same layout.

### Task 4: Add CTAs to Contact, legal, team profiles, and 404

**Files:**
- Modify: `src/features/contact/ContactPage.tsx`
- Modify: `src/features/legal/LegalPage.tsx`
- Modify: `src/features/team/TeamMemberPage.tsx`
- Modify: `src/app/NotFoundPage.tsx`
- Modify: `src/app/styles/not-found-page.styled.ts` (remove the unused `Links` styles)

**Interfaces:**
- Consumes: `ClosingCta`, `getSection('contact','cta')`, `getSection('team','cta')`, `getSection('not-found','cta')`, `document.cta`.
- Produces: every listed page ends with the banner.

- [ ] **Step 1: Contact**

Read `contact.cta` and render `ClosingCta` after `S.Layout` with `titleId="contact-cta-title"`. Confirm the primary hash renders an anchor and scrolls to `#inquiry-form`.

- [ ] **Step 2: Legal**

Render `ClosingCta` after `S.Layout` with `titleId="legal-cta-title"` and the `document.cta` fields.

- [ ] **Step 3: Team profiles**

Read `team.cta` and render `ClosingCta` after `<TeamResume />` with `titleId="team-cta-title"`.

- [ ] **Step 4: 404**

Replace the `links` array and `S.Links` nav with `ClosingCta` from the `not-found` `cta` section. Remove the unused `LucideIcon` type, link icons, and the `Links` style export.

- [ ] **Step 5: Verify**

Load Contact, Privacy, Terms, both team profiles, and a missing URL at 1445 and 390. Each must end with the banner; the Contact primary scrolls to the form; the 404 has one primary action and no duplicate link row.

### Task 5: Let admin edit CTA actions

**Files:**
- Modify: `src/features/admin/content/ContentAdminPage.tsx`

**Interfaces:**
- Consumes: `PageCtaAction`, `iconNames`.
- Produces: form fields `action1Label`, `action1To`, `action1Icon`, `action2Label`, `action2To`, `action2Icon`; saved `actions` arrays.

- [ ] **Step 1: Pass the actions into the block editor**

When rendering each `BlockForm`, pass `actions={section.actions}`. Extend `BlockFormProps` and the `onSave` callback signature to carry `PageCtaAction[]`.

- [ ] **Step 2: Render the two action rows**

When `actions` is defined, render a "Buttons" fieldset with six fields: primary label, primary link, primary icon, secondary label, secondary link, secondary icon. Use hints: `/path or #anchor` and `Lucide icon name`.

- [ ] **Step 3: Validate**

Require both rows to be complete. Reject links that do not start with `/` or `#`, and icons not present in `iconNames`. Show the error on the form and do not save.

- [ ] **Step 4: Persist**

Parse the six fields into two `PageCtaAction` records and save them on the section. For sections without actions, keep `section.actions` unchanged.

- [ ] **Step 5: Verify**

In `/admin/content`, edit Home's CTA primary label, save, reload `/`, and confirm the label changed. Restore it. Confirm an invalid icon or link is rejected.

### Task 6: Make the footer global and centralize its groups

**Files:**
- Create: `src/components/layout/SiteFooter.tsx` (moved from `src/features/home/sections/SiteFooter.tsx`)
- Create: `src/components/layout/styles/site-footer.styled.ts` (moved from the Home styles folder)
- Delete: `src/features/home/sections/SiteFooter.tsx`, `src/features/home/sections/styles/site-footer.styled.ts`
- Modify: `src/components/layout/RootLayout.tsx`
- Modify: `src/components/navigation/navigation.ts`
- Modify: `src/features/home/HomePage.tsx`

**Interfaces:**
- Produces: `footerGroups` in `navigation.ts` with `{ title, area, icon, items }`.
- Consumes: `SiteFooter` in `RootLayout` after `<Outlet />`.

- [ ] **Step 1: Move the footer**

Move the component and its style file to the layout folders. Update the style import to `./styles/site-footer.styled`; keep the alias imports for the brand, navigation, and data.

- [ ] **Step 2: Centralize the footer groups**

In `navigation.ts`, export `footerGroups` using `primaryNavItems` and `secondaryNavItems`, the `Compass` and `Building2` icons, and the titles `Explore` and `Company`. In `SiteFooter.tsx`, replace the local `groups` array with `footerGroups`.

- [ ] **Step 3: Mount it globally**

Render `<SiteFooter />` inside `RootLayout`'s `S.MainInner` after `<Outlet />`. Remove `<SiteFooter />` and its import from `HomePage`.

- [ ] **Step 4: Verify**

Run `npm run typecheck` and `npm run lint`. Check `/`, `/projects`, `/contact`, `/privacy-policy`, `/team/orlando-dela-cruz`, and `/page-not-found`: one footer each, no duplicate on Home, no footer in `/admin`.

### Task 7: Slim the team card

**Files:**
- Modify: `src/features/team/styles/team-strip.styled.ts:81-84`

- [ ] **Step 1: Reduce the desktop vertical padding**

In the `AvatarLink` `md` media query, change `padding: theme.spacing.lg` to `padding: theme.spacing.md theme.spacing.lg`. Leave the base padding, avatar size, gap, ring, founder tint, and hover behavior unchanged.

- [ ] **Step 2: Verify**

Run `npm run check:grid`. At 1445, the founder card's height must drop by 16px; at 390 it is unchanged; at 320 there is no overflow.

### Task 8: Full verification

**Files:** none modified.

- [ ] **Step 1: Run the project checks**

Run, in order: `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, `npm run build`. Expected: all pass.

- [ ] **Step 2: Public route sweep**

At 320, 390, 768, and 1445, in light and dark, load `/`, `/projects`, `/pricing`, `/testimonials`, `/about-us`, `/faqs`, `/contact`, `/privacy-policy`, `/terms-of-service`, both `/team/:slug` pages, and `/page-not-found`. Expected: every page ends with the same banner and a footer; no overflow; no console errors.

- [ ] **Step 3: Data and admin checks**

Confirm the distinctive CTA titles (for example `Build Better Together.`, `Start from a clear price.`, `Let's get you back on track.`) appear only in `data/database`, not in `src/**/*.tsx`. In `/admin/content`, edit and restore one CTA action. In `/admin/content`, confirm the new action fields are visible only on CTA sections. Confirm `/admin` has no marketing footer.

- [ ] **Step 4: Interaction checks**

Click the Contact banner primary and confirm it scrolls to the form under the sticky bar. Hover and focus the primary/secondary buttons; the arrow shifts on hover. Check the footer links and Back to top. Emulate reduced motion and confirm the banner ring and footer reveal are static.

- [ ] **Step 5: Stop**

Do not commit. Report the checks, screenshots, and any copy or layout caveat, then wait for approval.
