# Phase 00 — Content cleanup

**Goal:** an honest site before any backend work. Remove every sample record, every
concept showcase project, and the machinery built to handle them. Public pages show
their existing empty states until real content exists.

**Prerequisites:** none. This phase runs on the committed state system (`c12a5bf`).

## Decisions specific to this phase

- Drop all `isSample` records in `testimonials`, `gallery`, `inquiries`.
- Drop all six `type: "concept-demo"` projects: `business-management`,
  `clinic-booking`, `inventory-sales`, `retail-crm`, `operations-dashboard`,
  `coworking-website`. The `type` field stays in the schema.
- Remove the `isSample` field from types and all code paths. No sample badges, locks,
  fallbacks, counts, or copy remain.
- Gallery has no public usage today (admin only); its page still gets the cleanup.
- Keep `problems`, `process`, `legal`, `states`, `admin-navigation` untouched.
- Fix the stale comment at the top of `src/features/home/home.data.ts` (Projects and
  Testimonials now read real data only).

## Steps

- [ ] **1. Empty the sample collections.**
  - `data/database/testimonials.json` → `[]`
  - `data/database/gallery.json` → `[]`
  - `data/database/inquiries.json` → `[]`
  - `data/database/projects.json` → `[]` (all six records are concepts)
  - `grep -ri "isSample" data/database` returns nothing afterward.

- [ ] **2. Remove the field from the model.** In `src/data/types.ts`, delete `isSample`
  from `ProjectRecord`, `TestimonialRecord`, `GalleryImageRecord`, `InquiryRecord` (and
  any composing types). Follow TypeScript errors to their end.

- [ ] **3. Public data layer** (`src/data/index.ts`):
  - `showcaseProjects = ordered(published(current.projects))` (drop the non-sample
    filter).
  - `testimonials = ordered(current.testimonials).filter((t) => t.status === 'approved' && t.isPublished)`.
  - Delete the `sampleTestimonials` export and its comments.
  - `gallery = ordered(published(current.gallery))` (drop the non-sample filter).

- [ ] **4. Public UI:**
  - `src/features/home/home.data.ts`: remove `sampleTestimonials` from the re-export;
    replace the header comment.
  - `src/features/home/HomePage.tsx`: `hasTestimonials = testimonials.length > 0`;
    remove the sample import.
  - `src/features/home/sections/Testimonials.tsx`: `items = testimonials`; delete the
    fallback branch.
  - `src/features/testimonials/TestimonialsPage.tsx`: `items = testimonials`;
    `empty={items.length === 0}`; remove the sample import.
  - `src/features/testimonials/components/TestimonialCard.tsx`: delete the
    `testimonial.isSample` badge branch.
  - Expect: Home hides the testimonials section and shows the Projects `StatePanel`;
    `/projects` and `/testimonials` show their page-level empty states.

- [ ] **5. Admin UI:**
  - `src/features/admin/projects/ProjectsAdminPage.tsx`: remove sample badges,
    `disabled` locks, sample `title` text, sample counters, and the
    `isSample: false` / `!record?.isSample` conditions (publishing becomes a plain
    checkbox).
  - `src/features/admin/testimonials/TestimonialsAdminPage.tsx`: same, including the
    `status`/`rating`/`isPublished` simplifications and sample hints.
  - `src/features/admin/gallery/GalleryAdminPage.tsx`: same.
  - `src/features/admin/inquiries/InquiriesPage.tsx` and
    `src/features/admin/inquiries/InquiryDetails.tsx`: remove sample badges.
  - `src/features/admin/dashboard/DashboardPage.tsx`: remove the sample-count stat and
    the sample totals; approved-testimonial count loses `!t.isSample`.
  - `src/services/index.ts`: drop `isSample: false` from `submitInquiry`; drop
    `sampleCount` from `InquiryStats`.
  - Any now-unused `Badge`/`Hint` imports go with the code.

- [ ] **6. AGENTS.md:** update "Content integrity" and "Admin" wording — the sample
  system no longer exists; empty states are the honest fallback; remove "Sample"
  references from the admin bullets and copy-budget line.

## Verification

- [ ] `npm run typecheck`, `npm run lint`, `npm run check:grid`, `npm run build` all
  pass.
- [ ] `grep -ri "isSample\|sampleTestimonials" src/` returns nothing.
- [ ] Browser at 320, 768, 1440: `/` hides testimonials and shows the Projects empty
  panel; `/projects` and `/testimonials` show their empty states with working actions;
  `/faqs`, `/about-us`, `/contact`, legal pages unchanged; no console errors; no
  horizontal overflow.
- [ ] Admin at 768: dashboard, projects, testimonials, gallery, inquiries pages render
  with empty states; create a draft record and delete it (browser-local, throwaway);
  no sample badges anywhere; no console errors.
- [ ] `?state=empty` previews still work on every public page.

## Checkpoint (owner)

Open `/projects` and `/testimonials` and confirm the empty states read correctly; open
`/` and confirm no fake project or testimonial content appears. Confirm nothing you
consider real was removed (the six concept projects are gone by design).

## Review criteria

Scope confined to the files above; no semantic change to CRUD behavior, publishing
rules, ordering, or design language; empty states use the shared `PageState`/`StatePanel`
already in place; AGENTS.md updated.

## Commit

`chore: remove sample and concept content`
