// Admin CRUD endpoint: /api/admin?resource=<name>[&id=<id>]
//
// One flat handler rather than dynamic [collection] routes: the Vite dev
// plugin and Vercel both dispatch api/<name>.mjs by filename. Collections
// support GET list, GET ?id, POST, PATCH ?id, DELETE ?id and PUT (replace
// all). Documents support GET and PUT. Every request is authenticated first:
// a valid Supabase JWT at AAL2 is required, so password-only sessions cannot
// write. The service-role key stays in this function's environment.
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from './_lib/auth.mjs'
import { readJsonBody, sendEmpty, sendJson } from './_lib/http.mjs'
import { collectionMaps } from './_lib/map.mjs'
import {
  isCollectionResource,
  isDocumentResource,
  isKnownResource,
  isPlainObject,
  isRecordId,
  orderRecords,
  sanitizeDocument,
  validateRecord,
} from './_lib/rules.mjs'

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const COLLECTION_METHODS = ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
const DOCUMENT_METHODS = ['GET', 'PUT']

function createServiceClient() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function databaseError(error, context) {
  if (error.code === '23505') {
    throw new HttpError(
      409,
      'A record with this id or slug already exists.',
    )
  }
  if (error.code === '23514' || error.code === '22P02') {
    throw new HttpError(400, 'A value is outside the allowed range.')
  }
  throw new Error(`${context}: ${error.message}`)
}

function methodNotAllowed(res, allow) {
  res.setHeader('Allow', allow.join(', '))
  sendJson(res, 405, { error: 'method not allowed' })
}

function queryId(url) {
  const id = url.searchParams.get('id')
  if (!id) throw new HttpError(400, 'id is required')
  if (!isRecordId(id)) throw new HttpError(400, 'id is invalid')
  return id
}

async function readBody(req) {
  const body = await readJsonBody(req)
  if (body === undefined) throw new HttpError(400, 'a JSON body is required')
  return body
}

async function listCollection(supabase, resource) {
  const map = collectionMaps[resource]
  const { data, error } = await supabase.from(map.table).select('*')
  if (error) databaseError(error, `reading ${map.table}`)
  return orderRecords(resource, data.map(map.fromRow))
}

async function getRecord(supabase, resource, id) {
  const map = collectionMaps[resource]
  const { data, error } = await supabase
    .from(map.table)
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) databaseError(error, `reading ${map.table}`)
  if (!data) throw new HttpError(404, 'record not found')
  return map.fromRow(data)
}

async function createRecord(supabase, resource, body) {
  const map = collectionMaps[resource]
  const invalid = validateRecord(resource, body)
  if (invalid) throw new HttpError(400, invalid)

  const { data, error } = await supabase
    .from(map.table)
    .insert(map.toRow(body))
    .select('*')
    .single()
  if (error) databaseError(error, `creating ${map.table}`)
  return map.fromRow(data)
}

async function updateRecord(supabase, resource, id, body) {
  if (!isPlainObject(body)) {
    throw new HttpError(400, 'a JSON object is required')
  }
  if (body.id !== undefined && body.id !== id) {
    throw new HttpError(400, 'id cannot change')
  }
  const invalid = validateRecord(resource, body, { partial: true })
  if (invalid) throw new HttpError(400, invalid)

  const map = collectionMaps[resource]
  const row = map.toRow(body)
  delete row.id
  if (Object.keys(row).length === 0) {
    throw new HttpError(400, 'no fields to update')
  }

  const { data, error } = await supabase
    .from(map.table)
    .update(row)
    .eq('id', id)
    .select('*')
    .maybeSingle()
  if (error) databaseError(error, `updating ${map.table}`)
  if (!data) throw new HttpError(404, 'record not found')
  return map.fromRow(data)
}

async function deleteRecord(supabase, resource, id) {
  const map = collectionMaps[resource]
  const { data, error } = await supabase
    .from(map.table)
    .delete()
    .eq('id', id)
    .select('id')
  if (error) databaseError(error, `deleting ${map.table}`)
  if (!data || data.length === 0) throw new HttpError(404, 'record not found')
}

/**
 * Replace-all for reordering. Upsert first, then delete only the ids the
 * payload no longer contains: a failed write cannot empty the table.
 */
