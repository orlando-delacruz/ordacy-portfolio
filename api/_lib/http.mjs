// Tiny request/response helpers for the plain Node function handlers.

const MAX_BODY_BYTES = 2 * 1024 * 1024

export function sendJson(res, statusCode, body, cacheControl = 'no-store') {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', cacheControl)
  res.end(JSON.stringify(body))
}

export function sendEmpty(res, statusCode) {
  res.statusCode = statusCode
  res.setHeader('Cache-Control', 'no-store')
  res.end()
}

/**
 * Reads a JSON body from either Vercel's parsed `req.body` or the raw Node
 * stream used by the dev plugin. Returns undefined for an empty body.
 */
export async function readJsonBody(req) {
  if (req.body !== undefined) {
    if (req.body === null || req.body === '') return undefined
    if (typeof req.body === 'string') return JSON.parse(req.body)
    if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8'))
    return req.body
  }

  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) {
      throw new Error('request body too large')
    }
    chunks.push(chunk)
  }
  if (chunks.length === 0) return undefined
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}
