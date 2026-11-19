# Copy & UI Polish Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the owner's latest review batch: remove project-card summaries, refine the legal TOC active state, shorten page-hero descriptions to 5–6 words, flatten the bottom-nav active pill, keep the team role on one row, one-word categories, a reusable contact select, a glowing Growth CTA, five pricing FAQs, no More-sheet scrollbar, two-word action/nav labels, and two-word legal TOC labels.

**Architecture:** Copy changes stay in the JSON content layer (`pages.json`, `legal.json`, `team.json`, `projects.json`, `faqs.json`, `plans.json`) with only action labels in JSX. The legal TOC gets authored `tocLabel` values; the legal hero gets `heroDescription` while its full `intro` moves to a document lead. One new reusable `SelectField` replaces the two native contact selects. Styling changes are confined to the legal TOC, bottom nav, More sheet, project cards, pricing button, and team role.

**Tech Stack:** React 19, TypeScript 6, styled-components 6, lucide-react, Vite 8.

**Spec:** No separate spec. The approved interpretations are in Global Constraints.

## Global Constraints

- **2-word rule scope:** visible action buttons, CTA links, navigation links, footer links, legal TOC links, plan CTAs, print, and back-to-top. Exempt content controls: FAQ question accordion buttons, team/project/testimonial card content, legal section headings, form option labels, and icon-only controls.
- **Hero description rule:** 5–6 words on the static page heroes, the 404, both legal pages, and both team profiles. Home's profile bio is excluded.
- **Legal copy:** the short hero text is new `heroDescription`; the full `intro` remains document content as a lead paragraph.
- **Team card role:** use the existing `Role` fact ("Founder"/"Secretary") so it is one row; the full role stays on the profile.
- **Categories:** project categories `Management`, `Booking`, `Inventory`, `CRM`, `Dashboards`, `Websites`; FAQ categories `Services`, `Pricing`, `Process`, `Ownership`, `Support`, `Basics`. All one word.
- **Legal TOC:** filled teal active row with navy ink, no left border/inset bar. TOC labels are authored 2-word values; section headings stay full.
- **Project cards:** remove the summary paragraph from carousel, grid, and row cards; keep the summary in the project details dialog.
- **Contact selects:** one reusable `SelectField` with the native `<select>` preserved, custom chevron, leading icon, 44px height, focus ring.
- **Pricing:** the Growth CTA gets a glow animation matching the featured card; the pricing FAQ list is capped at five. Reduced motion shows the static state.
- **More sheet:** hide the scrollbar; keep touch scrolling and drag-to-close.
- **Bottom nav:** remove the active icon-pill background and inset border; only the active icon and label color/weight change.
- No new dependencies, no new colors, no inline styles, no commits.

## Exact copy

### Hero descriptions (5–6 words)
| Page | New description | Words |
|---|---|---|
| About | Systems built for how you work. | 6 |
| Projects | Six concept systems for real businesses. | 6 |
| Testimonials | Feedback shared only with permission. | 5 |
| FAQs | Answers on process, pricing, and support. | 6 |
| Pricing | Starting prices for websites and systems. | 6 |
| Contact | Tell us what you need. | 5 |
| Privacy | How we handle your information. | 5 |
| Terms | The rules for using this site. | 6 |
| 404 | This link is broken or moved. | 6 |
| Orlando (team) | Founder and custom software engineer. | 5 |
| Darcy (team) | Secretary keeping projects on track. | 5 |

### Action and navigation labels
| Current | New |
|---|---|
| Start a project / Start a Project | Get started |
| Explore our services / Explore Our Services | Our services |
| Start a conversation | Let's talk |
| See concept projects | View projects |
| Ask us directly | Contact us |
| Send an inquiry | Send inquiry |
| Back to home | Go home |
| Back to team | Team |
| Discuss Your Project | Discuss project |
| Request a Quote | Get quote |
| Tell us about your project | Contact us |
| View All FAQs | All FAQs |
| Send another inquiry | Send again |
| Back to top | Back up |
| Print / Save PDF | Print |
| Terms and Conditions (nav) | Terms |
| Get Started / See pricing / View pricing / Contact us / Clear / Read more / Visit / Details / Visit Website | keep (≤2) |

