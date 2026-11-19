# FAQs & Legal Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn FAQs into a searchable help-center workspace and the two legal pages into premium document workspaces, with print-ready output, reusing the existing design system.

**Architecture:** Three small reusable primitives (`SearchField`, `EmptyState`, `useActiveSection`) support two page-level compositions. FAQs adds a client-side filter workspace around the existing `FaqList`; legal adds a sticky active TOC, document meta bar, numbered anchored sections, and a print contract. All copy remains in the existing data/legal records; only interface labels are new.

**Tech Stack:** React 19, TypeScript 6, styled-components 6, lucide-react, Vite 8, IntersectionObserver, `window.print()`.

**Spec:** No separate spec. The approved direction is in Global Constraints.

## Global Constraints

- Keep the existing `PageHero` and the shared `ClosingCta` on all three pages. Keep the 40px section rhythm and the mint canvas.
- Reuse `Section`, `SectionHead`, `FaqList`, `ClosingCta`, the button styles, and theme tokens. No new dependencies, colors, or spacing tokens.
- New global primitives: `SearchField`, `EmptyState`, `useActiveSection`. New FAQ-specific primitive: `TopicFilter`. New legal primitives: `LegalMeta`, `LegalToc`, `LegalSection`.
- Controls are 44px public; icon-only controls carry `aria-label`; every button/link carries an icon.
- Static surfaces are border-only with no shadow. Teal is for active states and actions only.
- Motion only for state change. The FAQ reveal runs once; filtering must not replay it. The TOC active state is a color/inset change.
- No FAQ or legal page copy moves into JSX. The ask card reuses `faqs.cta`; the legal contact card reuses `document.cta`.
- Print contract: `data-print-hide` on the shell, hero, CTA, and footer; the legal document prints on white with a title/date header.
- Do not commit, stage, or discard anything without explicit approval.

## Review Focus

- Combining search and topic must be correct, and an open question must never point at a different item after filtering; open state becomes id-based.
- The search field must be keyboard-operable with a label and a 44px clear button; the native search cancel affordance must not double up.
- The legal TOC must highlight the right section on load, on scroll, and after a hash jump, and must clean up its observer.
- Print must hide the shell, hero, CTA, TOC, and footer without hiding the document body; dark theme must print black on white.
- At 320px the FAQ topic chips and legal meta bar must wrap or scroll without horizontal overflow.

---

### Task 1: Add the reusable primitives

