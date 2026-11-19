# Session Context

## Last Updated
2026-11-19T16:28:06+08:00

## Project Overview
Ordacy portfolio / lead-gen SPA plus admin CMS frontend. React 19 + Vite 8 + React Router 7 + TypeScript 6 + styled-components 6, npm only; no backend, env vars, tests, or CI config. Content and records live in `data/database/*.json`, read publicly through `@/data` (browser-local overlay shared with the admin via `src/data/storage.ts`), written by admin only through `src/services`. Conventions in `AGENTS.md` (wins on conflict). All pages are built; Home lives under `src/features/home/`; `/admin/*` has its own shell. `README.md`'s status sections still predate the homepage build; trust `src/` and `package.json` over them.

## Current Objective
No work is in progress. The latest completed pass was the final browser-review round: new hero imagery, sidebar active/hover/scrollbar polish, team card and profile-details refinements, About page responsiveness, pricing-note layout, contact-field transitions, legal/FAQ cleanup, and the team skills preview toggle. The worktree is clean and the work is committed as `5606143` on `develop`. Earlier this session, the team profiles were rewritten, the profile resume redesigned, and the FAQ/legal/CTA/footer systems were completed.

## Requirements and Constraints
- Content and records stay in `data/database/*.json`; page copy is never hardcoded in JSX. Admin reads/writes only through `src/services`. Never invent clients, quotes, results, ratings, integrations, prices, or persistence claims.
- No backend, no new dependencies, no commits/staging/reset/branch operations. Only `workflow/SESSION.md` may be written by `/save`.
- Public role is **Digital Solutions Developer**; no "Full Stack", stack-name, "Senior", "Lead", or "AI Developer" titles in the public role. AFHomes is only **Full Stack App Developer**, Aug 2026–Present, with no project details. Darcy is **Client Outreach**. Resume is the source of truth.
- AI-assisted delivery is described in prose (review, testing, production ownership), never as a title.
- Hero imagery: Home uses the laptop banner `public/images/ordacy-home-hero.png`; every other page hero uses the teal wave `public/images/ordacy-hero-wave.png` through the shared `PageHero` default. The old `ordacy-hero-cover.jpg` and `projects-hero-bg.png` are removed and unreferenced.
- Team profile strip: name above the role; Orlando facts `Focus: Automation`, `Since: 2025`, `Base: Philippines`; Darcy facts `Focus: Outreach`, `Base: Philippines`. Experience order: Ordacy first, then AFHomes, then Monte Carlo. Education honors render as separate lines.
- Team skills: collapsed to a maximum of two pill rows with a **Show All** / **Hide** toggle; expanded shows the four grouped stacks. The preview interleaves groups so every stack appears.
- Team cards: portrait, name, full position chip, **eye icon before View Profile**; no underline and no icon transition on hover; no corner arrow; initials badge (`OD`/`DT`) only when the card is at least 640px wide; no facts in the cards.
- Sidebar: group labels **Menu** and **Pages**; active item uses a stronger teal surface, border, bold label, and tinted icon tile, with no side rails; hover uses a softer preview; all transitions 200ms. The footer group is also **Pages**.
- Scrollbars are custom project-wide: 12px gutter, rounded 6px thumb, transparent track, theme-aware colors; Firefox gets the thin standard fallback.
- One icon maximum per button/link; no trailing arrows on page heroes or closing CTAs. Buttons are bold, controls 44px public / 40px admin. The team card link has one icon (the eye).
- About responsive rules: service carousel card stacks on phones and is side-by-side from 480px; ServiceExplorer puts tabs above a full-width panel at 1024–1279px and returns side-by-side at 1280px; approach 1/2/3/5 columns; process 2 columns below 768px and 4 above; audience 1/2/4 with horizontal icon cards; expectations 1/2/3.
- Pricing notes: 1 column on phones, 2 from 768px, 4 from 1280px with the icon stacked above copy. Contact inputs/selects transition border, background, and shadow over 200ms; focus tints the field and turns the leading icon/chevron teal.
- Legal pages no longer show an inline contact card; the closing `ClosingCta` is the only contact CTA there. The FAQ topic filter label is **All** (the count remains; accessible name "All, 18").
- Global line-height is 1.5. 4/8 spacing grid; controls 44px public; every control has one icon; icon sizes 16/18/20/24/28/32.
- Keep the scroll contract (`usePageScrollRestoration`), global `scroll-margin-top`, skip link, focus styles, and reduced-motion behaviour.
- Every public page ends with one `ClosingCta` and one global `SiteFooter`; `/admin` has neither. Keep `data-print-hide` on shell, hero, CTA, footer, and the print CSS.
- Earlier constraints still apply: FAQ split workspace; legal TOC/meta/print; samples `isSample: true` cannot be published; no "Demo mode"; `/admin` noindex and `Disallow: /admin`; team portraits light/dark mapping; sea-mist light tokens synced with `index.html`.