### Legal TOC labels
- Privacy: Your information, Automatic collection, Usage, Sharing, Retention, Your rights, Security, Changes.
- Terms: Website use, Site information, Agreements, Ownership, Links, Liability, Law, Changes.

## Review Focus

- Content controls must not be shortened: the FAQ questions, team/project/testimonial card text, and legal headings stay full. Only action/nav/CTA/TOC labels change.
- The legal intro must remain visible as the body lead; shortening the hero must not delete it.
- The reusable `SelectField` must keep `name`/value submission through FormData, native keyboard behavior, and long budget labels without overflow.
- The filled TOC active row must keep readable contrast in both themes and retain the focus ring; the bottom nav must keep the active color/weight after removing the pill.
- The 2-word audit must cover hardcoded JSX, `pages.json`/`legal.json` CTA actions, `plans.json`, nav config, footer, and pricing help; no >2-word action label may remain.

---

### Task 1: Normalize hero descriptions, categories, TOC labels, and action labels

**Files:**
- Modify: `data/database/pages.json` (headers, CTA actions)
- Modify: `data/database/legal.json` (`heroDescription`, `intro` stays, CTA actions, `tocLabel`)
- Modify: `data/database/team.json` (headlines)
- Modify: `data/database/projects.json` (categories)
- Modify: `data/database/faqs.json` (categories)
- Modify: `data/database/plans.json` (CTAs)
- Modify: `src/data/types.ts` (`heroDescription`, `tocLabel`)
- Modify: `src/components/navigation/navigation.ts` (`terms` label)
- Modify: `src/features/team/components/TeamStrip.tsx` (Role fact)
- Modify: hero/action JSX: `ProjectsPage.tsx`, `PricingHero.tsx`, `TestimonialsHero.tsx`, `AboutUsPage.tsx`, `FaqsPage.tsx`, `ContactPage.tsx`, `LegalPage.tsx`, `TeamHero.tsx`, `PricingPage.tsx`, `Pricing.tsx`, `Faq.tsx`, `ContactForm.tsx`, `SiteFooter.tsx`, `LegalMeta.tsx`, and any other visible action label found by the audit.

**Interfaces:**
- `LegalDocumentRecord`/`LegalDocument` gain `heroDescription: string`; `LegalSection` gains `tocLabel: string` (required, authored).
- `PageHeaderRecord` description values change only.
- `TeamMemberRecord.headline` changes only; the summary stays.

- [ ] **Step 1: Apply the hero copy table**

Set the exact descriptions above on the `pages.json` page headers, both `legal.json` `heroDescription` fields, the `not-found` header, and the two `team.json` headlines. Leave the SEO descriptions (`seo.json`) and team `summary` untouched.

- [ ] **Step 2: Move the legal intro into the body**

Add `heroDescription` to the legal type and both documents. In `LegalPage`, use `document.heroDescription` for the hero and render `document.intro` as a lead paragraph before the sections (new `S.Lead` styled block in `legal.styled.ts`, secondary text, 44rem measure, bottom margin `xl`). The lead prints with the body.

- [ ] **Step 3: Add the TOC labels**

Add `tocLabel` to every legal section in `legal.json` and the `LegalSection` type; use the table above. The section headings remain unchanged; `LegalToc` renders `section.tocLabel`.

- [ ] **Step 4: Change the category values**

Replace the project and FAQ category strings in the JSON with the one-word mappings. Keep record order, `pricingPage` flags, and all other fields. Confirm the filter order still follows first appearance.

- [ ] **Step 5: Use the Role fact on team cards**

