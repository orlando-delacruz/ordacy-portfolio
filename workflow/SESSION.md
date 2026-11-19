# Session Context

## Last Updated
2026-11-19T07:47:11+08:00

## Project Overview
Ordacy portfolio / lead-gen SPA plus admin CMS frontend. React 19 + Vite 8 + React Router 7 + TypeScript 6 + styled-components 6, npm only; no backend, env vars, tests, or CI config. Content and records live in `data/database/*.json`, read publicly through `@/data` (browser-local overlay shared with the admin via `src/data/storage.ts`), written by admin only through `src/services`. Conventions in `AGENTS.md` (wins on conflict). All pages built; Home lives under `src/features/home/`; `/admin/*` has its own shell. `AGENTS.md` and `CLAUDE.md` are significantly stale after this session.

## Current Objective
Latest completed: the FAQ help-center workspace, the legal document workspace plus print contract, and the site-wide CTA/footer/data unification. Earlier in this session: approved team portraits, the sea-mist light canvas, and the Home/Contact polish pass. All are verified in the browser; nothing is in progress. Everything remains uncommitted on `develop`.

## Requirements and Constraints
- Content and records stay in `data/database/*.json`; page copy is never hardcoded in JSX. Admin reads/writes only through `src/services`. Never invent clients, quotes, results, ratings, integrations, prices, or persistence claims.
- No backend, no new dependencies, no commits/staging/reset/branch operations. Only `workflow/SESSION.md` may be written by `/save`.
- Owner-approved hero rule: all non-home pages use `PageHero` with page-specific image/actions; Home keeps its profile hero. Keep `PageHero` and `SectionHead`; `PageHeader` was removed and `page.styled.ts` stays for the 404.
- Owner-approved heading rule: top-level section headings use `SectionHead` (title + optional description, no eyebrow/rule). Keep the documented exceptions (card/panel/form/dialog headings, legal body headings, CTA-banner labels, hero badges, "People behind Ordacy").
- CTA rule (new): every public page ends with the one `ClosingCta` design — eyebrow "Let's work together", title, description, exactly two data-driven actions, navy primary with trailing arrow and transparent secondary. No gradient/compact/stacked/inverse/mobile variants.
- Footer rule (new): every public page shows the single `SiteFooter`; `/admin` has no marketing footer.
- CTA data (new): page sections carry optional `actions: { label, to, icon }[]` in `pages.json`; legal documents carry `cta` in `legal.json`. Icons resolve through `src/data/icons.ts`; `Compass` and `House` were added.
- Sea mist light tokens: `background.default #F1F7F4`, `background.subtle`/`surface.subtle #E8F1EE`, `border.default #DDE8E4`, cards `#FFFFFF`; dark tokens unchanged. `index.html` pre-hydration background and `theme-color` must stay in sync.
- Team portraits: approved real photos; 1024×1024 JPEG q85; light/white `avatar.src`, dark `avatar.darkSrc`; OG uses `src`; alt "Orlando Dela Cruz, Founder and Software Engineer" / "Darcy Tabafunda, Secretary"; storage prefix stays `ordacy-cms:v2:` with optional `darkSrc` fallback.
- Team cards: 96/112px portraits, 56rem cluster, 8px right inset on the question row; 2px teal avatar ring on both; founder tint only (no badge, no left edge — the edge was explicitly removed); 16px vertical / 24px horizontal padding at `md`; keep hover lift 2px, avatar 1.04, name accent, 200ms, reduced motion.
- Online dot: center on the avatar ring at any size (`top/left 85.36%`, translate −50%); 2.4s ping halo; static under reduced motion.
- Contact: full-width form card aligned with the aside, no section gradient, `id="inquiry-form"` and hash CTA; More sheet kicker removed.
- FAQ workspace: instant search, topic filters with counts, live result count, empty state, ask card at `xl`; `FaqList` opens by id and suppresses its entrance animation while filtering.
- Legal workspace: meta bar (reading time, section count, 44px Print), sticky active TOC, numbered anchor sections, document contact card, print-only title/date header.
- Print contract: `data-print-hide` on shell, hero, CTA, and footer; `@media print` hides them, resets the content offset, and the legal document prints white at 44rem.
- 4/8 grid; controls 44px public / 40px admin; every button/link/toggle/tab has an icon; icon sizes 16/18/20/24/28/32.
- Samples: `isSample: true` shows a "Sample" badge, `rating: null`, can never be approved/published; public filters hide them.
- No "Demo mode" wording; never claim auth, database, email, or uploads are connected. `/admin` stays noindex with `Disallow: /admin`.
- Every page calls `usePageMeta`; every public page calls `useScrollReveal` (the 404 was missing it and is now fixed). Preserve the scroll contract (`usePageScrollRestoration`), global `scroll-margin-top`, and reduced motion.
- Prior decisions still apply: Contact order/honest form, About mobile composition (audience 2×2, process breakpoints, carousel dots, mobile CTA replaced by ClosingCta), Pricing rules, project-card rules, Testimonials on the Projects artwork with a mint gradient, legal pages on the marketing hero, light-start theme, `radii.sm` 8px.