**Files:**
- Create: `src/components/ui/SearchField.tsx`
- Create: `src/components/ui/styles/search-field.styled.ts`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/styles/empty-state.styled.ts`
- Create: `src/hooks/useActiveSection.ts`

**Interfaces:**
- Produces: `SearchField({ id, label, value, placeholder, onChange })` — controlled text input with a search icon and a 44px clear button.
- Produces: `EmptyState({ icon, title, description, children })` — centered icon tile, title, body, optional action.
- Produces: `useActiveSection(ids: readonly string[]): string | null` — IntersectionObserver-based active id, initially the first id.

- [ ] **Step 1: Build `SearchField`**

Render a visible `<label htmlFor>` and a 44px control: `Search` icon at 18px left, `input type="search"` with `autoComplete="off"`, `spellCheck={false}`, and `padding-right: 3rem`. When `value` is non-empty, render a 44px icon button with `X` and `aria-label="Clear search"` that calls `onChange('')`. Hide the native cancel button with `::-webkit-search-cancel-button { appearance: none }`. Use `border.default` at rest, `border.focus` plus a 2px outline on focus, and `text.secondary` placeholder.

- [ ] **Step 2: Build `EmptyState`**

Render a centered block with an `IconTile`-style 48px badge (use the existing `IconTile` if its API fits; otherwise a local 48px tile with `background.subtle` and accent icon), a 22px bold title, a secondary description capped at 46ch, and the optional action slot. No border; the caller supplies the container.

- [ ] **Step 3: Build `useActiveSection`**

Use `IntersectionObserver` with `rootMargin: '-20% 0px -70% 0px'`, `threshold: 0`. Observe the elements for `ids`; on each callback, choose the topmost intersecting entry and set it. Initialize to `ids[0] ?? null`. Disconnect on cleanup. Re-run only when the joined id string changes, not on every array identity.

- [ ] **Step 4: Verify**

Run `npm run typecheck` and `npm run lint`; both pass. No page uses the primitives yet.

### Task 2: Build the FAQs workspace

**Files:**
- Modify: `src/features/home/sections/Faq.tsx`
- Modify: `src/features/home/sections/styles/faq.styled.ts`
- Create: `src/features/faqs/FaqBrowser.tsx`
- Create: `src/features/faqs/components/TopicFilter.tsx`
- Create: `src/features/faqs/styles/faq-browser.styled.ts`
- Modify: `src/features/faqs/FaqsPage.tsx`

**Interfaces:**
- Consumes: `SearchField`, `EmptyState`, `FaqList`, `closingCta`/`getSection`, `SecondaryButton`.
- Produces: `TopicFilter({ options, value, onChange })` with `options: { value: string; label: string; count: number }[]`; `FaqBrowser()` with internal `query`/`category` state.
- Produces: `FaqList` gains an optional `animate?: boolean` (default `true`) so filtering can suppress the entrance animation.

- [ ] **Step 1: Make the accordion open state id-based and animation optional**

In `FaqList`, replace `openIndex` with `openId: string | null`. Compare `openId === faq.id` and toggle `setOpenId(open ? null : faq.id)`. Keep the existing aria ids and panel behavior. Add `animate = true` to the props; when false, omit `data-revealed` from the list so items render in their final state while filtering. This prevents an open panel from jumping to another question and stops the stagger from replaying on every keystroke.

- [ ] **Step 2: Build `TopicFilter`**

Render `<nav aria-label="Filter questions by topic">` with a list of buttons: All plus each category, with counts. Each button is 44px, `aria-pressed`, and shows `label` plus a count pill. Mobile: a horizontally scrollable row with `overflow-x: auto`, snap, and hidden scrollbar; at `xl`: a vertical list with full-width rows. Active: teal surface with navy ink in light mode and the inverse in dark, matching the existing chip pattern. Inactive: transparent with a border on hover/focus.

- [ ] **Step 3: Build `FaqBrowser`**

Module-level derive `categories` from `faqs` preserving first appearance, then `topics = [{ value: 'All', label: 'All questions', count: faqs.length }, ...]`.
State: `query`, `category`. Filter by category, then by a lowercased query against question + answer.
Render:
- A `S.Workspace` grid: one column below `xl`, `18rem minmax(0, 1fr)` at `xl`.
- A `S.Rail`: a bordered white `S.Tools` card with `SearchField` and `TopicFilter`; sticky at `xl` with `top: 4rem`. Below `xl`, it sits above the questions.
- An `S.AskCard` inside the rail, hidden below `xl`, using `getSection('faqs','cta')` title/description and a `SecondaryButton` to `/contact` with `MessagesSquare`.
- The results column: a count line with `aria-live="polite"` (`8 of 18 questions` or `3 results for "refund"`), then either `FaqList` with `showCategories={category === 'All'}` and `animate={false}` or `EmptyState` with `SearchX`, "No questions match.", "Try a different word or clear the filters.", and a "Clear filters" secondary button with `RotateCcw` that resets both states.

- [ ] **Step 4: Wire the page**

`FaqsPage` keeps the hero and `ClosingCta`; replace the plain `FaqList` section content with `<FaqBrowser />` inside the existing `Section`. Keep the section id `questions`, title, and description.

- [ ] **Step 5: Verify**

`npm run typecheck`, `npm run lint`, `npm run check-grid`. In the browser: search "refund", then pick a category, then clear; the counts, list, and empty state update, the accordion still opens, and filtering does not replay the entrance animation. At 320 and 390 the chips scroll horizontally with no page overflow.

### Task 3: Build the legal document workspace

**Files:**
- Create: `src/features/legal/readingTime.ts`
- Create: `src/features/legal/components/LegalMeta.tsx`
- Create: `src/features/legal/components/LegalToc.tsx`
- Create: `src/features/legal/components/LegalSection.tsx`
- Modify: `src/features/legal/LegalPage.tsx`
- Modify: `src/features/legal/styles/legal.styled.ts`

**Interfaces:**
- Produces: `readingTime(document: LegalDocument): string` — `X min read`, 200 wpm, minimum 1.
- Produces: `LegalMeta({ document })` — reading time, section count, and a 44px Print button.
- Produces: `LegalToc({ sections, activeId })` — bordered sticky card with numbered links and `aria-current="location"`.
- Produces: `LegalSection({ section, index })` — numbered heading, anchor link, and the existing paragraph/list content.

- [ ] **Step 1: Reading time helper**

Count words in `title`, `intro`, every section title, every paragraph, and every item; divide by 200 and round up; return `${minutes} min read`.

- [ ] **Step 2: `LegalMeta`**

A flex row above the layout: `Clock` + reading time, `FileText` + `${sections.length} sections`, and a right-aligned 44px secondary button with `Printer` and "Print / Save PDF" that calls `window.print()`. Wrap at narrow widths; the button may go full width below `sm`. `data-print-hide`.

- [ ] **Step 3: `LegalToc`**

A white bordered card with 16px padding and radius `lg`; heading "On this page" with a `ListTree` icon at 16px. Ordered links with two-digit numbers, 44px minimum height, `aria-current={activeId === section.id ? 'location' : undefined}`. Active: accent text and a 2px inset left rule (use `box-shadow: inset 2px 0 0`). Sticky at `lg` with `top: 4rem`. `data-print-hide`.

- [ ] **Step 4: `LegalSection`**

Render a `<section>` with the existing scroll margin. A heading row with a small `01` number (tabular, accent, 14px), an `<h2>`, and a 44px anchor link (`Link2` 16px) with `aria-label={`Link to ${section.title}`}` and `href={`#${section.id}`}`. The anchor is muted at rest, accent on hover/focus, and hidden in print. Add a top hairline between sections except the first. Keep paragraphs/lists at the existing measure and line height.

- [ ] **Step 5: Restructure `LegalPage`**

Compute `sectionIds` with `useMemo`, call `useActiveSection`, and render: `LegalMeta`, a `Layout` with `LegalToc` and a `Body` of `LegalSection`s, then the document contact card and `ClosingCta`. Replace the plain "Questions? Contact us." paragraph with a bordered contact card: `MessagesSquare` tile, `document.cta.title`, `document.cta.description`, and a compact "Contact us" link/button with an icon. Add a print-only header inside the layout with the document title and "Last updated <date>".

- [ ] **Step 6: Style the workspace**

Keep the 14rem TOC column at `lg`; use 18rem for the FAQ rail only. The body keeps a readable measure (44rem / `readingMaxWidth`). The meta bar and contact card use `surface.default` and `border.default`. No shadows. Check both themes.

- [ ] **Step 7: Verify**

`npm run typecheck`, `npm run lint`, `npm run check-grid`. Scroll both legal pages: the TOC highlights the section at the top of the reading area; clicking a TOC item jumps and updates the active state; the anchor links are keyboard reachable; the meta shows a plausible reading time.

### Task 4: Add the print contract

**Files:**
- Modify: `src/styles/GlobalStyles.ts`
- Modify: `src/components/layout/TopBar.tsx`
- Modify: `src/components/navigation/DesktopSidebar.tsx`
- Modify: `src/components/navigation/MobileBottomNav.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/components/ui/PageHero.tsx`
- Modify: `src/components/ui/CtaBanner.tsx`
- Modify: `src/features/legal/styles/legal.styled.ts`

**Interfaces:**
- Produces: the `data-print-hide` contract, honored by one global `@media print` block.

- [ ] **Step 1: Mark the non-print chrome**

Add `data-print-hide` to the top bar header, desktop sidebar root, mobile bottom nav root, site footer root, `PageHero` root, and the `CtaBanner` wrapper (the outer `div`, so its margins disappear). The legal TOC and meta already carry it.

- [ ] **Step 2: Add the global print rules**

In `GlobalStyles`:

```css
@media print {
  html,
  body {
    background: #fff;
    color: #000;
  }

  [data-print-hide] {
    display: none !important;
  }

  #main-content > div {
    max-width: none;
    padding: 0;
  }
}
```

- [ ] **Step 3: Legal print styles**

In `legal.styled.ts`, under `@media print`: one-column layout; hide the TOC, meta, section anchor links, and numbers optional; body max-width none; headings black at 16–18pt; paragraphs 11pt; borders `#ccc`; show the print-only header. Ensure the contact card and the document body print, and the hero/CTA/footer do not.

- [ ] **Step 4: Verify**

In the browser's print preview for both legal pages in light and dark themes: one white document, a title/date header, numbered sections, no sidebar/top bar/hero/CTA/footer, no clipped content, and no blank first page. Cancel the dialog.

### Task 5: Full verification

**Files:** none modified.

- [ ] **Step 1: Run the project checks**

Run, in order: `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, `npm run build`. Expected: all pass.

- [ ] **Step 2: Width sweep**

At 320, 390, 768, 1024, and 1445, in light and dark: `/faqs`, `/privacy-policy`, `/terms-of-service`. Expected: no horizontal overflow; FAQ topics scroll on mobile; the legal meta wraps; the TOC is a card on desktop and stacks on mobile; all controls are at least 44px.

- [ ] **Step 3: Interaction checks**

FAQ: search, category, combined filter, clear, empty state, open/close, and the ask card link. Legal: TOC click, active state while scrolling, anchor links, print button opens the dialog. Keyboard: tab through search, topics, questions, TOC, anchors, and the print button with visible focus.

- [ ] **Step 4: Stop**

Do not commit. Report the checks, screenshots, and any copy caveat, then wait for approval.