In `TeamStrip`, derive `const cardRole = member.facts.find((fact) => fact.label === 'Role')?.value ?? member.role` and render `cardRole` in `MemberRole`. This shows “Founder”/“Secretary” on one row; the full role stays on the profile page.

- [ ] **Step 6: Change nav and action labels**

Apply the action/nav table everywhere a visible label exists: navigation config, hero actions, CTA JSON actions, plan CTAs, pricing help, Home FAQ aside, contact success, footer back-to-top, legal print, and the legal CTA actions. Keep aria labels descriptive (they are not visible button text). Search for the old strings after the edits; the only allowed occurrences are content, not buttons.

- [ ] **Step 7: Verify the data**

Run a node check that all page headers, legal `heroDescription`, and team `headline` are 5–6 words; all project/FAQ categories are one word; all `tocLabel`s are ≤2 words; all `pages.json`/`legal.json` CTA action labels and `plans.json` CTAs are ≤2 words. Run `npm run typecheck`.

### Task 2: Remove project-card summaries

**Files:**
- Modify: `src/features/projects/components/ProjectCard.tsx`
- Modify: `src/features/home/sections/styles/projects.styled.ts`

**Interfaces:** no API change; the details dialog keeps `project.summary`.

- [ ] **Step 1: Remove the three summary nodes**

Delete `<S.GridSummary>`, `<S.RowSummary>`, and `<S.Summary>` from the grid, row, and carousel layouts. Leave the title, category, concept tag, and actions.

- [ ] **Step 2: Clean and check spacing**

Remove the now-unused styled summary exports if nothing else imports them. Check the grid body, row content, and carousel overlay spacing after removal; adjust only the local gap/margin if the title/actions look detached. Do not change the dialog.

- [ ] **Step 3: Verify**

Run `typecheck` and `lint`. In the browser, Home and `/projects` cards have no summary in all three layouts; opening Details still shows it.

### Task 3: Legal TOC active state and lead

**Files:**
- Modify: `src/features/legal/styles/legal.styled.ts`
- Modify: `src/features/legal/components/LegalToc.tsx`
- Modify: `src/features/legal/LegalPage.tsx` (lead)

- [ ] **Step 1: Replace the active state**

In `TocLink`, remove the inset left `box-shadow` and the active subtle background/`aria` styling. Active becomes a filled `brand.primary` row with `brand.navy` text/number and bold weight, radius `sm`, no border. Inactive stays transparent with the existing hover tint. Keep `aria-current="location"` and the focus outline. The number uses the same ink at reduced opacity.

- [ ] **Step 2: Use the short labels**

Render `section.tocLabel` in the TOC while the section heading uses `section.title`. Ensure the TOC list still has 8 items for each document.

- [ ] **Step 3: Add the legal lead**

Render `document.intro` in the new `S.Lead` at the top of the body, before the first section, at the document measure. In print, keep it black at 11pt.

- [ ] **Step 4: Verify**

Privacy and Terms show the teal filled active row, no left border; selecting section 04 updates the row and `aria-current`; the full intro appears below the meta and above section 01; both themes remain readable.

### Task 4: Bottom navigation and More sheet

**Files:**
- Modify: `src/components/navigation/styles/mobile-bottom-nav.styled.ts`
- Modify: `src/components/navigation/styles/mobile-more-menu.styled.ts`

- [ ] **Step 1: Remove the active pill**

Delete the `&[aria-current='page'] ${IconPill}` background/inset-box-shadow rule. Keep `nav.mobileItemActiveStyles` (accent color and bold) so the active icon and label are the only cues. Leave the central Contact action's own circle intact; it is a primary action, not an active pill.

- [ ] **Step 2: Hide the More scrollbar**

On `Inner`, add `scrollbar-width: none` and a `::-webkit-scrollbar { display: none; }` rule. Keep `overflow-y: auto`, `overscroll-behavior: contain`, and the drag behavior.

- [ ] **Step 3: Verify**