## Decisions Made
- Hero mapping approved: Home uses the laptop banner in the cover and lightbox; every other `PageHero` uses the wave by default, including team profiles. Old hero assets were deleted rather than kept as fallbacks.
- The About mobile service card visual uses the new home laptop banner; the wave is reserved for hero bands.
- Profile content decisions: name repeated above the role in the strip; Orlando focus Automation; Darcy focus Outreach; Ordacy first in experience; honors separated into bullet lines; skills collapsed with Show All/Hide.
- Team card decisions: eye icon precedes View Profile; the label has no hover underline or icon motion; facts were replaced by initials; initials appear only on wide single-column cards.
- Sidebar decisions: both side rails removed after review; active/hover strengthened; Menu/Pages group labels; custom scrollbars.
- About layout decisions: progressive list columns and a stacked service picker at mid-size desktops for readable panel width.
- Pricing notes are responsive; the 4-up cards stack their icons above the copy.
- Contact form fields gained smooth hover/focus transitions; selects use the same treatment.
- The legal inline contact card was removed as redundant; the closing CTA remains.
- FAQ label changed to All; the count badge remains.
- Earlier approved decisions remain: FAQ split workspace; legal document workspace + print; one closing CTA/footer on public pages; sea mist; real team portraits; team ring/tint without a left edge; contact form full width/no wash; sample locks.

## Completed Work
- Hero imagery: copied and tracked `ordacy-home-hero.png` (1916×821) and `ordacy-hero-wave.png` (2172×724); updated the home cover/lightbox, all PageHero defaults, the About mobile service visual, and removed all references to the old cover/projects hero files. Verified home at 1440/390, the lightbox, all eight non-home page heroes, and the 390 Contact hero.
- Sidebar: strengthened active/hover states, removed the active side rails, added Menu/Pages groups, moved the footer group to Pages, and added project-wide custom scrollbars.
- Team cards: eye before View Profile, no underline or icon transition on hover, initials badge on wide cards, no facts, no corner arrow, full position chip.
- Team profiles: name above role; Focus Automation/Outreach; Ordacy first in experience; education honors separated; skills preview capped at two rows with Show All/Hide; profile resume block redesign (icon-led headings, timeline markers, dotted profile texture, sticky side at xl, contact card).
- About: responsive service card, mid-desktop tab-above-panel layout, 1/2/3/5 approach, 2/4 process, 1/2/4 audience with horizontal cards, 1/2/3 expectations; FAQs **All** label; Projects Category label and expand toggle separated.
- Earlier completed systems remain: team profile rewrite; FAQ workspace; legal workspace/print; CTA/footer data and global footer; sea-mist tokens; team portraits; contact form; implicit design-system cleanup.
- Verification evidence: typecheck, lint, grid check, and build pass (6,801 modules); browser checks at 1440, 1055, 922, 546, 491, 390, and 320; both themes were checked for the sidebar/team/profile work; latest hero wave was checked on Projects/Team/Contact/Testimonials and the home banner at desktop/mobile.

## Current Implementation State
- All public routes render one `ClosingCta` and the global footer; `/admin` has neither. Hero images: home `ordacy-home-hero.png`; all PageHero routes (Projects, Pricing, FAQs, Testimonials, Legal, About, Contact, team profiles) `ordacy-hero-wave.png`.
- Team pages use the shared PageHero wave plus the existing cover art; the profile strip shows name, role, facts, contact; the resume uses the redesigned blocks and the skills toggle.
- Sidebar is `Menu`/`Pages`, collapsed mode verified, custom scrollbar active. The footer group label is `Pages`.
- About is responsive at the documented breakpoints; the mobile service card uses the home banner. Pricing notes and contact fields use the latest layouts/transitions.
- Legal pages show no inline contact card. FAQ filter says `All`.
- Dev server was running at `http://localhost:5173/` when the snapshot was written. It has repeatedly served stale transforms; restart before trusting a mismatch.
- `README.md` remains stale for status; `AGENTS.md` was updated in the last commit but may not describe the newest hero/skills/sidebar details. Review docs before a documentation edit.

