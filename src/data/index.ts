// Single import surface for site content. Reads static JSON from
// /data/database (a stand-in for the future backend database).
//
// - `seed`: the raw stored records, used by the admin services layer.
// - Everything else: what the public site renders (published only, in
//   display order, icons resolved). Swap these for API calls later and
//   pages stay unchanged.
import adminNavigationJson from '@data/admin-navigation.json'
import faqsJson from '@data/faqs.json'
import galleryJson from '@data/gallery.json'
import inquiriesJson from '@data/inquiries.json'
import legalJson from '@data/legal.json'
import pagesJson from '@data/pages.json'
import plansJson from '@data/plans.json'
import problemsJson from '@data/problems.json'
import processJson from '@data/process.json'
import projectsJson from '@data/projects.json'
import seoJson from '@data/seo.json'
import servicesJson from '@data/services.json'
import settingsJson from '@data/settings.json'
import siteJson from '@data/site.json'
import teamJson from '@data/team.json'
import testimonialsJson from '@data/testimonials.json'
import { resolveIcon } from './icons'
import { readStored } from './storage'
import type {
  AdminNavGroup,
  ClosingCtaData,
  Faq,
  FaqRecord,
  GalleryImageRecord,
  InquiryRecord,
  LegalDocument,
  LegalDocumentRecord,
  PageRecord,
  PageSeo,
  Plan,
  PlanRecord,
  Problem,
  ProblemRecord,
  ProjectRecord,
  Service,
  ServiceRecord,
  SettingsRecord,
  ShowcaseProject,
  SiteRecord,
  Step,
  StepRecord,
  TeamMember,
  TeamMemberRecord,
  Testimonial,
  TestimonialRecord,
} from './types'

export type * from './types'
export { iconNames, resolveIcon } from './icons'
export { readStored, STORAGE_PREFIX } from './storage'

type SeoKey = keyof typeof seoJson

/**
 * Stored pages can predate sections added to the JSON seed. Keep every saved
 * edit, but append any seed section the stored page does not have yet, so new
 * content blocks appear without wiping browser-local edits.
 */
export function mergePageSections(
  seedPages: readonly PageRecord[],
  storedPages: readonly PageRecord[],
): PageRecord[] {
  const storedById = new Map(storedPages.map((page) => [page.id, page]))
  return seedPages.map((seedPage) => {
    const storedPage = storedById.get(seedPage.id)
    if (!storedPage) return seedPage
    const storedIds = new Set(storedPage.sections.map((section) => section.id))
    const seedSections = new Map(
      seedPage.sections.map((section) => [section.id, section]),
    )
    return {
      ...storedPage,
      header: storedPage.header ?? seedPage.header,
      sections: [
        ...storedPage.sections.map((section) => {
          const seedSection = seedSections.get(section.id)
          // Saved pages predate the mobile copy and CTA actions; fill them
          // without losing edits.
          const mobile = section.mobile ?? seedSection?.mobile
          const actions = section.actions ?? seedSection?.actions
          if (mobile === section.mobile && actions === section.actions) {
            return section
          }
          return { ...section, mobile, actions }
        }),
        ...seedPage.sections.filter((section) => !storedIds.has(section.id)),
      ],
    }
  })
}

/** Raw stored records: the seed for the admin data layer. */
export const seed = {
  site: siteJson as SiteRecord,
  pages: pagesJson as PageRecord[],
  services: servicesJson as ServiceRecord[],
  problems: problemsJson as ProblemRecord[],
  plans: plansJson as PlanRecord[],
  process: processJson as StepRecord[],
  faqs: faqsJson as FaqRecord[],
  projects: projectsJson as ProjectRecord[],
  testimonials: testimonialsJson as TestimonialRecord[],
  team: teamJson as TeamMemberRecord[],
  gallery: galleryJson as GalleryImageRecord[],
  inquiries: inquiriesJson as InquiryRecord[],
  seo: seoJson as Record<SeoKey, PageSeo>,
  settings: settingsJson as SettingsRecord,
  adminNavigation: adminNavigationJson as AdminNavGroup[],
}

/*
 * What the public site renders: the seed, overlaid with any edits saved from
 * the admin in this browser (read once at load, so edits show after a reload).
 * Same records and models as the admin; swap readStored for an API later.
 */
