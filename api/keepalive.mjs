// GET /api/keepalive — daily cron ping for the free Supabase project.
//
// Free projects pause after about seven days without activity; one request
// per day resets that timer. Vercel sends `Authorization: Bearer
// <CRON_SECRET>` for cron runs, so the endpoint cannot be triggered by
// strangers when the secret is set, and fails closed when it is not.
//
// The ping uses the anon key against PostgREST's root. Any request counts as
// activity, and RLS denies the anon role every table in this project, so the
// ping can neither read nor change content.
import { requireCronSecret } from './_lib/cron.mjs'
import { sendEmpty, sendJson } from './_lib/http.mjs'

const KEEPALIVE_TIMEOUT_MS = 10000

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    sendJson(res, 405, { error: 'method not allowed' })
    return
  }

  if (!requireCronSecret(req, res)) return

  try {
    const url = process.env.SUPABASE_URL?.trim()
    const anonKey = process.env.SUPABASE_ANON_KEY?.trim()
    if (!url || !anonKey) {
      throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY is not set')
    }

    const response = await fetch(
      `${url.replace(/\/+$/, '')}/rest/v1/?select=count&limit=1`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
        signal: AbortSignal.timeout(KEEPALIVE_TIMEOUT_MS),
      },
    )
    // RLS grants the anon role nothing in this project, so PostgREST answers
    // 401 even though the request reached the project. The ping only needs
    // that activity; 2xx is equally fine. Other statuses mean something is
    // wrong with the deployment and should fail the cron loudly.
    if (!response.ok && response.status !== 401 && response.status !== 403) {
      throw new Error(`Supabase responded ${response.status}`)
    }

    sendEmpty(res, 204)
  } catch (error) {
    console.error('GET /api/keepalive failed:', error)
    sendJson(res, 500, { error: 'keepalive failed' })
  }
}