## Git Changes
- Repository: `C:/Users/SSD-ORLANDO/Documents/Project/ordacy-portfolio`, branch `develop`, HEAD `5606143` ("chore: finished frontend prototype", 2026-11-19T16:13:38+08:00), up to date with `origin/develop`.
- Working tree was clean at the start of this save: no staged, unstaged, untracked, deleted, or renamed changes. `git diff`, `git diff --cached`, and `git ls-files --others --exclude-standard` are empty.
- The last commit contains the session work (151 files, +12,207/−3,426), including the new hero PNGs, profile/team/About/sidebar/pricing/contact/FAQ/legal changes, and the previous SESSION.md. The old hero images are absent from the committed tree and filesystem.
- This save modifies only `workflow/SESSION.md`; after the write it will be the sole unstaged file. No commits, staging, resets, or branch operations were performed.

## Important Files
- Hero/shared: `public/images/ordacy-home-hero.png`, `public/images/ordacy-hero-wave.png`, `src/components/ui/PageHero.tsx`, `src/components/ui/styles/page-hero.styled.ts`, `src/components/ui/styles/profile-hero.styled.ts`, `src/features/home/sections/Hero.tsx`.
- Team: `data/database/team.json`, `src/features/team/sections/TeamHero.tsx`, `TeamResume.tsx`, `components/TeamStrip.tsx`, `styles/team-hero.styled.ts`, `styles/team-resume.styled.ts`, `styles/team-strip.styled.ts`.
- Navigation: `src/components/navigation/DesktopSidebar.tsx`, `navigation.ts`, `styles/desktop-sidebar.styled.ts`, `styles/navigation.styled.ts`, `src/components/layout/styles/site-footer.styled.ts`, `src/styles/GlobalStyles.ts`.
- About: `src/features/about/AboutUsPage.tsx`, `ServiceExplorer.tsx`, `MobileServices.tsx`, `about-sections.tsx`, `styles/about-sections.styled.ts`, `styles/service-explorer.styled.ts`, `styles/mobile-services.styled.ts`.
- Contact/FAQ/legal: `src/features/contact/ContactForm.tsx`, `styles/contact.styled.ts`, `src/components/ui/SelectField.tsx`, `styles/select-field.styled.ts`, `src/features/faqs/FaqBrowser.tsx`, `components/TopicFilter.tsx`, `src/features/legal/LegalPage.tsx`, `styles/legal.styled.ts`.
- Pricing/projects: `src/features/pricing/styles/how-it-works.styled.ts`, `src/features/projects/ProjectsPage.tsx`, `styles/projects-page.styled.ts`.
- Earlier shared systems: `ClosingCta`, `SiteFooter`, `PageHero`, `SectionHead`, `Section`, `SearchField`, `EmptyState`, FAQ/legal components, `src/data/*`, admin CTA/team editors.
- Workflow: `workflow/save-session.md`, `workflow/SESSION.md`, `workflow/load-session.md`; no test framework (use typecheck, lint, grid check, build, browser checks).

## Issues and Blockers
- Launch blockers: contact form only stores in the visitor's browser; `/admin` has no auth; project screenshots/testimonials remain concept/sample; some client permissions/assets are unconfirmed; domain/OG are unconfirmed; legal wording unreviewed.
- Hero PNGs are large (home 1.84MB, wave 1.52MB). Optimize to WebP/JPEG or resize before launch; the current build ships the PNGs.
- Skills preview uses a fixed `4.5rem` two-row height and education honors split on `. `; both are documented shortcuts in code. Revisit if the type scale or content shape changes.
- The exact 1024px breakpoint edge was not separately checked (1055 and 922 were); dark mode was not re-swept after the hero-image change (PageHero is always navy and the home cover is theme-independent).
- `README.md` is stale for page status; `AGENTS.md`/`CLAUDE.md` may not cover the latest UI details (hero waves, skills toggle, sidebar states). Align before a docs pass.
- The dev server can serve stale transforms; restart before trusting a style mismatch. Full-page captures can duplicate fixed chrome.
- No test framework, no live backend, no real-device/screen-reader pass. The actual print dialog and admin save round-trip were not exercised.
- Unused legacy hero-band styles remain in `about.styled.ts`, `contact.styled.ts`, and `projects-page.styled.ts`; optional cleanup, not a runtime issue.

