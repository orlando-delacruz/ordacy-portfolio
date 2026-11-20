// Seeds Supabase from the JSON files in data/database.
//
// DESTRUCTIVE BY DESIGN: this deletes every row in pages, services, plans,
// faqs, projects, testimonials, team, gallery, inquiries, seo, site and
// settings, then inserts the JSON seed. Run it only to (re)initialize a
// database from data/database. It is not a sync tool: content edited in the
// admin after seeding is lost, and real contact inquiries (leads) are
// deleted. Export them before re-running.
//
// Usage:
//   node --env-file=.env.local scripts/seed-supabase.mjs
//   node scripts/seed-supabase.mjs --dry-run
//
// Env (see .env.example): VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
// The service-role key bypasses RLS; keep it server-side and in .env.local.
//
// Each table is cleared and refilled with separate requests, with no
// cross-table transaction. If a run fails midway, fix the cause and run the
// whole script again. Errors stop the run and set a non-zero exit code.

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const readJson = (file) =>
  JSON.parse(readFileSync(join(ROOT, 'data', 'database', file), 'utf8'))

/*
 * One target per table. `rows` maps the JSON source to the row shape with
 * explicit camelCase -> snake_case names (no reflection); a missing or
 * renamed field must fail review, not disappear silently. Nested objects and
 * arrays of objects stay inside jsonb columns; string arrays become text[].
 * Source records: src/data/types.ts.
 */
const targets = [
  {
    table: 'pages',
    file: 'pages.json',
    key: 'id',
    // PageRecord
    rows: (pages) =>
      pages.map((page) => ({
        id: page.id,
        label: page.label,
        path: page.path,
        header: page.header ?? null,
        sections: page.sections,
      })),
  },
  {
    table: 'services',
    file: 'services.json',
    key: 'id',
    // ServiceRecord
    rows: (services) =>
      services.map((service) => ({
        id: service.id,
        icon: service.icon,
        title: service.title,
        description: service.description,
        problem: service.problem,
        capabilities: service.capabilities,
        use_cases: service.useCases,
        audience: service.audience,
        display_order: service.displayOrder,
        is_published: service.isPublished,
      })),
  },
  {
    table: 'plans',
    file: 'plans.json',
    key: 'id',
    // PlanRecord
    rows: (plans) =>
      plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        icon: plan.icon,
        category: plan.category,
        prices: plan.prices,
        positioning: plan.positioning,
        fits: plan.fits,
        cta: plan.cta,
        cta_icon: plan.ctaIcon,
        display_order: plan.displayOrder,
        is_published: plan.isPublished,
      })),
  },
  {
    table: 'faqs',
    file: 'faqs.json',
    key: 'id',
    // FaqRecord
    rows: (faqs) =>
      faqs.map((faq) => ({
        id: faq.id,
        icon: faq.icon,
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        featured: faq.featured,
        pricing_page: faq.pricingPage,
        display_order: faq.displayOrder,
        is_published: faq.isPublished,
      })),
  },
  {
    table: 'projects',
    file: 'projects.json',
    key: 'id',
    // ProjectRecord (the `type` field is kept by design)
    rows: (projects) =>
      projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        type: project.type,
        icon: project.icon,
        category: project.category,
        summary: project.summary,
        details: project.details,
        challenge: project.challenge,
        solution: project.solution,
        features: project.features,
        image: project.image,
        screenshots: project.screenshots,
        url: project.url ?? null,
        is_published: project.isPublished,
        display_order: project.displayOrder,
        created_at: project.createdAt,
        updated_at: project.updatedAt,
      })),
  },
  {
    table: 'testimonials',
    file: 'testimonials.json',
    key: 'id',
    // TestimonialRecord
    rows: (testimonials) =>
      testimonials.map((testimonial) => ({
        id: testimonial.id,
        quote: testimonial.quote,
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        rating: testimonial.rating ?? null,
        initials: testimonial.initials,
        status: testimonial.status,
        is_published: testimonial.isPublished,
        display_order: testimonial.displayOrder,
        created_at: testimonial.createdAt,
      })),
  },
  {
    table: 'team',
    file: 'team.json',
    key: 'id',
    // TeamMemberRecord
    rows: (team) =>
      team.map((member) => ({
        id: member.id,
        slug: member.slug,
        name: member.name,
        role: member.role,
        initials: member.initials,
        avatar: member.avatar ?? null,
        resume_url: member.resumeUrl ?? null,
        headline: member.headline,
        summary: member.summary,
        facts: member.facts,
        skills: member.skills,
        skill_groups: member.skillGroups ?? null,
        experience: member.experience,
        education: member.education,
        certifications: member.certifications,
        languages: member.languages,
        display_order: member.displayOrder,
        is_published: member.isPublished,
        created_at: member.createdAt,
        updated_at: member.updatedAt,
      })),
  },
  {
    table: 'gallery',
    file: 'gallery.json',
    key: 'id',
    // GalleryImageRecord
    rows: (gallery) =>
      gallery.map((image) => ({
        id: image.id,
        src: image.src,
        title: image.title,
        alt: image.alt,
        caption: image.caption ?? null,
        display_order: image.displayOrder,
        is_published: image.isPublished,
        created_at: image.createdAt,
      })),
  },
  {
    table: 'inquiries',
    file: 'inquiries.json',
    key: 'id',
    // InquiryRecord
    rows: (inquiries) =>
      inquiries.map((inquiry) => ({
        id: inquiry.id,
        full_name: inquiry.fullName,
        email: inquiry.email,
        company: inquiry.company ?? null,
        project_type: inquiry.projectType ?? null,
        budget_range: inquiry.budgetRange ?? null,
        details: inquiry.details,
        target_launch_date: inquiry.targetLaunchDate ?? null,
        status: inquiry.status,
        submitted_at: inquiry.submittedAt,
      })),
  },
  {
    table: 'seo',
    file: 'seo.json',
    key: 'id',
    // seo.json is keyed by id; each value is a PageSeo.
    rows: (seo) =>
      Object.entries(seo).map(([id, page]) => ({
        id,
        path: page.path,
        title: page.title,
        description: page.description,
        canonical: page.canonical ?? null,
        og_title: page.ogTitle ?? null,
        og_description: page.ogDescription ?? null,
        og_image: page.ogImage ?? null,
        noindex: page.noindex ?? false,
      })),
  },
  {
    table: 'site',
    file: 'site.json',
    key: 'key',
    // SiteRecord document. `_note` is a JSON comment, not part of the record,
    // so the document is rebuilt field by field.
    rows: (site) => [
      {
        key: 'site',
        value: {
          name: site.name,
          tagline: site.tagline,
          description: site.description,
          siteUrl: site.siteUrl,
          siteUrlPending: site.siteUrlPending,
          footerTagline: site.footerTagline,
          profileStats: site.profileStats,
          contact: site.contact,
          markets: site.markets,
        },
      },
    ],
  },
  {
    table: 'settings',
    file: 'settings.json',
    key: 'key',
    // SettingsRecord document.
    rows: (settings) => [
      {
        key: 'settings',
        value: {
          inquiriesPageSize: settings.inquiriesPageSize,
        },
      },
    ],
  },
]

