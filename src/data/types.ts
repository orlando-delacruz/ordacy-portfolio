import type { LucideIcon } from 'lucide-react'

/*
 * Two layers of types:
 * - `*Record`: the stored shape (data/database JSON today, a database/API
 *   later). Icons are stored by name, timestamps as ISO strings.
 * - Public types (`Service`, `Plan`...): records resolved for rendering,
 *   with the icon name swapped for its Lucide component.
 */

type WithIcon<T extends { icon: string }> = Omit<T, 'icon'> & {
  icon: LucideIcon
}

/* ---------- Site ---------- */

export type PendingValue = { value: string | null; pending: boolean }

export type SiteRecord = {
  name: string
  tagline: string
  description: string
  siteUrl: string
  siteUrlPending: boolean
  footerTagline: string
  contact: {
    email: PendingValue
    phone: PendingValue
    location: PendingValue
    responseTime: PendingValue
  }
  markets: readonly string[]
}

/* ---------- Pages (Website Content) ---------- */

export type ContentItem = { title: string; text: string }

export type PageSectionRecord = {
  id: string
  /** Admin-facing name for the block. */
  label: string
  eyebrow: string | null
  title: string
  description: string | null
  items: readonly ContentItem[] | null
}

export type PageHeaderRecord = {
  eyebrow: string
  title: string
  description: string
}

export type PageRecord = {
  id: string
  label: string
  path: string
  header: PageHeaderRecord | null
  sections: readonly PageSectionRecord[]
}

/* ---------- Content collections ---------- */

export type ProblemRecord = {
  id: string
  icon: string
  title: string
  description: string
  /** Titles of the `services` entries that address this problem. */
  solvedBy: readonly string[]
  displayOrder: number
}
export type Problem = WithIcon<ProblemRecord>

export type ServiceRecord = {
  id: string
  icon: string
  title: string
  /** One-sentence summary used on cards. */
  description: string
  /** The business problem this service addresses. */
  problem: string
  capabilities: readonly string[]
  useCases: readonly string[]
  /** Who benefits most. */
  audience: string
  displayOrder: number
  isPublished: boolean
}
export type Service = WithIcon<ServiceRecord>

export type Currency = 'PHP' | 'USD'

export type PlanRecord = {
  id: string
  name: string
  icon: string
  category: string
  /** A price string per currency, or null for "quoted per project". */
  prices: Record<Currency, string | null>
  positioning: string
  fits: readonly string[]
  cta: string
  ctaIcon: string
  displayOrder: number
  isPublished: boolean
}
export type Plan = Omit<PlanRecord, 'icon' | 'ctaIcon'> & {
  icon: LucideIcon
  ctaIcon: LucideIcon
}

export type ProjectShot = {
  src: string
  alt: string
}

export type ProjectType = 'client-project' | 'concept-demo'

export type ProjectRecord = {
  id: string
  slug: string
  title: string
  type: ProjectType
  /** Shown in the card's category badge. */
  icon: string
  category: string
  summary: string
  /** Overview shown in the details dialog. */
  details: string
  /** The business challenge the project addresses. */
  challenge: string
  /** How the system solves it. */
  solution: string
  features: readonly string[]
  image: ProjectShot
  /** Extra screenshots shown as thumbnails under the main image in the details dialog. */
  screenshots: readonly ProjectShot[]
  /** Live site for the "Visit website" button, if there is one. */
  url: string | null
  /** Illustrative record. Never published; replace with real work. */
  isSample: boolean
  isPublished: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}
export type ShowcaseProject = WithIcon<ProjectRecord>

export type TestimonialStatus = 'pending' | 'approved'

export type TestimonialRecord = {
  id: string
  /** The client's own words. Keep to ~2–4 sentences so cards stay even. */
  quote: string
  name: string
  /** Role at the company, e.g. "Operations Manager". */
  role: string
  company: string
  /** 1–5 whole number, or null when the client gave no rating. */
  rating: number | null
  /** 1–2 letters shown in the avatar when there is no photo. */
  initials: string
  /** Illustrative record, not a client endorsement. Never published. */
  isSample: boolean
  status: TestimonialStatus
  /** Shown publicly only when also approved and not a sample. */
  isPublished: boolean
  displayOrder: number
  createdAt: string
}
export type Testimonial = TestimonialRecord

export type StepRecord = {
  id: string
  icon: string
  title: string
  description: string
  displayOrder: number
}
export type Step = WithIcon<StepRecord>

export type FaqRecord = {
  id: string
  icon: string
  /** Groups questions in the full FAQ list. */
  category: string
  question: string
  answer: string
  /** Shown in the home page FAQ section (keep to five). */
  featured: boolean
  /** Shown on the Pricing page FAQ. */
  pricingPage: boolean
  displayOrder: number
  isPublished: boolean
}
export type Faq = WithIcon<FaqRecord>

export type GalleryImageRecord = {
  id: string
  src: string
  title: string
  alt: string
  caption: string | null
  /** Illustrative image. Never published; replace with real assets. */
  isSample: boolean
  displayOrder: number
  isPublished: boolean
  createdAt: string
}

/* ---------- Inquiries ---------- */

export type InquiryStatus = 'new' | 'in-progress' | 'completed'

export type InquiryRecord = {
  id: string
  fullName: string
  email: string
  company: string | null
  projectType: string | null
  budgetRange: string | null
  details: string
  /** ISO date (YYYY-MM-DD) the client hopes to launch, if given. */
  targetLaunchDate: string | null
  status: InquiryStatus
  submittedAt: string
  /** Illustrative record, not a real inquiry. */
  isSample: boolean
}

/* ---------- SEO, legal, settings, admin navigation ---------- */

export type PageSeo = {
  path: string
  title: string
  description: string
  /** Absolute URL; null derives it from `siteUrl` + `path`. */
  canonical?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  noindex?: boolean
}

export type SeoRecord = PageSeo & { id: string }

export type LegalSection = {
  id: string
  title: string
  paragraphs: readonly string[]
  items?: readonly string[]
}

export type LegalDocument = {
  title: string
  intro: string
  /** ISO date (YYYY-MM-DD). */
  updated: string
  sections: readonly LegalSection[]
}

export type SettingsRecord = {
  inquiriesPageSize: number
}

export type AdminNavItem = {
  id: string
  label: string
  path: string
  icon: string
  description: string
}

export type AdminNavGroup = {
  id: string
  label: string
  items: readonly AdminNavItem[]
}