At 390, the Home bottom-nav active item has no background pill; the icon and label are accent/bold. Open More at 390, drag down, and confirm no scrollbar appears while Escape/backdrop/drag close still work.

### Task 5: Reusable contact SelectField

**Files:**
- Create: `src/components/ui/SelectField.tsx`
- Create: `src/components/ui/styles/select-field.styled.ts`
- Modify: `src/features/contact/ContactForm.tsx`
- Modify: `src/features/contact/styles/contact.styled.ts`

**Interfaces:**
- Produces: `SelectField({ id, name, label, optional, icon, options, defaultValue })` with `options: { value, label }[]`; renders a native `<select>`.
- Consumes the existing service and budget option lists in `ContactForm`.

- [ ] **Step 1: Build the field**

Render a visible label with an optional marker, a 44px control containing the leading icon, a native select with `appearance: none` and `padding-right: 2.75rem`, and an absolutely positioned `ChevronDown` at 18px with `pointer-events: none`. Use `border.default` at rest, `border.focus` + 2px outline on focus, `surface.default`, and a hover accent border. The select keeps its `name` and `defaultValue`, so `FormData` is unchanged.

- [ ] **Step 2: Replace both contact selects**

Use the component for Project type (`Layers`, name `service`) and Budget range (`Wallet`, name `plan`), with the existing "Not sure yet" placeholder option. Remove the old `S.Select` and the two manual `S.Field`/`S.Control` select blocks; keep the input/textarea controls. Ensure long budget labels don't force horizontal overflow at 320.

- [ ] **Step 3: Verify**

Submit the contact form with both selects changed and confirm the saved inquiry reflects the picked values. Keyboard through the fields; the native list opens; focus ring is visible; the form still fits.

### Task 6: Pricing glow and FAQ cap

**Files:**
- Modify: `src/features/home/sections/styles/pricing.styled.ts`
- Modify: `src/features/pricing/PricingPage.tsx`

- [ ] **Step 1: Animate the Growth CTA**

Add a `buttonGlow` keyframe next to the existing pricing keyframes. Apply it only to `FeaturedButton` under `prefers-reduced-motion: no-preference`, pulsing the teal ring/glow around the existing static shadow. Keep the button's color, label, and hover behavior. Under reduced motion, leave the current static ring.

- [ ] **Step 2: Cap the pricing FAQs**

Change `pricingFaqs` to `faqs.filter((faq) => faq.pricingPage).slice(0, 5)`. Keep the section copy and the five first questions in data order.

- [ ] **Step 3: Verify**

The Growth card's button glows; the Starter/Custom buttons do not. Reduced motion stops the glow. The pricing FAQ section renders exactly five questions and no count mismatch.

### Task 7: Full verification

**Files:** none modified.

- [ ] **Step 1: Project checks**

Run `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, `npm run build`. Expected: all pass.

- [ ] **Step 2: Copy audit**

Grep every visible action label in JSX and JSON for 3+ words. Expected: none outside the exempt content controls (FAQ questions, card text, legal headings). Confirm the hero descriptions are 5–6 words, categories one word, and legal TOC labels ≤2.

- [ ] **Step 3: Browser sweep**

At 320, 390, 768, and 1445 in light and dark: Home, Projects, Pricing, Testimonials, About, FAQs, Contact, Privacy, Terms, both team profiles, 404, and the mobile More sheet. Check:
- no project-card summary, dialog keeps it;
- team role one row at every width;
- legal TOC filled active row, no left border, short labels, lead intro;
- bottom nav no active pill; More no scrollbar;
- new selects on Contact;
- Growth button glow; five pricing FAQs;
- every page hero description 5–6 words;
- every action/nav label ≤2 words.

- [ ] **Step 4: Interaction checks**

Submit the contact form with both selects; open/close a legal TOC link and scroll; open the More sheet and drag; keyboard through the new select and nav; reduced motion for the glow.

- [ ] **Step 5: Stop**

Do not commit. Report the checks, screenshots, and any copy caveat, then wait for approval.