const rowsFor = (target) => target.rows(readJson(target.file))

const rowLabel = (count) => `${count} row${count === 1 ? '' : 's'}`

function printDryRun() {
  console.log('Dry run: no network, no database changes.')
  console.log('')
  let total = 0
  for (const target of targets) {
    const rows = rowsFor(target)
    total += rows.length
    console.log(`${target.table}: ${rowLabel(rows.length)}`)
    if (rows.length === 0) {
      console.log('  (empty)')
    } else {
      const first = JSON.stringify(rows[0], null, 2).replace(/\n/g, '\n  ')
      console.log(`  first row: ${first}`)
    }
    console.log('')
  }
  console.log(`Total: ${rowLabel(total)} across ${targets.length} tables.`)
}

async function seed() {
  const url = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    console.error(
      'Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.',
    )
    console.error(
      'Run: node --env-file=.env.local scripts/seed-supabase.mjs',
    )
    process.exit(1)
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  console.log('Seeding Supabase from data/database (destructive).')
  let total = 0
  for (const target of targets) {
    const rows = rowsFor(target)

    // PostgREST can reject an unfiltered DELETE; `not is null` matches every
    // row because the primary key is never null.
    const { error: deleteError } = await supabase
      .from(target.table)
      .delete()
      .not(target.key, 'is', null)
    if (deleteError) {
      throw new Error(`clearing ${target.table}: ${deleteError.message}`)
    }

    if (rows.length > 0) {
      const { error: insertError } = await supabase
        .from(target.table)
        .insert(rows)
      if (insertError) {
        throw new Error(`inserting into ${target.table}: ${insertError.message}`)
      }
    }

    // Confirm the table now holds exactly what was inserted.
    const { count, error: countError } = await supabase
      .from(target.table)
      .select('*', { count: 'exact', head: true })
    if (countError) {
      throw new Error(`counting ${target.table}: ${countError.message}`)
    }
    if (count !== rows.length) {
      throw new Error(
        `${target.table}: expected ${rows.length} rows after insert, found ${count}`,
      )
    }

    total += rows.length
    console.log(`${target.table}: ${rowLabel(rows.length)}`)
  }
  console.log(`Done: ${rowLabel(total)} across ${targets.length} tables.`)
}

const args = process.argv.slice(2)
const unknown = args.filter((arg) => arg !== '--dry-run')
if (unknown.length > 0) {
  console.error(`Unknown argument: ${unknown[0]}`)
  console.error('Usage: node scripts/seed-supabase.mjs [--dry-run]')
  process.exit(1)
}

if (args.includes('--dry-run')) {
  printDryRun()
} else {
  seed().catch((error) => {
    console.error(`Seed failed: ${error.message}`)
    process.exitCode = 1
  })
}
