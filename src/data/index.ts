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
import testimonialsJson from '@data/testimonials.json'
import { resolveIcon } from './icons'
import { readStored } from './storage'
import type {
  AdminNavGroup,
  Faq,
  FaqRecord,
  GalleryImageRecord,
  InquiryRecord,
  LegalDocument,
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
  Testimonial,
  TestimonialRecord,
} from './types'

export type * from './types'
export { iconNames, resolveIcon } from './icons'
export { readStored, STORAGE_PREFIX } from './storage'

type SeoKey = keyof typeof seoJson

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
const current = {
  site: readStored('site', seed.site),
  pages: readStored('pages', seed.pages),
  services: readStored('services', seed.services),
  plans: readStored('plans', seed.plans),
  faqs: readStored('faqs', seed.faqs),
  projects: readStored('projects', seed.projects),
  testimonials: readStored('testimonials', seed.testimonials),
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

export const legal: Record<'privacy' | 'terms', LegalDocument> = legalJson

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

export const gallery = ordered(published(current.gallery)).filter(
  (image) => !image.isSample,
)