## Decisions Made
- From owner comments this session: use the Home closing CTA on **all** public pages with full match (eyebrow + two actions); add the footer to all public pages and exclude admin; use the FAQ split workspace; use the legal document workspace; add Print/Save PDF with print styles.
- CTA/copy is centralized: Home, Projects, Pricing, Testimonials, About, FAQs, Contact, team profiles, 404 in `pages.json`; privacy/terms in `legal.json`. Pricing got distinct copy ("Start from a clear price.") to remove the duplicate with Testimonials.
- The CTA primary/secondary labels move to JSON; the Contact primary is `#inquiry-form` and renders `PrimaryAnchor`.
- `ClosingCta` + `closingCta()` are the only closing-CTA renderer; `CtaBanner` is now the single default design. `InverseButton`, `MobileCta`, `CtaWrap`, and the `gradient`/`compact`/`stacked` props were removed.
- `SiteFooter` moved from Home to `src/components/layout/`; footer group titles live in `navigation.ts` (`footerGroups`).
- FAQ: `FaqList` open state is id-based; `animate={false}` suppresses the reveal during filtering. Categories derive from the data order.
- Legal: `useActiveSection` drives the TOC; `readingTime` uses 200 wpm; section anchors are 44px links with `aria-label`; the inline contact card reuses `document.cta`.
- Print: hide the shell with `data-print-hide`; reset the Content sidebar offset; center the legal body at 44rem; show the print-only header.
- Sea mist: light-only token change; Testimonials flat 5% wash removed (radials remain); `index.html` synced.
- Team: portraits are real and approved; the founder's left edge was removed per the latest comment; the avatar ring is teal on both; the card vertical padding was reduced to fix the "too fat" comment.
- The 404 reveal bug was fixed by adding `useScrollReveal`; the CtaBanner wrapper is `data-reveal`.
- The shared `empty-state.styled.ts` remains for Projects; the new public `EmptyState` uses `no-results.styled.ts` (the style file was accidentally overwritten and restored to HEAD; no content diff).
- Prior owner-approved decisions (PageHero/SectionHead unification, hero mapping, About desktop/mobile, Contact, logos/avatars, team hover) remain in code.

