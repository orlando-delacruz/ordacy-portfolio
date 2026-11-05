// Data access layer for the admin (and the contact form). UI code calls these
// functions only; today they use the browser-local store, later an API client.
import { seed } from '@/data'
import type {
  FaqRecord,
  GalleryImageRecord,
  InquiryRecord,
  InquiryStatus,
  PageRecord,
  PlanRecord,
  ProjectRecord,
  SeoRecord,
  ServiceRecord,
  SettingsRecord,
  SiteRecord,
  TestimonialRecord,
} from '@/data'
import { createCollection, createDocument, createId } from './local-store'

export { createId, restoreOriginalContent } from './local-store'
export type { Collection, DocumentStore } from './local-store'

export const inquiriesService = createCollection<InquiryRecord>(
  'inquiries',
  seed.inquiries,
)
export const projectsService = createCollection<ProjectRecord>(
  'projects',
  seed.projects,
)
export const testimonialsService = createCollection<TestimonialRecord>(
  'testimonials',
  seed.testimonials,
)
export const servicesService = createCollection<ServiceRecord>(
  'services',
  seed.services,
)
export const plansService = createCollection<PlanRecord>('plans', seed.plans)
export const faqsService = createCollection<FaqRecord>('faqs', seed.faqs)
export const galleryService = createCollection<GalleryImageRecord>(
  'gallery',
  seed.gallery,
)
export const pagesService = createCollection<PageRecord>('pages', seed.pages)
export const seoService = createCollection<SeoRecord>(
  'seo',
  Object.entries(seed.seo).map(([id, page]) => ({ id, ...page })),
)
export const siteService = createDocument<SiteRecord>('site', seed.site)
export const settingsService = createDocument<SettingsRecord>(
  'settings',
  seed.settings,
)

/* ---------- Inquiries ---------- */

export const inquiryStatuses: readonly InquiryStatus[] = [
  'new',
  'in-progress',
  'completed',
]

export type InquiryQuery = {
  search?: string
  status?: InquiryStatus | 'all'
  page?: number
  pageSize?: number
}

export type InquiryPage = {
  items: InquiryRecord[]
  /** Records matching the search and filter. */
  total: number
  page: number
  pageCount: number
}

const newestFirst = (a: InquiryRecord, b: InquiryRecord) =>
  Date.parse(b.submittedAt) - Date.parse(a.submittedAt)

/** Search (name or email), filter by status, newest first, paginated. */
export async function queryInquiries({
  search = '',
  status = 'all',
  page = 1,
  pageSize = 10,
}: InquiryQuery): Promise<InquiryPage> {
  const term = search.trim().toLowerCase()
  const matches = (await inquiriesService.list())
    .filter((inquiry) => status === 'all' || inquiry.status === status)
    .filter(
      (inquiry) =>
        !term ||
        inquiry.fullName.toLowerCase().includes(term) ||
        inquiry.email.toLowerCase().includes(term),
    )
    .sort(newestFirst)

  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize))
  const current = Math.min(Math.max(1, page), pageCount)
  const start = (current - 1) * pageSize

  return {
    items: matches.slice(start, start + pageSize),
    total: matches.length,
    page: current,
    pageCount,
  }
}

export type InquiryStats = Record<InquiryStatus | 'total', number> & {
  sampleCount: number
  recent: InquiryRecord[]
}

/** Dashboard figures, derived from the stored inquiries. */
export async function getInquiryStats(recentCount = 5): Promise<InquiryStats> {
  const all = (await inquiriesService.list()).sort(newestFirst)
  const count = (status: InquiryStatus) =>
    all.filter((inquiry) => inquiry.status === status).length

  return {
    total: all.length,
    new: count('new'),
    'in-progress': count('in-progress'),
    completed: count('completed'),
    sampleCount: all.filter((inquiry) => inquiry.isSample).length,
    recent: all.slice(0, recentCount),
  }
}

export type InquiryInput = {
  name: string
  email: string
  business: string
  service: string
  plan: string
  message: string
  /** YYYY-MM-DD, or empty when not given. */
  launchDate: string
}

/**
 * Public contact form submission. BACKEND: replace with a real request.
 * Today it stores the inquiry in this browser's local data only, so it shows
 * up in admin Inquiries on the same device. Nothing is emailed or sent.
 */
export async function submitInquiry(input: InquiryInput): Promise<void> {
  await inquiriesService.create({
    id: createId('inquiry'),
    fullName: input.name,
    email: input.email,
    company: input.business || null,
    projectType: input.service || null,
    budgetRange: input.plan || null,
    details: input.message,
    targetLaunchDate: input.launchDate || null,
    status: 'new',
    submittedAt: new Date().toISOString(),
    isSample: false,
  })
}
