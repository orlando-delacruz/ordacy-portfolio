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

export type ProfileStats = {
  views: string
  projects: string
  likes: string
}

export type SiteRecord = {
  name: string
  tagline: string
  description: string
  siteUrl: string
  siteUrlPending: boolean
  footerTagline: string
  /** Profile stats shown in the homepage hero; edited in Settings. */
  profileStats: ProfileStats
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

/** Copy the About-style mobile layout uses instead of the desktop text. */
export type PageSectionMobile = {
  eyebrow: string
  title: string
  description: string
}

export type PageCtaAction = {
  label: string
  to: string
  icon: string
}

export type PageCta = {
  eyebrow: string
  title: string
  description: string
  actions: readonly PageCtaAction[]
}

/** CTA action with its Lucide icon resolved by the data layer. */
export type CtaAction = {
  label: string
  to: string
  icon: LucideIcon
}

/** Runtime CTA copy shared by sections and legal documents. */
export type ClosingCtaData = {
  eyebrow: string | null
  title: string
  description: string | null
  actions: readonly CtaAction[]
}

export type PageSectionRecord = {
  id: string
  /** Admin-facing name for the block. */
  label: string
  eyebrow: string | null
  title: string
  description: string | null
  /** Closing CTA buttons; present only on the section that renders a banner. */
  actions?: readonly PageCtaAction[] | null
  /** Optional mobile-only heading copy. */
  mobile?: PageSectionMobile | null
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
  /** One-line preview shown in the problem list. */
  summary: string
  /** Shorter preview used by the mobile problem list. */
  mobileSummary: string
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
  status: TestimonialStatus
  /** Shown publicly only when also approved. */
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
  displayOrder: number
  isPublished: boolean
  createdAt: string
}

/* ---------- Team ---------- */

export type TeamAvatar = {
  src: string
  /** Dark-theme photo; falls back to `src` when absent (older saved records). */
  darkSrc?: string
  alt: string
}

export type TeamFact = {
  label: string
  value: string
}

export type TeamExperienceRecord = {
  role: string
  organization: string
  period: string
  summary: string
}

export type TeamEducationRecord = {
  credential: string
  school: string
  period: string
  details: string
}

export type TeamCertificationRecord = {
  name: string
  issuer: string
  year: string
}

/** A labelled group of skills; labels are content, so they live in data. */
export type TeamSkillGroup = {
  label: string
  items: readonly string[]
}

export type TeamMemberRecord = {
  id: string
  slug: string
  name: string
  role: string
  initials: string
  avatar: TeamAvatar | null
  /** Optional PDF resume; shows a Resume button beside Contact. */
  resumeUrl?: string | null
  /** One-sentence hero bio and meta description. */
  headline: string
  /** Longer resume summary. */
  summary: string
  /** Optional hero stats. When empty, counts are derived from section content. */
  facts: readonly TeamFact[]
  skills: readonly string[]
  /** Optional grouped stack; when present it replaces `skills` on the resume. */
  skillGroups?: readonly TeamSkillGroup[]
  experience: readonly TeamExperienceRecord[]
  education: readonly TeamEducationRecord[]
  certifications: readonly TeamCertificationRecord[]
  languages: readonly string[]
  displayOrder: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type TeamMember = TeamMemberRecord

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

/* ---------- Public page states ---------- */

export type PageStateKey =
  | 'home'
  | 'projects'
  | 'pricing'
  | 'faqs'
  | 'testimonials'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'team-profile'

export type PageStateActionRecord = {
  label: string
  to: string
  icon: string
}

export type PageStateCopyRecord = {
  title: string
  description: string
  actions: readonly PageStateActionRecord[]
}

export type PageStatesRecord = {
  shared: {
    error: PageStateCopyRecord
    submitError: PageStateCopyRecord
  }
  pages: Record<
    PageStateKey,
    { empty: PageStateCopyRecord; success?: PageStateCopyRecord }
  >
}

export type LegalSection = {
  id: string
  title: string
  /** Short 2-word label for the table of contents. */
  tocLabel: string
  paragraphs: readonly string[]
  items?: readonly string[]
}

export type LegalDocumentRecord = {
  title: string
  intro: string
  /** Short 5–6 word hero description; the full intro stays in the body. */
  heroDescription: string
  /** ISO date (YYYY-MM-DD). */
  updated: string
  sections: readonly LegalSection[]
  cta: PageCta
}

export type LegalDocument = Omit<LegalDocumentRecord, 'cta'> & {
  cta: ClosingCtaData
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