## Completed Work
- Team portraits: four JPEGs in `public/images/team/` (69–81 KB); `team.json` paths/alt/darkSrc; `TeamAvatar.darkSrc`; `teamAvatarSrc`; theme-aware TeamStrip/TeamHero/lightbox; admin dark-photo field + validation; OG stays light. Verified both themes, sizes 60/72 dot geometry, fallback.
- Sea mist: `theme.ts` light tokens; `index.html` pre-hydration/meta; Testimonials wash reduced; verified all routes, contrast, dark unchanged, admin, 390/1445.
- Home/Contact polish: team cards 96/112 + arrow + founder edge (later removed) + tint; online dot center + ping; contact form full width and no wash; More kicker removed; verified hover, reduced motion, 320/390/1445.
- CTA/footer unification: data model (`PageCtaAction`, `actions`, `PageCta`/`ClosingCtaData`, legal `cta`), `closingCta()`, `mergePageSections` backfill, `ClosingCta`, simplified `CtaBanner`, all public pages wired, admin CTA action editor with validation, footer moved global + `footerGroups`, 404 reveal fix, team padding. Route sweep confirmed one CTA/footer per public route and none on `/admin`; Contact hash lands at 72px.
- FAQ workspace: `SearchField`, `EmptyState`, `TopicFilter`, `FaqBrowser`, `FaqList` id/animate changes; 18 questions, 6 topics, search/topic/empty/reset; verified "hosting" 1 result, open panel closes when filtered out, 320/768 no overflow.
- Legal workspace: `readingTime`, `LegalMeta`, `LegalToc`, `LegalSection`, contact card, print header; active TOC 01→04, `#sharing`, 8 anchors, 2 min read, 8 sections, print handler; print media verified white/centered/no chrome.
- Print contract: `data-print-hide` on TopBar, DesktopSidebar, MobileBottomNav, SiteFooter, PageHero, CtaBanner; GlobalStyles print rules; Content print margin reset; legal print styles.
- Verification: typecheck, lint, `node scripts/check-grid.mjs`, build (6,800 modules) all pass. Browser screenshots in `C:\Users\SSD-ORLANDO\AppData\Local\Temp\opencode\` (`polish`, `cta-footer`, `faq-legal`, `sea-mist`).

## Current Implementation State
- `/`, `/projects`, `/pricing`, `/testimonials`, `/about-us`, `/faqs`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/team/:slug`, `/page-not-found` all render `ClosingCta` and the global footer; `/admin` has neither.
- CTA data lives in `pages.json` sections (`home.final-cta`, `projects.start`, `pricing.cta`, `testimonials.cta`, `about.work-with-us`, `faqs.cta`, `contact.cta`, `team.cta`, `not-found.cta`) and `legal.json` (`privacy.cta`, `terms.cta`). The page CTA titles are Home "Build Better Together.", Projects "Have something similar in mind?", Pricing "Start from a clear price.", Testimonials "Ready to talk about your project?", About/team "Work with us.", FAQs "Still have a question?", Contact "Send us the details.", 404 "Let's get you back on track.", legal "Questions about this policy/terms?".
- `RootLayout` renders `SiteFooter`; `HomePage` no longer does. Footer groups come from `navigation.ts`; the admin CTA editor is in `ContentAdminPage` with six fields and icon/link validation.
- FAQs is the split workspace in `src/features/faqs/` with sticky tools/ask card at `xl`; legal is the document workspace in `src/features/legal/` with active TOC/meta/print.
- `AGENTS.md`, `CLAUDE.md`, and `README.md` are stale for the new CTA/footer/FAQ/legal/data/print systems and several older details (`PageHeader`, radii, hero/heading rules).
- Dev server: `http://localhost:5173/`, listener PID 26252, npm shell `sh_1f0bbd4bd001gYah8S9Dt0oZpK`. It has repeatedly served stale transforms; restart before trusting a mismatch.

