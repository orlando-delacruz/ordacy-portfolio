// GET /api/backup — weekly JSON dump of every editable table and document.
//
// Free-tier point-in-time restore is thin, so one file per week goes to a
// private Supabase Storage bucket (`backups`), object key
// `backups/YYYY-MM-DD.json`. The bucket is created on first run and forced
// private; the newest 8 dated files are kept and older ones are deleted.
//
// Vercel sends `Authorization: Bearer <CRON_SECRET>` for cron runs, and the
// endpoint fails closed when the secret is unset. The dump uses the
// service-role key, so the file contains real inquiries (names and email
// addresses) and must stay private.
import { createClient } from '@supabase/supabase-js'
import {
  BACKUP_BUCKET,
  BACKUP_PREFIX,
  backupFileName,
  retentionPlan,
} from './_lib/backup.mjs'
import { requireCronSecret } from './_lib/cron.mjs'
import { sendJson } from './_lib/http.mjs'
import { collectionMaps } from './_lib/map.mjs'
import {
  COLLECTION_RESOURCES,
  DOCUMENT_RESOURCES,
  orderRecords,
} from './_lib/rules.mjs'

const STORAGE_TIMEOUT_MS = 30000

function config() {
  const url = process.env.SUPABASE_URL?.trim()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return { url: url.replace(/\/+$/, ''), serviceRoleKey }
}

/** Reads every editable table and the two documents into one payload. */
async function readBackup(supabase) {
  const tableEntries = await Promise.all(
    COLLECTION_RESOURCES.map(async (resource) => {
      const map = collectionMaps[resource]
      const { data, error } = await supabase.from(map.table).select('*')
      if (error) throw new Error(`reading ${map.table}: ${error.message}`)
      return [resource, orderRecords(resource, data.map(map.fromRow))]
    }),
  )

  const documentEntries = await Promise.all(
    DOCUMENT_RESOURCES.map(async (resource) => {
      const { data, error } = await supabase
        .from(resource)
        .select('value')
        .eq('key', resource)
        .maybeSingle()
      if (error) throw new Error(`reading ${resource}: ${error.message}`)
      if (!data) throw new Error(`the ${resource} document is missing`)
      return [resource, data.value]
    }),
  )

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    tables: Object.fromEntries(tableEntries),
    documents: Object.fromEntries(documentEntries),
  }
}

function storageFetch(url, serviceRoleKey, path, init = {}) {
  return fetch(`${url}/storage/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(STORAGE_TIMEOUT_MS),
  })
}

async function responseMessage(response) {
  try {
    const body = await response.json()
    return typeof body?.message === 'string' ? body.message : ''
  } catch {
    return ''
  }
}

async function responseError(response) {
  try {
    const body = await response.json()
    return {
      code: typeof body?.code === 'string' ? body.code : '',
      message: typeof body?.message === 'string' ? body.message : '',
    }
  } catch {
    return { code: '', message: '' }
  }
}

const encodeKey = (key) =>
  key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

/** Creates the private bucket when missing; keeps an existing one private. */
async function ensureBucket(url, serviceRoleKey) {
  const existing = await storageFetch(
    url,
    serviceRoleKey,
    `/bucket/${BACKUP_BUCKET}`,
  )
  if (existing.ok) {
    const bucket = await existing.json()
    if (bucket?.public === false) return

    const updated = await storageFetch(
      url,
      serviceRoleKey,
      `/bucket/${BACKUP_BUCKET}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public: false }),
      },
    )
    if (!updated.ok) {
      throw new Error(
        `making the ${BACKUP_BUCKET} bucket private failed (${updated.status})`,
      )
    }
    return
  }

  // Supabase Storage reports a missing bucket as HTTP 400 with a
  // `NoSuchBucket` body, so the stable `code` field decides, not the status.
  const missing = await responseError(existing)
  if (
    existing.status !== 404 &&
    missing.code !== 'NoSuchBucket' &&
    !/not found/i.test(missing.message)
  ) {
    throw new Error(
      `reading the ${BACKUP_BUCKET} bucket failed (${existing.status})`,
    )
  }

  const created = await storageFetch(url, serviceRoleKey, '/bucket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: BACKUP_BUCKET,
      name: BACKUP_BUCKET,
      public: false,
    }),
  })
  if (created.ok) return

  const createdMessage = await responseMessage(created)
  if (created.status === 400 && /already exists/i.test(createdMessage)) return
  throw new Error(
    `creating the ${BACKUP_BUCKET} bucket failed (${created.status})`,
  )
}

async function uploadBackup(url, serviceRoleKey, key, payload) {
  const response = await storageFetch(
    url,
    serviceRoleKey,
    `/object/${BACKUP_BUCKET}/${encodeKey(key)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body: JSON.stringify(payload),
    },
  )
  if (!response.ok) {
    throw new Error(`uploading ${key} failed (${response.status})`)
  }
}

/** Storage list names are relative to the prefix; accept either form. */
async function listBackups(url, serviceRoleKey) {
  const response = await storageFetch(
    url,
    serviceRoleKey,
    `/object/list/${BACKUP_BUCKET}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prefix: BACKUP_PREFIX,
        limit: 1000,
        sortBy: { column: 'name', order: 'desc' },
      }),
    },
  )
  if (!response.ok) {
    throw new Error(`listing backups failed (${response.status})`)
  }
  const items = await response.json()
  if (!Array.isArray(items)) {
    throw new Error('listing backups returned an unexpected body')
  }
  return items
    .map((item) => item?.name)
    .filter((name) => typeof name === 'string')
}

async function deleteBackups(url, serviceRoleKey, keys) {
  const removed = []
  for (const key of keys) {
    const response = await storageFetch(
      url,
      serviceRoleKey,
      `/object/${BACKUP_BUCKET}/${encodeKey(key)}`,
      { method: 'DELETE' },
    )
    if (!response.ok) {
      throw new Error(`deleting ${key} failed (${response.status})`)
    }
    removed.push(key)
  }
  return removed
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    sendJson(res, 405, { error: 'method not allowed' })
    return
  }

  if (!requireCronSecret(req, res)) return

  try {
    const { url, serviceRoleKey } = config()
    const supabase = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const payload = await readBackup(supabase)
    await ensureBucket(url, serviceRoleKey)

    const file = backupFileName(new Date())
    await uploadBackup(url, serviceRoleKey, file, payload)

    const names = await listBackups(url, serviceRoleKey)
    const removed = await deleteBackups(
      url,
      serviceRoleKey,
      retentionPlan(names),
    )

    sendJson(res, 200, {
      ok: true,
      file,
      counts: Object.fromEntries(
        Object.entries(payload.tables).map(([name, rows]) => [
          name,
          rows.length,
        ]),
      ),
      removed,
    })
  } catch (error) {
    console.error('GET /api/backup failed:', error)
    sendJson(res, 500, { error: 'backup failed' })
  }
}
