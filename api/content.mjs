// GET /api/content — every published, editable record in one cached payload.
//
// Plain Node ESM with req/res only: the same handler runs as a Vercel
// function and inside the Vite dev server (scripts/api-dev.mjs), so it must
// not depend on Next-style helpers. The service-role key stays server-side.
import { createClient } from '@supabase/supabase-js'
import {
  mapFaq,
  mapGalleryImage,
  mapPage,
  mapPlan,
  mapProject,
  mapSeo,
  mapService,
  mapTeamMember,
  mapTestimonial,
} from './_lib/map.mjs'

const CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=86400'

function sendJson(res, statusCode, body, cacheControl = 'no-store') {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', cacheControl)
  res.end(JSON.stringify(body))
}

function unwrap(results) {
  for (const [table, result] of Object.entries(results)) {
    if (result.error) {
      throw new Error(`reading ${table}: ${result.error.message}`)
    }
  }
}

async function readContent(supabase) {
  const [pages, services, plans, faqs, projects, testimonials, team, gallery, seo, site] =
    await Promise.all([
      supabase.from('pages').select('*').order('id'),
      supabase
        .from('services')
        .select('*')
        .eq('is_published', true)
        .order('display_order'),
      supabase
        .from('plans')
        .select('*')
        .eq('is_published', true)
        .order('display_order'),
      supabase
        .from('faqs')
        .select('*')
        .eq('is_published', true)
        .order('display_order'),
      supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('display_order'),
      supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .eq('is_published', true)
        .order('display_order'),
      supabase
        .from('team')
        .select('*')
        .eq('is_published', true)
        .order('display_order'),
      supabase
        .from('gallery')
        .select('*')
        .eq('is_published', true)
        .order('display_order'),
      supabase.from('seo').select('*').order('id'),
      supabase.from('site').select('value').eq('key', 'site').maybeSingle(),
    ])

  unwrap({ pages, services, plans, faqs, projects, testimonials, team, gallery, seo, site })
  if (!site.data) throw new Error('the site document is missing')

  const seoRows = seo.data.map(mapSeo)

  return {
    site: site.data.value,
    pages: pages.data.map(mapPage),
    services: services.data.map(mapService),
    plans: plans.data.map(mapPlan),
    faqs: faqs.data.map(mapFaq),
    projects: projects.data.map(mapProject),
    testimonials: testimonials.data.map(mapTestimonial),
    team: team.data.map(mapTeamMember),
    gallery: gallery.data.map(mapGalleryImage),
    seo: Object.fromEntries(
      seoRows.map(({ id, ...page }) => [id, page]),
    ),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    sendJson(res, 405, { error: 'method not allowed' })
    return
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const content = await readContent(supabase)

    sendJson(res, 200, content, CACHE_CONTROL)
  } catch (error) {
    console.error('GET /api/content failed:', error)
    sendJson(res, 500, { error: 'content unavailable' })
  }
}
