# Home & Contact Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clear the six owner comments from the browser review: remove the More sheet label, widen the contact form to the page gutters, flatten the contact section wash, upgrade the two Home team cards with a distinct founder edge, and pin the avatar presence dot to the ring with a ping animation.

**Architecture:** Each comment maps to one surface and its own style file. The Home card and dot changes are confined to `team-strip` and `hero` styles (plus one arrow icon in `TeamStrip`). The contact changes are three CSS rules in `contact.styled.ts`. The More sheet loses its kicker element and its unused style export. No data, copy, route, or token changes.

**Tech Stack:** React 19, TypeScript 6, styled-components 6, lucide-react, Vite 8.

**Spec:** No separate spec file. The owner's answers are captured in Global Constraints.

## Global Constraints

- Keep all names, roles, links, and copy. No data or JSON changes.
- Team cards stay two columns at `md` and stack below it. The founder is still detected by `member.role.toLowerCase().includes('founder')`.
- Keep the existing card hover contract: 2px lift, accent border, `shadows.md`, avatar `scale(1.04)`, name accent, 200ms, reduced motion without transform/shadow.
- Founder highlight is "accent edge only": a 3px inset teal left edge plus a stronger mint tint. No badge and no label.
- Larger portraits are exactly `6rem` (96px) at base and `7rem` (112px) at `md`; the cluster max width grows from `48rem` to `56rem`.
- Every new animation respects `prefers-reduced-motion`. The presence ping is an owner-approved ambient loop, the only new one besides the testimonial marquee.
- Contact form keeps its current field order and the centered 2-column rows it already has at `md`. Only the 40rem cap is removed.
- The contact `Layout` gradient is removed entirely; no replacement background.
- The More sheet keeps `aria-label="More menu"` and the `More navigation` nav label. Only the visible kicker goes.
- Icons: 18px for the card arrow. No new dependencies, tokens, hardcoded colors, or inline styles.
- Do not commit, stage, or discard anything without explicit approval.

## Review Focus

- At 320px the larger portrait plus the new arrow must not squeeze "Founder and Software Engineer" into an unreadable column or overflow the card.
- The founder's inset edge must survive hover, focus, and reduced motion; the shared hover `box-shadow` must not erase it.
- The presence dot must stay centered on the avatar ring at 120px, 144px, and every size between; it must not be clipped by the button.
- With the form card at full width, every input, select, textarea, and date control must still fit at 320, 768, and 1445, with unchanged tab order and error placement.
- After removing the contact wash, the section must not show a seam against the page; after removing the More kicker, the sheet must keep comfortable spacing below the brand header.

---

### Task 1: Refine the Home team cards

**Files:**
- Modify: `src/features/team/components/TeamStrip.tsx`
- Modify: `src/features/team/styles/team-strip.styled.ts:43-226`

**Interfaces:**
- Consumes: `member` and the existing `isFounder` branch.
- Produces: `S.CornerArrow` rendered once per card; no prop or data change.

- [ ] **Step 1: Add the corner arrow**

In `TeamStrip.tsx`, add `ArrowUpRight` to the `lucide-react` import and render the arrow after `<S.MemberInfo>` inside each `MemberLink`:

```tsx
<S.CornerArrow aria-hidden="true">
  <ArrowUpRight size={18} strokeWidth={2} />
</S.CornerArrow>
```

- [ ] **Step 2: Widen the cluster and grow the portrait**

In `team-strip.styled.ts`, set `AvatarCluster` `max-width: 56rem`. In `AvatarFrame`, set the base size to `6rem` and the `md` size to `7rem`, and raise the initials `font-size` to `2xl`.

- [ ] **Step 3: Strengthen the card rhythm and type**

In `AvatarLink`, keep the existing layout but change the padding to `theme.spacing.md` on all sides, keep `gap: theme.spacing.md`, and at `md` use `padding: theme.spacing.lg` and `gap: theme.spacing.lg`. In `MemberName`, change the `md` size from `lg` to `xl`. Leave `MemberRole` at `sm`.

- [ ] **Step 4: Style the arrow**

Add:

```ts
export const CornerArrow = styled.span`
  flex: none;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition:
    color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.base};

  a:hover &,
  a:focus-visible & {
    color: ${({ theme }) => theme.colors.text.accent};
    transform: translate(2px, -2px);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color ${({ theme }) => theme.transitions.fast};

    a:hover &,
    a:focus-visible & {
      transform: none;
    }
  }
`
```

- [ ] **Step 5: Replace the founder treatment**

In `FounderLink`, remove the `& > span:first-child` avatar-ring block, raise the base tint from 6% to 8% and the hover tint from 10% to 12%, and add the edge:

```ts
  box-shadow: inset 3px 0 0 ${({ theme }) => theme.colors.text.accent};

  &:hover,
  &:focus-visible {
    box-shadow:
      inset 3px 0 0 ${({ theme }) => theme.colors.text.accent},
      ${({ theme }) => theme.shadows.md};
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover,
    &:focus-visible {
      box-shadow: inset 3px 0 0 ${({ theme }) => theme.colors.text.accent};
    }
  }
```

