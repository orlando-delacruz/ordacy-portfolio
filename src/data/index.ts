// Single import surface for site content.
//
// - `seed`: the JSON records used by static admin navigation and as the
//   initial public fallback before the API payload arrives.
// - `loadPublicContent`: one API read that fills the live bindings below.
//   Pages are imported only after it settles, so their module-scope reads
//   (Home stats and guards, Projects count) see the database values.
// - `problems`, `process`, `legal`, `states`, `admin-navigation`: static
//   build-time JSON that the admin never edits.
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
import statesJson from '@data/states.json'
import teamJson from '@data/team.json'
import testimonialsJson from '@data/testimonials.json'
import type { LucideIcon } from 'lucide-react'
import { resolveIcon } from './icons'
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
  PageStateActionRecord,
  PageStateCopyRecord,
  PageStateKey,
  PageStatesRecord,
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

type SeoKey = keyof typeof seoJson

/** Raw stored records: the development seed and static-page source. */
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

/* ---------- Public content: the API payload and its live bindings ---------- */

/** Exactly what GET /api/content returns: published rows, mapped and ordered. */
type PublicContent = {
  site: SiteRecord
  pages: PageRecord[]
  services: ServiceRecord[]
  plans: PlanRecord[]
  faqs: FaqRecord[]
  projects: ProjectRecord[]
  testimonials: TestimonialRecord[]
  team: TeamMemberRecord[]
  gallery: GalleryImageRecord[]
  seo: Record<SeoKey, PageSeo>
}

const CONTENT_ENDPOINT = '/api/content'
const CONTENT_CACHE_KEY = 'ordacy-content:v1'
const CONTENT_TIMEOUT_MS = 8000

const withIcon = <T extends { icon: string }>(item: T) => ({
  ...item,
  icon: resolveIcon(item.icon),
})

const ordered = <T extends { displayOrder: number }>(items: readonly T[]) =>
  [...items].sort((a, b) => a.displayOrder - b.displayOrder)

export let site: SiteRecord = seed.site
export let pages: readonly PageRecord[] = seed.pages
export let services: readonly Service[] = []
export let plans: readonly Plan[] = []
export let faqs: readonly Faq[] = []
export let projects: readonly ShowcaseProject[] = []
export let testimonials: readonly Testimonial[] = []
export let team: readonly TeamMember[] = []
export let gallery: readonly GalleryImageRecord[] = []
export let seo: Record<SeoKey, PageSeo> = seed.seo

/**
 * Applies one content payload: ordering and icon resolution happen here,
 * once, for every collection. The API already filtered to published rows.
 */
function hydratePublicContent(content: PublicContent) {
  site = content.site
  pages = content.pages
  services = ordered(content.services).map(withIcon)
  plans = ordered(content.plans).map((plan) => ({
    ...plan,
    icon: resolveIcon(plan.icon),
    ctaIcon: resolveIcon(plan.ctaIcon),
  }))
  faqs = ordered(content.faqs).map(withIcon)
  projects = ordered(content.projects).map(withIcon)
  testimonials = ordered(content.testimonials)
  team = ordered(content.team)
  gallery = ordered(content.gallery)
  seo = content.seo
}

// Start from the local seed so the standalone loading screen and any import
// that runs before the API settles still see the app's models. The API call
// replaces this before App (and every page module) is imported.
hydratePublicContent({
  site: seed.site,
  pages: seed.pages,
  services: seed.services,
  plans: seed.plans,
  faqs: seed.faqs,
  projects: seed.projects,
  testimonials: seed.testimonials,
  team: seed.team,
  gallery: seed.gallery,
  seo: seed.seo,
})

function readCachedContent(): PublicContent | null {
  try {
    const raw = localStorage.getItem(CONTENT_CACHE_KEY)
    return raw ? (JSON.parse(raw) as PublicContent) : null
  } catch {
    // Storage unavailable or corrupt: behave as if there were no cache.
    return null
  }
}

function writeCachedContent(content: PublicContent) {
  try {
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(content))
  } catch {
    // Quota or private mode: the in-memory copy still renders this visit.
  }
}

/**
 * Loads the public content once, before the app mounts.
 *
 * Success: hydrate from the API and keep the payload as the last-good copy.
 * Failure: hydrate from that copy and warn; with no copy, rethrow so the
 * entry point can show the error page instead of a blank site.
 */
export async function loadPublicContent(): Promise<void> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), CONTENT_TIMEOUT_MS)

  try {
    const response = await fetch(CONTENT_ENDPOINT, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new Error(
        `GET ${CONTENT_ENDPOINT} failed with status ${response.status}`,
      )
    }
    const content = (await response.json()) as PublicContent
    hydratePublicContent(content)
    writeCachedContent(content)
  } catch (error) {
    const cached = readCachedContent()
    if (!cached) throw error
    console.warn(
      'Content API unavailable; using the last saved copy.',
      error,
    )
    hydratePublicContent(cached)
  } finally {
    window.clearTimeout(timer)
  }
}

/* ---------- Static build-time content (never edited by the admin) ---------- */

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

/** Copy for one public page. Throws on unknown ids so typos surface in dev. */
export function getPage(id: string): PageRecord {
  const page = pages.find((candidate) => candidate.id === id)
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

export const steps: readonly Step[] = ordered(seed.process).map(withIcon)

/** Published member by URL slug, or undefined for unknown slugs. */
export function teamMemberBySlug(slug: string): TeamMember | undefined {
  return team.find((member) => member.slug === slug)
}

/* ---------- Public page states ---------- */

export type StateAction = {
  label: string
  to: string
  icon: LucideIcon
}

export type StateCopy = {
  title: string
  description: string
  actions: readonly StateAction[]
}

const states = statesJson as PageStatesRecord

// Defensive copy: the public state layer must never throw or render blank.
const fallbackStateCopy: StateCopy = {
  title: 'This content is unavailable.',
  description: 'It has not been published yet. Please try again later.',
  actions: [],
}

const fallbackStateIcon = resolveIcon('MessagesSquare')

function toStateAction(action: PageStateActionRecord): StateAction {
  let icon = fallbackStateIcon
  try {
    icon = resolveIcon(action.icon)
  } catch {
    // A bad icon name in saved data must not break a public page.
  }
  return { label: action.label, to: action.to, icon }
}

function toStateCopy(record: PageStateCopyRecord | undefined): StateCopy {
  if (!record) return fallbackStateCopy
  const actions = Array.isArray(record.actions) ? record.actions : []
  return {
    title: record.title || fallbackStateCopy.title,
    description: record.description || fallbackStateCopy.description,
    actions: actions.map(toStateAction),
  }
}

/** Empty-state copy for one public page, with a safe fallback. */
export function pageStateCopy(page: PageStateKey): StateCopy {
  return toStateCopy(states.pages?.[page]?.empty)
}

/** Shared system error copy for the public state layer. */
export function sharedStateCopy(state: 'error' | 'submitError'): StateCopy {
  return toStateCopy(states.shared?.[state])
}

/** The contact form's completed-action copy. */
export function contactSuccessCopy(): StateCopy {
  return toStateCopy(states.pages?.contact?.success)
}