async function replaceCollection(supabase, resource, body) {
  if (!Array.isArray(body)) {
    throw new HttpError(400, 'a JSON array is required')
  }
  const ids = new Set()
  for (const record of body) {
    const invalid = validateRecord(resource, record)
    if (invalid) throw new HttpError(400, invalid)
    if (ids.has(record.id)) {
      throw new HttpError(400, `duplicate id "${record.id}"`)
    }
    ids.add(record.id)
  }

  const map = collectionMaps[resource]
  if (body.length > 0) {
    const { error } = await supabase
      .from(map.table)
      .upsert(body.map(map.toRow), { onConflict: 'id' })
    if (error) databaseError(error, `replacing ${map.table}`)
  }

  const { data: existing, error: readError } = await supabase
    .from(map.table)
    .select('id')
  if (readError) databaseError(readError, `reading ${map.table}`)

  const removed = existing
    .map((row) => row.id)
    .filter((id) => !ids.has(id))
  if (removed.length > 0) {
    const { error: deleteError } = await supabase
      .from(map.table)
      .delete()
      .in('id', removed)
    if (deleteError) databaseError(deleteError, `replacing ${map.table}`)
  }

  return listCollection(supabase, resource)
}

async function getDocument(supabase, resource) {
  const { data, error } = await supabase
    .from(resource)
    .select('value')
    .eq('key', resource)
    .maybeSingle()
  if (error) databaseError(error, `reading ${resource}`)
  if (!data) throw new HttpError(404, 'document not found')
  return data.value
}

async function saveDocument(supabase, resource, body) {
  let value
  try {
    value = sanitizeDocument(resource, body)
  } catch (error) {
    throw new HttpError(400, error.message)
  }

  const { data, error } = await supabase
    .from(resource)
    .upsert({ key: resource, value }, { onConflict: 'key' })
    .select('value')
    .maybeSingle()
  if (error) databaseError(error, `saving ${resource}`)
  if (!data) throw new Error(`saving ${resource}: no row returned`)
  return data.value
}

export default async function handler(req, res) {
  try {
    const authenticated = await requireAdmin(req, res)
    if (!authenticated) return

    const url = new URL(req.url ?? '/', 'http://localhost')
    const resource = url.searchParams.get('resource') ?? ''
    if (!isKnownResource(resource)) {
      sendJson(res, 404, { error: 'not found' })
      return
    }

    const supabase = createServiceClient()

    if (isDocumentResource(resource)) {
      if (req.method === 'GET') {
        sendJson(res, 200, await getDocument(supabase, resource))
        return
      }
      if (req.method === 'PUT') {
        const value = await saveDocument(
          supabase,
          resource,
          await readBody(req),
        )
        sendJson(res, 200, value)
        return
      }
      methodNotAllowed(res, DOCUMENT_METHODS)
      return
    }

    if (!isCollectionResource(resource)) {
      sendJson(res, 404, { error: 'not found' })
      return
    }

    if (req.method === 'GET') {
      const id = url.searchParams.get('id')
      if (id === null) {
        sendJson(res, 200, await listCollection(supabase, resource))
      } else {
        sendJson(res, 200, await getRecord(supabase, resource, queryId(url)))
      }
      return
    }

    if (req.method === 'POST') {
      const record = await createRecord(supabase, resource, await readBody(req))
      sendJson(res, 201, record)
      return
    }

    if (req.method === 'PATCH') {
      const id = queryId(url)
      const record = await updateRecord(
        supabase,
        resource,
        id,
        await readBody(req),
      )
      sendJson(res, 200, record)
      return
    }

    if (req.method === 'DELETE') {
      await deleteRecord(supabase, resource, queryId(url))
      sendEmpty(res, 204)
      return
    }

    if (req.method === 'PUT') {
      const records = await replaceCollection(
        supabase,
        resource,
        await readBody(req),
      )
      sendJson(res, 200, records)
      return
    }

    methodNotAllowed(res, COLLECTION_METHODS)
  } catch (error) {
    if (error instanceof HttpError) {
      sendJson(res, error.status, { error: error.message })
      return
    }
    if (error instanceof SyntaxError) {
      sendJson(res, 400, { error: 'body must be valid JSON' })
      return
    }
    if (
      error instanceof Error &&
      error.message === 'request body too large'
    ) {
      sendJson(res, 413, { error: 'request body too large' })
      return
    }
    console.error('admin API failed:', error)
    if (!res.headersSent) sendJson(res, 500, { error: 'admin request failed' })
  }
}
