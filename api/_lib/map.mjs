// Postgres rows (snake_case) <-> the app's camelCase records in
// src/data/types.ts. This is the reverse of scripts/seed-supabase.mjs; keep
// all three in step. A renamed column must fail review, not disappear
// silently.
//
// `map*` reads rows for the public content endpoint. `to*Row` writes admin
// payloads; undefined keys are omitted so PATCH can update a subset.

/** Drops undefined keys so a PATCH never clears columns it did not mention. */
const toRow = (columns, record) =>
  Object.fromEntries(
    Object.entries(columns)
      .filter(([key]) => record[key] !== undefined)
      .map(([key, column]) => [column, record[key]]),
  )

export const mapPage = (row) => ({
  id: row.id,
  label: row.label,
  path: row.path,
  header: row.header ?? null,
  sections: row.sections,
})

export const mapService = (row) => ({
  id: row.id,
  icon: row.icon,
  title: row.title,
  description: row.description,
  problem: row.problem,
  capabilities: row.capabilities,
  useCases: row.use_cases,
  audience: row.audience,
  displayOrder: row.display_order,
  isPublished: row.is_published,
})

export const mapPlan = (row) => ({
  id: row.id,
  name: row.name,
  icon: row.icon,
  category: row.category,
  prices: row.prices,
  positioning: row.positioning,
  fits: row.fits,
  cta: row.cta,
  ctaIcon: row.cta_icon,
  displayOrder: row.display_order,
  isPublished: row.is_published,
})

export const mapFaq = (row) => ({
  id: row.id,
  icon: row.icon,
  category: row.category,
  question: row.question,
  answer: row.answer,
  featured: row.featured,
  pricingPage: row.pricing_page,
  displayOrder: row.display_order,
  isPublished: row.is_published,
})

export const mapProject = (row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  type: row.type,
  icon: row.icon,
  category: row.category,
  summary: row.summary,
  details: row.details,
  challenge: row.challenge,
  solution: row.solution,
  features: row.features,
  image: row.image,
  screenshots: row.screenshots,
  url: row.url ?? null,
  isPublished: row.is_published,
  displayOrder: row.display_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapTestimonial = (row) => ({
  id: row.id,
  quote: row.quote,
  name: row.name,
  role: row.role,
  company: row.company,
  rating: row.rating,
  initials: row.initials,
  status: row.status,
  isPublished: row.is_published,
  displayOrder: row.display_order,
  createdAt: row.created_at,
})

export const mapTeamMember = (row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  role: row.role,
  initials: row.initials,
  avatar: row.avatar ?? null,
  resumeUrl: row.resume_url ?? null,
  headline: row.headline,
  summary: row.summary,
  facts: row.facts,
  skills: row.skills,
  skillGroups: row.skill_groups ?? null,
  experience: row.experience,
  education: row.education,
  certifications: row.certifications,
  languages: row.languages,
  displayOrder: row.display_order,
  isPublished: row.is_published,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapGalleryImage = (row) => ({
  id: row.id,
  src: row.src,
  title: row.title,
  alt: row.alt,
  caption: row.caption ?? null,
  displayOrder: row.display_order,
  isPublished: row.is_published,
  createdAt: row.created_at,
})

/** SeoRecord (PageSeo + id); the endpoint drops the id after keying. */
export const mapSeo = (row) => ({
  id: row.id,
  path: row.path,
  title: row.title,
  description: row.description,
  canonical: row.canonical ?? null,
  ogTitle: row.og_title ?? null,
  ogDescription: row.og_description ?? null,
  ogImage: row.og_image ?? null,
  noindex: row.noindex ?? false,
})

export const mapInquiry = (row) => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  company: row.company ?? null,
  projectType: row.project_type ?? null,
  budgetRange: row.budget_range ?? null,
  details: row.details,
  targetLaunchDate: row.target_launch_date ?? null,
  status: row.status,
  submittedAt: row.submitted_at,
})

/* ---------- Writes: camelCase records -> Postgres rows ---------- */

const PAGE_COLUMNS = {
  id: 'id',
  label: 'label',
  path: 'path',
  header: 'header',
  sections: 'sections',
}

const SERVICE_COLUMNS = {
  id: 'id',
  icon: 'icon',
  title: 'title',
  description: 'description',
  problem: 'problem',
  capabilities: 'capabilities',
  useCases: 'use_cases',
  audience: 'audience',
  displayOrder: 'display_order',
  isPublished: 'is_published',
}