## Git Changes
- Repo: `C:/Users/SSD-ORLANDO/Documents/Project/ordacy-portfolio`, branch `develop`, HEAD `55c1070` ("enhance: homepage content ui design"). No commits this session.
- **Staged (pre-existing/external, not from this save):** 104 files, +8027/−2857. The index was written around 22:54 before this session's portrait/CTA/FAQ work; do not treat it as the session's work. It includes the prior PageHero/SectionHead redesign, About work, assets, `scripts/check-grid.mjs`, and the `final-cta.styled.ts → cta-banner.styled.ts` rename.
- **Unstaged (this session plus still-unstaged prior edits):** 48 files, +1060/−1077 (pre-snapshot write; writing this file changes the stat). Includes `pages.json`, `legal.json`, `team.json`, `index.html`, `theme.ts`, `GlobalStyles.ts`, the shell print attributes, `ClosingCta`/`CtaBanner`/styles, all CTA pages, FAQ/legal components/styles, team/contact/home changes, `navigation.ts`, `RootLayout`, `SiteFooter` move, `ContentAdminPage`, `TeamAdminPage`, `NotFoundPage`.
- **Untracked:** `docs/superpowers/plans/` (5 plans), `public/images/team/` (4 JPEGs), `src/components/layout/SiteFooter.tsx` + style, `src/components/ui/ClosingCta.tsx`, `EmptyState.tsx`, `SearchField.tsx`, `no-results.styled.ts`, `search-field.styled.ts`, `src/features/faqs/FaqBrowser.tsx` + `components/` + `styles/`, `src/features/legal/components/` + `readingTime.ts`, `src/features/team/avatar.ts`, `src/hooks/useActiveSection.ts`.
- **Deletions/moves:** `src/features/home/sections/SiteFooter.tsx` + its style (moved to layout); `src/features/about/MobileCta.tsx` + style (staged `AD`: added in the index, deleted in the worktree); `src/components/common/PageHeader.tsx` and `src/features/home/sections/Systems.tsx` + style (prior, staged deletes).
- `workflow/SESSION.md` is staged from the previous save; this write leaves the working tree updated and adds an unstaged diff. No commits, staging, or resets were run. The worktree has LF→CRLF warnings; nothing was staged.
- `src/components/ui/styles/empty-state.styled.ts` was restored to HEAD after an accidental overwrite; the worktree status is a line-ending/stat artifact and `git diff` shows no content change.