Keep the existing accent border-color rule and the shared 2px lift.

- [ ] **Step 6: Verify**

Run `npm run typecheck`, `npm run lint`, and `node scripts/check-grid.mjs`. Then load `/` at 1445 and 390: both cards show the larger portrait and arrow, the founder has a visible left edge and stronger tint, hover still lifts 2px and rings the avatar, and nothing overflows at 320.

### Task 2: Pin the online dot and animate it

**Files:**
- Modify: `src/features/home/sections/styles/hero.styled.ts:1-18` and `:95-114`

**Interfaces:**
- Consumes: the existing `OnlineDot` and `OnlinePulse` spans inside `AvatarButton`.
- Produces: no markup change.

- [ ] **Step 1: Add the ping keyframes**

Next to `likePop`, add:

```ts
// Owner-approved presence loop: one expanding halo per cycle.
const presencePing = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.45;
  }
  70%,
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`
```

- [ ] **Step 2: Move the dot onto the ring**

Replace the `right`/`bottom` offsets in `OnlineDot` with:

```ts
  top: 85.36%;
  left: 85.36%;
  transform: translate(-50%, -50%);
```

Keep the 1.25rem size, 3px surface border, radius, green, and `pointer-events: none`.

- [ ] **Step 3: Animate the halo**

Set `transform-origin: center` on `OnlinePulse`, keep `inset: 0` and the green, and add:

```ts
  animation: ${presencePing} 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
```

Add a reduced-motion block to `OnlinePulse`:

```ts
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.35;
  }
```

- [ ] **Step 4: Verify**

Run `npm run typecheck` and `npm run lint`. At 390 and 1445, measure the dot's center against the avatar's center: the distance must equal half the avatar's width at both sizes. Confirm the ring expands and fades without clipping, and that emulating reduced motion stops it.

### Task 3: Flatten and widen the contact section

**Files:**
- Modify: `src/features/contact/styles/contact.styled.ts:149-180`

**Interfaces:**
- Consumes: the existing `Layout` and `FormColumn` wrappers.
- Produces: no markup or id change; `#inquiry-form` stays on `FormColumn`.

- [ ] **Step 1: Remove the section wash**

In `Layout`, delete the whole `background:` declaration (both radial gradients) and update the comment to describe only the 40px rhythm. Keep `display: grid`, `gap: 2.5rem`, and `padding-block: 2.5rem`.

- [ ] **Step 2: Let the form fill the grid**

In `FormColumn`, keep `width: 100%` and `min-width: 0`, and remove `max-width` and `margin-inline: auto`.

- [ ] **Step 3: Verify**

Run `npm run typecheck`, `npm run lint`, and `node scripts/check-grid.mjs`. At 1445, the form card's left and right edges must line up with the hero content and the aside below. At 390, the card keeps its gutters and does not overflow. Submit an invalid form to confirm error placement still lines up under each field.

### Task 4: Remove the More sheet kicker

**Files:**
- Modify: `src/components/navigation/MobileMoreMenu.tsx:9` and `:201-204`
- Modify: `src/components/navigation/styles/mobile-more-menu.styled.ts:112-125`

**Interfaces:**
- Consumes: the existing dialog `aria-label` and nav landmark.
- Produces: no replacement element.

- [ ] **Step 1: Remove the markup**

Delete the `<S.TitleKicker>` block and the now-unused `MenuIcon` import from `lucide-react`.

- [ ] **Step 2: Remove the style**

Delete the `TitleKicker` styled export and its comment. Confirm with a search that nothing else imports it.

- [ ] **Step 3: Verify**

Open the mobile More sheet at 390 by tapping the menu button. The sheet starts with the brand mark and then the nav items, with the existing spacing; no "More" text remains; Escape, backdrop, drag, and focus return still work.

### Task 5: Full verification

**Files:** none modified.

- [ ] **Step 1: Run the project checks**

Run, in order: `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, `npm run build`. Expected: all pass.

- [ ] **Step 2: Width and theme sweep**

At 320, 390, 768, and 1445, in light and dark: load `/`, `/contact`, and the mobile More sheet. Expected: no horizontal overflow; the team card text wraps cleanly; the dot stays on the ring; the form aligns with the page gutters; the founder edge is visible in both themes; the contact section has no gradient seam where it meets the page.

- [ ] **Step 3: Interaction checks**

Hover and keyboard-focus both team cards; the founder's inset edge must remain, the shared lift must still apply, and reduced motion must remove transform/shadow but keep the edge. Open and close the More sheet with Escape, backdrop click, and drag. Submit the contact form empty, then with valid values, and confirm the success copy still says the inquiry is saved in this browser and no message was sent.

- [ ] **Step 4: Stop**

Do not commit. Report the checks, screenshots, and any visual caveat, then wait for approval.