const PLAN_COLUMNS = {
  id: 'id',
  name: 'name',
  icon: 'icon',
  category: 'category',
  prices: 'prices',
  positioning: 'positioning',
  fits: 'fits',
  cta: 'cta',
  ctaIcon: 'cta_icon',
  displayOrder: 'display_order',
  isPublished: 'is_published',
}

const FAQ_COLUMNS = {
  id: 'id',
  icon: 'icon',
  category: 'category',
  question: 'question',
  answer: 'answer',
  featured: 'featured',
  pricingPage: 'pricing_page',
  displayOrder: 'display_order',
  isPublished: 'is_published',
}

const PROJECT_COLUMNS = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  type: 'type',
  icon: 'icon',
  category: 'category',
  summary: 'summary',
  details: 'details',
  challenge: 'challenge',
  solution: 'solution',
  features: 'features',
  image: 'image',
  screenshots: 'screenshots',
  url: 'url',
  isPublished: 'is_published',
  displayOrder: 'display_order',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}

const TESTIMONIAL_COLUMNS = {
  id: 'id',
  quote: 'quote',
  name: 'name',
  role: 'role',
  company: 'company',
  rating: 'rating',
  initials: 'initials',
  status: 'status',
  isPublished: 'is_published',
  displayOrder: 'display_order',
  createdAt: 'created_at',
}

const TEAM_COLUMNS = {
  id: 'id',
  slug: 'slug',
  name: 'name',
  role: 'role',
  initials: 'initials',
  avatar: 'avatar',
  resumeUrl: 'resume_url',
  headline: 'headline',
  summary: 'summary',
  facts: 'facts',
  skills: 'skills',
  skillGroups: 'skill_groups',
  experience: 'experience',
  education: 'education',
  certifications: 'certifications',
  languages: 'languages',
  displayOrder: 'display_order',
  isPublished: 'is_published',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}

const GALLERY_COLUMNS = {
  id: 'id',
  src: 'src',
  title: 'title',
  alt: 'alt',
  caption: 'caption',
  displayOrder: 'display_order',
  isPublished: 'is_published',
  createdAt: 'created_at',
}

const INQUIRY_COLUMNS = {
  id: 'id',
  fullName: 'full_name',
  email: 'email',
  company: 'company',
  projectType: 'project_type',
  budgetRange: 'budget_range',
  details: 'details',
  targetLaunchDate: 'target_launch_date',
  status: 'status',
  submittedAt: 'submitted_at',
}

const SEO_COLUMNS = {
  id: 'id',
  path: 'path',
  title: 'title',
  description: 'description',
  canonical: 'canonical',
  ogTitle: 'og_title',
  ogDescription: 'og_description',
  ogImage: 'og_image',
  noindex: 'noindex',
}

export const toPageRow = (record) => toRow(PAGE_COLUMNS, record)
export const toServiceRow = (record) => toRow(SERVICE_COLUMNS, record)
export const toPlanRow = (record) => toRow(PLAN_COLUMNS, record)
export const toFaqRow = (record) => toRow(FAQ_COLUMNS, record)
export const toProjectRow = (record) => toRow(PROJECT_COLUMNS, record)
export const toTestimonialRow = (record) =>
  toRow(TESTIMONIAL_COLUMNS, record)
export const toTeamMemberRow = (record) => toRow(TEAM_COLUMNS, record)
export const toGalleryImageRow = (record) => toRow(GALLERY_COLUMNS, record)
export const toInquiryRow = (record) => toRow(INQUIRY_COLUMNS, record)
export const toSeoRow = (record) => toRow(SEO_COLUMNS, record)

/** The one collection registry used by the admin endpoint and its tests. */
export const collectionMaps = {
  pages: { table: 'pages', fromRow: mapPage, toRow: toPageRow },
  services: { table: 'services', fromRow: mapService, toRow: toServiceRow },
  plans: { table: 'plans', fromRow: mapPlan, toRow: toPlanRow },
  faqs: { table: 'faqs', fromRow: mapFaq, toRow: toFaqRow },
  projects: {
    table: 'projects',
    fromRow: mapProject,
    toRow: toProjectRow,
  },
  testimonials: {
    table: 'testimonials',
    fromRow: mapTestimonial,
    toRow: toTestimonialRow,
  },
  team: { table: 'team', fromRow: mapTeamMember, toRow: toTeamMemberRow },
  gallery: {
    table: 'gallery',
    fromRow: mapGalleryImage,
    toRow: toGalleryImageRow,
  },
  inquiries: {
    table: 'inquiries',
    fromRow: mapInquiry,
    toRow: toInquiryRow,
  },
  seo: { table: 'seo', fromRow: mapSeo, toRow: toSeoRow },
}
