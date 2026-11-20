// Postgres rows (snake_case) -> the app's camelCase records in
// src/data/types.ts. This is the reverse of scripts/seed-supabase.mjs; keep
// both in step. A renamed column must fail review, not disappear silently.

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