## Important Files
- Shared: `src/components/ui/ClosingCta.tsx`, `CtaBanner.tsx`, `styles/cta-banner.styled.ts`, `PageHero.tsx`, `SectionHead.tsx`, `Section.tsx`, `SearchField.tsx`, `EmptyState.tsx` + `styles/search-field.styled.ts`, `styles/no-results.styled.ts`, `SiteFooter` under `src/components/layout/`.
- Data: `data/database/pages.json`, `legal.json`, `team.json`, `src/data/types.ts`, `index.ts`, `icons.ts`, `storage.ts`; `src/data/index.ts` (`closingCta`, `mergePageSections` actions backfill, legal CTA icon resolution).
- FAQs: `src/features/faqs/FaqsPage.tsx`, `FaqBrowser.tsx`, `components/TopicFilter.tsx`, styles; `src/features/home/sections/Faq.tsx` + `styles/faq.styled.ts`.
- Legal: `src/features/legal/LegalPage.tsx`, `components/{LegalMeta,LegalToc,LegalSection}.tsx`, `readingTime.ts`, `styles/legal.styled.ts`.
- Print/shell: `src/styles/GlobalStyles.ts`, `src/components/layout/RootLayout.tsx`, `TopBar.tsx`, `src/components/layout/styles/root-layout.styled.ts`, `src/components/navigation/{DesktopSidebar,MobileBottomNav}.tsx`, `SiteFooter.tsx`, `PageHero.tsx`, `CtaBanner.tsx`.
- Team/Home/Contact: `TeamStrip.tsx`, `TeamHero.tsx`, `TeamAdminPage.tsx`, `team-strip.styled.ts`, `styles/hero.styled.ts`, `ContactPage.tsx`, `contact.styled.ts`, `MobileMoreMenu.tsx`.
- Docs/plans: `workflow/save-session.md`, `workflow/SESSION.md`, `docs/superpowers/plans/2026-11-19-faqs-legal-workspace.md`, `2026-11-19-cta-footer-data.md`, `2026-11-18-team-portraits.md`, `2026-11-18-sea-mist-canvas.md`, `2026-11-18-home-contact-polish.md`.
- Tests/verification: no test framework; use `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, `npm run build`, and browser checks.

## Issues and Blockers
- Launch blockers unchanged: contact form only stores in the visitor browser; `/admin` has no auth; remote/placeholder portraits are now real for the team but project screens/testimonials remain concept/sample; `siteUrl`/OG unconfirmed; legal wording unreviewed; no real testimonials/client projects.
- Docs are stale: `AGENTS.md`, `CLAUDE.md`, `README.md` do not describe the CTA/footer/FAQ/legal/print/data systems; `CLAUDE.md` still lists `PageHeader` and 10px `radii.sm`; update before the next implementation session.
- Legal CTAs are JSON-only (no admin editor for legal documents); the page CTA action editor exists and validates.
- The admin CTA editor was validated with an empty label (error shown, nothing saved); a successful save round-trip was not run to avoid writing browser-local content.
- The print dialog was not opened; print media rendering and the `window.print()` click were verified. 1024px was not re-checked for the new FAQ/legal pages; 320/768/1445/390 were. No screen-reader/axe or real-device pass.
- The FAQ "refund" search returns 0 because the content has no refund question; use "hosting"/"payment" for tests. The FAQ mobile TOC/legal mobile TOC remains a full card, not collapsible.
- Team assets are 69–81 KB each; `projects-hero-bg.png` is 1.55 MB; logo/avatar PNGs remain large (0.55–0.87 MB).
- `pages.json` was rewritten with `JSON.stringify` for the CTA data, which normalized About `mobile` indentation; no content changed, but the unstaged diff is noisy.
- The dev server can serve stale transforms; restart it before trusting a style mismatch.
- No test framework; no network/backend for inquiries. Headless/full-page captures can duplicate fixed chrome; use viewport/DOM checks.
- The team founder treatment is tint-only now (no left edge, no badge); confirm the owner is satisfied.
- The existing `empty-state.styled.ts` (Projects) and the new `EmptyState` component share a name but use different files; don't overwrite the former.

## Testing and Verification
- `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, `npm run build`: pass; latest build 6,800 modules.
- Portraits: 1024² JPEG, 69–81 KB; light/dark image swap in TeamStrip/TeamHero/lightbox; OG light path; alt text; legacy record fallback; asset 200s.
- Sea mist: body `rgb(241,247,244)`; cards white; sidebar subtle; meta `#F1F7F4`; dark unchanged; text contrast primary 14.99:1, secondary 5.51:1, accent 5.93:1; all routes.
- Team cards: desktop height 146 (was 162) with 16px vertical padding; 2px ring; founder tint; hover lift/ring/name; reduced-motion edge; 390/320 no overflow.
- Online dot: center distance 60px at avatar 120px and 72px at 144px; 2.4s ping; reduced-motion `none`.
- Contact: form/aside both 1118px at 1445, left 288/right 1406; layout background `none`; 320/390 no overflow; More sheet no visible "More", Escape closes.
- CTA/footer: 13-route sweep; each public route has one CTA and one footer; `/admin` none; primaries have 2 SVGs, secondaries 1; Contact hash `#inquiry-form`, form top 72; team card height.
- FAQs: 18 questions, topic counts 4/3/4/3/2/2; "hosting" 1 result; category "3 of 18"; empty state; clear; open panel closes when filtered out; 320/768 no overflow.
- Legal: 8 TOC links; active "01" initially, "04 Sharing your information" after click, hash `#sharing`; 8 anchor links; "2 min read", "8 sections"; print button calls `window.print`; print media white/centered/44rem with title/date and no shell/hero/CTA/footer.
- Not performed: actual print dialog, 1024px on the new pages, screen reader/axe, real devices, live Vercel deploy, unit/automated tests, WebP/OG image, real email delivery, admin save round-trip.

