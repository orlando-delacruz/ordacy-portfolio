// GET /api/keepalive — daily cron ping for the free Supabase project.
//
// Free projects pause after about seven days without database activity; one
// real table read per day resets that timer. Vercel sends `Authorization:
// Bearer <CRON_SECRET>` for cron runs, so the endpoint cannot be triggered by
// strangers when the secret is set, and fails closed when it is not.
//
// The ping reads one row through PostgREST with the service role (server
// only): a 200 proves the database answered, and the body is discarded. The
// anon key is deliberately not used — this project's RLS grants it nothing,
// so a rejected request would only prove the gateway answered, not Postgres.
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
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    if (!url || !serviceRoleKey) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
    }

    const response = await fetch(
      `${url.replace(/\/+$/, '')}/rest/v1/pages?select=id&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        signal: AbortSignal.timeout(KEEPALIVE_TIMEOUT_MS),
      },
    )
    if (!response.ok) {
      throw new Error(`Supabase responded ${response.status}`)
    }
    // Consume and discard the single row; the request itself is the signal.
    await response.text()

    sendEmpty(res, 204)
  } catch (error) {
    console.error('GET /api/keepalive failed:', error)
    sendJson(res, 500, { error: 'keepalive failed' })
  }
}
