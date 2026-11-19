# Sea Mist Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the near-white light-theme page with a visible mint canvas (`#F1F7F4`) so white cards, the navy hero, and teal actions become distinct layers, without changing the dark theme or the section structure.

**Architecture:** Four light-theme tokens change in `src/styles/theme.ts`; every surface already reads them, so the page, admin, skeleton shimmers, and theme overlay update together. The pre-hydration background and `theme-color` in `index.html` are synced to the new page color to prevent a white flash. The Testimonials page drops its extra flat teal wash because the canvas itself now supplies the mint base.

**Tech Stack:** React 19, TypeScript 6, styled-components 6, Vite 8, CSS custom-color tokens.

**Spec:** No separate spec file. The approved decisions are the values in Global Constraints.

## Global Constraints

- Light theme only. Do not change any `darkColors` value, including `#061722`, `#0B2130`, `#0E2938`, or `#1B3A4A`.
- Exact light values: `background.default` `#F1F7F4`, `background.subtle` `#E8F1EE`, `surface.subtle` `#E8F1EE`, `border.default` `#DDE8E4`. `surface.default` stays `#FFFFFF`; `brand`, `text`, `problem`, `solution`, `danger`, and `status` tokens stay unchanged.
- One canvas: sections stay transparent. Do not add per-section backgrounds, white panels, or alternating bands.
- Sync `index.html` in the same change: the pre-hydration `html` background and the light `theme-color` meta must both be `#F1F7F4`.
- No new dependencies, tokens, colors, radii, spacing, or components. No hardcoded hexes outside `theme.ts` and `index.html`.
- Keep the current `section` rhythm, card borders, and border-only static cards. Do not add shadows or card fills.
- Do not commit, stage, or discard anything without explicit approval.
- Text contrast was pre-checked: primary 14.99:1, secondary 5.51:1, accent 5.93:1 on the page; the lowest on the subtle tint is 5.20:1. Any new text color would invalidate that, so don't add one.

## Review Focus

- A hard reload in light theme must not flash white before React mounts; the pre-hydration background is the only thing painted then.
- The browser/theme-color chrome must stay `#F1F7F4` in light theme after toggling dark → light; the pre-hydration script only overrides the meta for dark.
- The Testimonials page must not stack its old flat 5% teal wash on top of the new tint and read as a different, greener site.
- The white shell (sidebar, Top Bar, mobile bottom nav, cards) must still separate cleanly from the tinted content at both breakpoints; no invisible boundaries.
- Admin sticky toolbars and skeleton shimmers use `background.default` at 92–94% opacity; on a tinted base they must still read as surfaces, not as smudges.

---

### Task 1: Update the light tokens and the pre-hydration sync

**Files:**
- Modify: `src/styles/theme.ts:61-78`
- Modify: `index.html:11` and `index.html:37`

**Interfaces:**
- Consumes: existing `AppTheme` shape; no type change.
- Produces: `lightColors.background.default = '#F1F7F4'`, `lightColors.background.subtle = '#E8F1EE'`, `lightColors.surface.subtle = '#E8F1EE'`, `lightColors.border.default = '#DDE8E4'`, consumed automatically by every styled component and by `index.html`'s mirrored values.

- [ ] **Step 1: Change the four light tokens**

In `src/styles/theme.ts`, inside `lightColors`, set:

```ts
background: {
  default: '#F1F7F4',
  subtle: '#E8F1EE',
  inverse: '#00243E',
},
surface: {
  default: '#FFFFFF',
  subtle: '#E8F1EE',
},
```

and change `border.default` to `'#DDE8E4'`. Leave every other light token and the whole `darkColors` object untouched.

- [ ] **Step 2: Mirror the page color in `index.html`**

Change the light meta from `<meta name="theme-color" content="#FAFCFB" />` to `#F1F7F4`, and the pre-hydration rule from `background: #fafcfb;` to `background: #f1f7f4;`. Leave the dark override `#061722` and the dark `theme-color` script value as they are.

- [ ] **Step 3: Verify no old light values remain**

Run: `Select-String -Path src/styles/theme.ts,index.html -Pattern "#FAFCFB|#fafcfb|#F4F8F7|#f4f8f7|#E2E9E7|#e2e9e7"`

Expected: no output. Then run `npm run typecheck`; expected: pass.

- [ ] **Step 4: Confirm the canvas in the running app**

With the dev server running, load `/` in light theme and evaluate `getComputedStyle(document.body).backgroundColor`; expected `rgb(241, 247, 244)`. Confirm the sidebar and cards are still `rgb(255, 255, 255)`.

### Task 2: Remove the compounded Testimonials wash

**Files:**
- Modify: `src/features/testimonials/styles/testimonials-page.styled.ts:34-38`

**Interfaces:**
- Consumes: the new `background.default` from Task 1; `brand.primary` is unchanged.
- Produces: the Testimonials `::before` base is the page color itself, with only the two existing radial gradients above it.

- [ ] **Step 1: Drop the flat 5% mix**

Replace:

```ts
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.brand.primary} 5%,
        ${({ theme }) => theme.colors.background.default}
      );
```

with:

```ts
      ${({ theme }) => theme.colors.background.default};
```

Keep both radial gradients (16% and 7%) and the `inset`/`z-index` rules exactly as they are.

- [ ] **Step 2: Verify the page still has its wash**

Load `/testimonials` in light theme and confirm the top-right mint gradient is still visible while the base matches `/` when the gradient is out of view. Run `npm run typecheck`; expected: pass.

### Task 3: Full visual and project verification

**Files:** none modified.

- [ ] **Step 1: Run the project checks**

Run, in order: `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, `npm run build`.

Expected: all pass. No grid or type changes are expected because only color values move.

- [ ] **Step 2: Verify light mode across the site**

At 1445 and 390, in light theme only, check `/`, `/projects`, `/pricing`, `/testimonials`, `/contact`, `/about-us`, `/faqs`, `/privacy-policy`, `/terms-of-service`, both `/team/:slug` pages, `/admin`, and `/page-not-found`.

Expected:
- Page canvas is visibly mint; cards, sidebar, and Top Bar are white and separate.
- No horizontal overflow at 320.
- Testimonials is mint-washed by the gradients, not by a second flat tint.
- Form controls, tags, and status text remain legible; no text pair looks lower-contrast than before.
- Admin tables, sticky toolbars, skeleton states, and empty states still read as surfaces.

- [ ] **Step 3: Verify the flash and chrome color**

Hard-reload `/` in light theme with the network throttled; expected: no white frame before the tinted canvas. In devtools, `document.querySelector('meta[name="theme-color"]').content` must read `#F1F7F4` in light theme. Toggle dark → light and re-check; expected: the light value returns.

- [ ] **Step 4: Verify dark mode is unchanged**

Load `/` and `/testimonials` in dark theme; expected: identical to before this change (`#061722` page, `#0B2130` surfaces). If anything differs, a dark token was touched by mistake.

- [ ] **Step 5: Stop**

Do not commit. Report the measured colors, the checks, and any visual caveat, then wait for approval.