## Pending Tasks
- Review the FAQ workspace, legal document/print, CTA/footer data model, and the page-specific CTA copy at 390/1445 in both themes.
- Update `AGENTS.md` and `CLAUDE.md` (and README status if desired) for `ClosingCta`/`Footer`, the CTA `actions` schema, sea mist, FAQ/legal workspaces, print contract, team portraits/ring, contact full width/no wash, More kicker removal, online dot, `useActiveSection`, `EmptyState`, and the stale `radii.sm`/PageHeader notes.
- Run a 1024px sweep and print preview if the owner wants a broader QA pass.
- Commit only on explicit request; the staged index is pre-existing and must be reviewed before any commit.
- Launch blockers: contact delivery; `/admin` auth/reachability; real portraits/project URLs/testimonials; domain + OG; legal review.
- Optional: add an admin editor for legal CTAs; optimize logo/avatar/hero images; remove dead legacy styles (`projects-page.styled.ts`, `contact.styled.ts`, `about.styled.ts`, `Faq` `Intro`, `TeamResume` `BlockTitle`); remove unused `pages.json` `testimonials.principles`/`testimonials.hero` and `site.contact` fields.
- Confirm the founder card treatment and the new CTA copy with the owner.

## Next Recommended Steps
1. Review `/faqs`, `/privacy-policy`, `/terms-of-service`, the CTA/footer on all routes, and the team cards; use the screenshots in the temp folders.
2. Update `AGENTS.md` and `CLAUDE.md` before the next implementation session.
3. Optionally check 1024px and open the real print dialog.
4. Commit only on request, after reviewing the pre-existing staged set; then address launch blockers and asset/dead-style cleanup.

## Important Warnings
- Do not undo the latest owner decisions: one `ClosingCta` on every public page with two data-driven actions; global footer with admin excluded; FAQ split workspace; legal document workspace + print; sea mist; real team portraits; teal avatar ring on both; founder tint only (no left edge/badge); 16px vertical team padding; contact form full width/no wash; More kicker removed; online dot centered with ping.
- Keep CTA copy/actions in `pages.json`/`legal.json`; do not hardcode them back into JSX. Keep `closingCta()` icon resolution and the admin action editor.
- Keep `data-print-hide` on the shell, hero, CTA, and footer and the print CSS (`GlobalStyles`, legal styles); do not remove the print header or reset.
- Keep `STORAGE_PREFIX = 'ordacy-cms:v2:'`; `actions` and `darkSrc` are optional and `mergePageSections` backfills actions. Bump only for a real shape break.
- Do not overwrite `src/components/ui/styles/empty-state.styled.ts` (Projects uses it); the public `EmptyState` uses `no-results.styled.ts`.
- Every public page must call `useScrollReveal` or `data-reveal` content stays invisible (the 404 was fixed for this reason).
- Keep `FaqList` open-by-id and `animate={false}` on the FAQ workspace; keep the search/topic filter semantics.
- Keep the legal TOC `useActiveSection` cleanup, `aria-current`, anchor labels, and the print-only header; don't add per-page scroll effects.
- Keep the team light/dark photo mapping (`src` light, `darkSrc` dark) and the OG light image; don't swap in placeholders.
- Keep the sea-mist tokens in sync with `index.html`; dark tokens are intentionally unchanged.
- Keep the existing PageHero/SectionHead system and the documented heading exceptions; don't reintroduce top-level eyebrows/rules.
- Keep the contact order (`#inquiry-form`), 16px controls, honest success copy, and safe-area spacing.
- Never present samples as real, claim auth/email/database/uploads, or add demo-mode wording.
- Everything is uncommitted; don't commit, stage, clean, or discard without asking. The staged index predates this session; review it before committing.
- The dev server has served stale transforms repeatedly; restart before trusting a mismatch.
- Headless/full-page captures can duplicate scrolled/fixed chrome; confirm with DOM/viewport checks. No test framework; don't add one unless asked.

## Execution Recommendation
- Phase: Review / QA
- Current mode: not verified
- Recommended next mode: Review; Build only for docs/cleanup after approval
- Current model: DeepSeek V4.1 Flash 1017 (from session metadata)
- Recommended model: Sonnet 5.5 — availability not verified in this OpenCode session
- Effort: low for review; medium for the AGENTS/CLAUDE update
- Ultracode: OFF
- Token optimization: review the existing screenshots and copy, then one docs pass; no full re-sweep unless the owner changes the design
- Reason: implementation and runtime checks are complete; the remaining work is owner sign-off, documentation alignment, and launch blockers.