const storedSeo = readStored<(PageSeo & { id: string })[] | null>('seo', null)
const storedSite = readStored('site', seed.site)
const storedPages = readStored('pages', seed.pages)
const current = {
  // Older saved edits may lack newer fields; fill them from the seed.
  site: {
    ...seed.site,
    ...storedSite,
    profileStats: {
      ...seed.site.profileStats,
      ...(storedSite.profileStats ?? {}),
    },
  },
  pages: mergePageSections(seed.pages, storedPages),
  services: readStored('services', seed.services),
  plans: readStored('plans', seed.plans),
  faqs: readStored('faqs', seed.faqs),
  projects: readStored('projects', seed.projects),
  testimonials: readStored('testimonials', seed.testimonials),
  team: readStored('team', seed.team),
  gallery: readStored('gallery', seed.gallery),
  seo: storedSeo
    ? (Object.fromEntries(storedSeo.map(({ id, ...page }) => [id, page])) as Record<SeoKey, PageSeo>)
    : seed.seo,
}

const withIcon = <T extends { icon: string }>(item: T) => ({
  ...item,
  icon: resolveIcon(item.icon),
})

const ordered = <T extends { displayOrder: number }>(items: readonly T[]) =>
  [...items].sort((a, b) => a.displayOrder - b.displayOrder)

const published = <T extends { isPublished: boolean }>(items: readonly T[]) =>
  items.filter((item) => item.isPublished)

export const site = current.site

const withLegalCta = (document: LegalDocumentRecord): LegalDocument => ({
  ...document,
  cta: {
    ...document.cta,
    actions: document.cta.actions.map((action) => ({
      ...action,
      icon: resolveIcon(action.icon),
    })),
  },
})

const legalSeed = legalJson as {
  privacy: LegalDocumentRecord
  terms: LegalDocumentRecord
}

export const legal: Record<'privacy' | 'terms', LegalDocument> = {
  privacy: withLegalCta(legalSeed.privacy),
  terms: withLegalCta(legalSeed.terms),
}

export const seo: Record<SeoKey, PageSeo> = current.seo

const pagesById = new Map(current.pages.map((page) => [page.id, page]))

/** Copy for one public page. Throws on unknown ids so typos surface in dev. */
export function getPage(id: string): PageRecord {
  const page = pagesById.get(id)
  if (!page) throw new Error(`Unknown page "${id}" in data/database/pages.json`)
  return page
}

/** One section's copy from a page, by section id. */
export function getSection(pageId: string, sectionId: string) {
  const section = getPage(pageId).sections.find((s) => s.id === sectionId)
  if (!section) {
    throw new Error(`Unknown section "${sectionId}" on page "${pageId}"`)
  }
  return section
}

/** Heading and intro for a `Section`, ready to spread as props. */
export function sectionCopy(pageId: string, sectionId: string) {
  const { title, description } = getSection(pageId, sectionId)
  return { title, description: description ?? undefined }
}

/** A closing CTA record with its action icons resolved. */
export function closingCta(
  pageId: string,
  sectionId: string,
): ClosingCtaData {
  const section = getSection(pageId, sectionId)
  return {
    eyebrow: section.eyebrow,
    title: section.title,
    description: section.description,
    actions: (section.actions ?? []).map((action) => ({
      ...action,
      icon: resolveIcon(action.icon),
    })),
  }
}

/** A page's `PageHeader` copy. */
export function pageHeader(pageId: string) {
  const { header } = getPage(pageId)
  if (!header) throw new Error(`Page "${pageId}" has no header copy`)
  return header
}

export const problems: readonly Problem[] = ordered(seed.problems).map(withIcon)

export const services: readonly Service[] = ordered(
  published(current.services),
).map(withIcon)

export const plans: readonly Plan[] = ordered(published(current.plans)).map((plan) => ({
  ...plan,
  icon: resolveIcon(plan.icon),
  ctaIcon: resolveIcon(plan.ctaIcon),
}))

export const steps: readonly Step[] = ordered(seed.process).map(withIcon)

export const faqs: readonly Faq[] = ordered(published(current.faqs)).map(withIcon)

// Sample records (`isSample`) are illustrative and never published.
export const showcaseProjects: readonly ShowcaseProject[] = ordered(
  published(current.projects).filter((project) => !project.isSample),
).map(withIcon)

// Only approved, published, genuine (non-sample) testimonials are shown.
export const testimonials: readonly Testimonial[] = ordered(
  current.testimonials,
).filter((t) => t.status === 'approved' && t.isPublished && !t.isSample)

// Deliberate public fallback: clearly labeled sample cards, never real testimonials.
export const sampleTestimonials: readonly Testimonial[] = ordered(
  current.testimonials,
).filter((testimonial) => testimonial.isSample)

export const team: readonly TeamMember[] = ordered(
  published(current.team),
)

/** Published member by URL slug, or undefined for unknown slugs. */
export function teamMemberBySlug(slug: string): TeamMember | undefined {
  return team.find((member) => member.slug === slug)
}

export const gallery = ordered(published(current.gallery)).filter(
  (image) => !image.isSample,
)
