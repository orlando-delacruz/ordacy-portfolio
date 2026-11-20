// POST /api/inquiries — the public contact form.
//
// Plain Node ESM with req/res, like api/content.mjs and api/admin.mjs. The
// inquiry row is written before EmailJS is called; an email failure is logged
// with the inquiry id and never fails the visitor's submission. The EmailJS
// private key stays in this function's environment.
//
// Spam protection: a hidden `website` field (201 without writing), plus a
// salted SHA-256 of the client IP in `inquiry_throttle` (three per 15
// minutes). Raw IP addresses are never stored or logged.
import { createClient } from '@supabase/supabase-js'
import { readJsonBody, sendJson } from './_lib/http.mjs'
import {
  clientIp,
  emailNotification,
  hashIp,
  processInquiry,
  throttleDecision,
} from './_lib/inquiries.mjs'
import { toInquiryRow } from './_lib/map.mjs'

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'
const EMAIL_TIMEOUT_MS = 8000

let serviceClient

function getServiceClient() {
  if (serviceClient) return serviceClient
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  serviceClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return serviceClient
}

/* ---------- Database side effects ---------- */

async function findInquiry(id) {
  const { data, error } = await getServiceClient()
    .from('inquiries')
    .select('id')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`reading inquiries: ${error.message}`)
  return data !== null
}

/** Returns false only for a duplicate id (the idempotent race). */
async function insertInquiry(record) {
  const { error } = await getServiceClient()
    .from('inquiries')
    .insert(toInquiryRow(record))
  if (!error) return true
  if (error.code === '23505') return false
  throw new Error(`saving inquiry: ${error.message}`)
}

// Read, decide, write. Two simultaneous requests from one address can
// undercount by one; that is acceptable for contact-form spam control.
// shortcut: read-then-write throttle can undercount concurrent requests;
// replace with an atomic SQL increment if abuse appears.
async function consumeThrottle(ipHash, now) {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('inquiry_throttle')
    .select('window_start, request_count')
    .eq('ip_hash', ipHash)
    .maybeSingle()
  if (error) throw new Error(`reading inquiry_throttle: ${error.message}`)

  const decision = throttleDecision(data, now)
  if (!decision.allowed) return decision

  const { error: writeError } = await supabase
    .from('inquiry_throttle')
    .upsert(
      {
        ip_hash: ipHash,
        window_start: decision.windowStart,
        request_count: decision.count,
      },
      { onConflict: 'ip_hash' },
    )
  if (writeError) {
    // Fail closed: without a working throttle, do not add a row.
    throw new Error(`writing inquiry_throttle: ${writeError.message}`)
  }
  return decision
}

/* ---------- EmailJS ---------- */

function emailConfig() {
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim()
  const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim()
  const publicKey = process.env.EMAILJS_PUBLIC_KEY?.trim()
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim()
  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error('EmailJS is not configured')
  }
  return { serviceId, templateId, publicKey, privateKey }
}

async function sendNotification(record) {
  const response = await fetch(EMAILJS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailNotification(record, emailConfig())),
    signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(
      `EmailJS responded ${response.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`,
    )
  }
}

/* ---------- Handler ---------- */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    sendJson(res, 405, { error: 'method not allowed' })
    return
  }

  // Fail closed: the throttle cannot run without its salt, and running
  // without it would store reversible IP hashes.
  const salt = process.env.INQUIRY_IP_SALT?.trim()
  if (!salt) {
    console.error('POST /api/inquiries failed: INQUIRY_IP_SALT is not set')
    sendJson(res, 500, { error: 'inquiry service is not configured' })
    return
  }

  try {
    const now = new Date()
    const body = await readJsonBody(req)
    const ip = clientIp(
      req.headers?.['x-forwarded-for'],
      req.socket?.remoteAddress,
    )

    const result = await processInquiry({
      body,
      ip,
      now,
      deps: {
        findInquiry,
        insertInquiry,
        consumeThrottle: (address) =>
          consumeThrottle(hashIp(address, salt), now),
        sendNotification,
        logEmailFailure: (id, error) =>
          console.error(`inquiry ${id}: email notification failed`, error),
      },
    })

    sendJson(res, result.status, result.body)
  } catch (error) {
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
    console.error('POST /api/inquiries failed:', error)
    sendJson(res, 500, { error: 'inquiry request failed' })
  }
}