## Testing and Verification
- `npm run typecheck`, `npm run lint`, `node scripts/check-grid.mjs`, and `npm run build` pass; latest build 6,801 modules.
- Latest browser pass: home hero 1440/390 and lightbox; all non-home PageHero backgrounds computed as `ordacy-hero-wave.png`; Projects/Team at 1055, Contact/Testimonials and About card at 390/491; team profile strip, experience order, education lines, skills 72px closed/expanded, Show All/Hide; About lists at 1055/922/390/320; FAQ `All 18`; one-icon audit clean; no console errors or horizontal overflow.
- Earlier verified: both themes for sidebar/team/avatar/profile work; team cards at 1440/1055/390; pricing notes at 1055/1440/390/320; contact transitions; legal pages without inline asides; scrollbars at short desktop heights.
- Not performed: actual print dialog, screen-reader/axe audit, real devices, live Vercel deploy, real contact delivery, admin save round-trip, image optimization, a fresh dark-mode pass for the new hero images.

## Pending Tasks
- Owner review of the new hero images, sidebar states, team profile details, skills toggle, and About layouts at desktop and phone widths.
- Optimize the two hero PNGs and confirm the image format/quality for production.
- Confirm Darcy's real prior work/education if it should be published; confirm Leidi/client permission for screenshots; replace concept project/testimonial assets with approved real ones.
- Align `AGENTS.md`/`CLAUDE.md`/`README.md` with the final UI and hero system; optionally remove the dead hero-band styles.
- Resolve launch blockers (contact delivery, admin auth, real content, domain/OG, legal review).
- Commit `workflow/SESSION.md` only on explicit request; the worktree is otherwise clean.

## Next Recommended Steps
1. Review `/`, `/projects`, `/pricing`, `/faqs`, `/testimonials`, `/about-us`, `/contact`, `/privacy-policy`, `/terms-of-service`, and both team profiles in the browser at 1440 and 390, both themes.
2. Decide and apply hero image optimization before launch.
3. Do one docs/cleanup pass (AGENTS/CLAUDE/README, dead hero-band styles), then address launch blockers.
4. Keep Git read-only until the owner asks for a commit; after this save, only SESSION.md should be modified.

## Important Warnings
- Do not restore the old `ordacy-hero-cover.jpg` or `projects-hero-bg.png`; do not put page-specific image props back on PageHero unless the owner asks. Keep the home laptop banner and the shared wave.
- Do not undo the committed UI decisions: no active sidebar rails; stronger teal active/hover; Menu/Pages labels; custom scrollbar; eye before View Profile with no underline/transition; initials only on wide team cards; name above role; Focus Automation/Outreach; Ordacy first; education honors separated; skills two-row preview with Show All/Hide.
- Keep the About breakpoints, pricing-note layout, contact transitions, legal inline card removed, FAQ `All` label, one-icon rule, and global 1.5 line-height.
- Content stays in `data/database/*.json`; never invent clients, results, quotes, roles, dates, or education. Keep samples locked and `/admin` noindex.
- Keep the one closing CTA and global footer on public pages; keep print rules and `data-print-hide`; keep the scroll contract and reduced-motion behaviour.
- The dev server has served stale transforms repeatedly; restart it before trusting a mismatch. No test framework; do not add one unless asked.
- Only `workflow/SESSION.md` may be written by `/save`; Git remains read-only.

## Execution Recommendation
- Phase: QA / handoff
- Current mode: not verified
- Recommended next mode: Review; Build only for docs or image optimization after approval
- Current model: DeepSeek V4.1 Flash 1017 (from session metadata)
- Recommended model: Sonnet 5.5 — availability not verified in this OpenCode session
- Effort: low for review; medium for docs/asset optimization
- Ultracode: OFF
- Token optimization: review the committed build and screenshots; one docs/asset pass; no full re-sweep unless the owner changes the design
- Reason: implementation is committed and verified; the remaining work is owner sign-off, image/docs cleanup, content permissions, and launch blockers.
