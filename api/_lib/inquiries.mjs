// Pure rules for the public contact endpoint (`POST /api/inquiries`).
//
// Kept separate from the handler so `node --test` can exercise validation,
// the honeypot, the throttle window, idempotent ids, and the
// save-before-email order without a server, network, database, or secrets.
//
// The visitor submits the public form fields; the stored record is an
// InquiryRecord (src/data/types.ts) and the email template uses snake_case
// variables. `emailNotification` is the exact EmailJS REST body.

import { createHash, randomUUID } from 'node:crypto'
import { isPlainObject } from './rules.mjs'

export const THROTTLE_LIMIT = 3
export const THROTTLE_WINDOW_MS = 15 * 60 * 1000

const NAME_MIN = 2
const NAME_MAX = 120
const EMAIL_MAX = 200
const MESSAGE_MIN = 10
const MESSAGE_MAX = 5000
const OPTIONAL_MAX = {
  business: 120,
  service: 120,
  plan: 160,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const INQUIRY_ID_PATTERN = /^inquiry-[A-Za-z0-9][A-Za-z0-9._-]*$/

/** A client-supplied draft id: `inquiry-` plus a generated suffix. */
export const isInquiryId = (value) =>
  typeof value === 'string' &&
  value.length <= 100 &&
  INQUIRY_ID_PATTERN.test(value)

function requiredText(value, field, min, max, errors) {
  if (typeof value !== 'string') {
    errors[field] = `${field} is required`
    return ''
  }
  const text = value.trim()
  if (text.length < min || text.length > max) {
    errors[field] = `${field} must be ${min}-${max} characters`
    return ''
  }
  return text
}

function optionalText(value, field, max, errors) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') {
    errors[field] = `${field} must be text`
    return null
  }
  const text = value.trim()
  if (text === '') return null
  if (text.length > max) {
    errors[field] = `${field} must be at most ${max} characters`
    return null
  }
  return text
}

/**
 * Validates and normalizes a contact payload.
 * Returns `{ ok: true, value }` or `{ ok: false, errors }` keyed by field.
 */
export function validateInquiry(body) {
  if (!isPlainObject(body)) {
    return { ok: false, errors: { body: 'a JSON object is required' } }
  }

  const errors = {}
  const name = requiredText(body.name, 'name', NAME_MIN, NAME_MAX, errors)
  const message = requiredText(
    body.message,
    'message',
    MESSAGE_MIN,
    MESSAGE_MAX,
    errors,
  )

  let email = ''
  if (typeof body.email !== 'string') {
    errors.email = 'email is required'
  } else {
    email = body.email.trim()
    if (email.length === 0) errors.email = 'email is required'
    else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
      errors.email = `email must be a valid address of at most ${EMAIL_MAX} characters`
    }
  }

  const business = optionalText(
    body.business,
    'business',
    OPTIONAL_MAX.business,
    errors,
  )
  const service = optionalText(
    body.service,
    'service',
    OPTIONAL_MAX.service,
    errors,
  )
  const plan = optionalText(body.plan, 'plan', OPTIONAL_MAX.plan, errors)

  let launchDate = optionalText(body.launchDate, 'launchDate', 10, errors)
  if (launchDate !== null && !errors.launchDate) {
    const parsed = DATE_PATTERN.test(launchDate)
      ? new Date(`${launchDate}T00:00:00Z`)
      : null
    if (
      !parsed ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== launchDate
    ) {
      errors.launchDate = 'launchDate must be a real date in YYYY-MM-DD form'
      launchDate = null
    }
  }

  let id = null
  if (body.id !== undefined && body.id !== null && body.id !== '') {
    if (!isInquiryId(body.id)) {
      errors.id = 'id must be an inquiry- prefixed id'
    } else {
      id = body.id
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  return {
    ok: true,
    value: { id, name, email, business, service, plan, message, launchDate },
  }
}

/** The normalized payload as an InquiryRecord ready for the database. */
export function inquiryRecord(value, id, now) {
  return {
    id,
    fullName: value.name,
    email: value.email,
    company: value.business,
    projectType: value.service,
    budgetRange: value.plan,
    details: value.message,
    targetLaunchDate: value.launchDate,
    status: 'new',
    submittedAt: now.toISOString(),
  }
}

/* ---------- Throttle ---------- */

/**
 * Salted hash of the client address. The raw IP is never stored; the salt
 * must come from the environment so the table is useless if it leaks.
 */
export function hashIp(ip, salt) {
  return createHash('sha256').update(`${salt}\u0000${ip}`).digest('hex')
}

/**
 * First `x-forwarded-for` entry, else the socket address, else `unknown`.
 * Vercel always sets the header; the dev server falls back to the socket.
 */
export function clientIp(forwardedFor, fallback = '') {
  const header = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
  const first = typeof header === 'string' ? header.split(',')[0].trim() : ''
  if (first) return first
  const socket = typeof fallback === 'string' ? fallback.trim() : ''
  return socket || 'unknown'
}

/**
 * One request against the stored window. Allows three requests per 15
 * minutes; a missing, malformed, future, or expired window starts a new one.
 */
export function throttleDecision(
  current,
  now,
  { limit = THROTTLE_LIMIT, windowMs = THROTTLE_WINDOW_MS } = {},
) {
  const time = now.getTime()
  const started = current ? Date.parse(current.window_start) : Number.NaN
  const expired =
    !current ||
    !Number.isFinite(started) ||
    time < started ||
    time - started >= windowMs

  if (expired) {
    return {
      allowed: true,
      count: 1,
      windowStart: new Date(time).toISOString(),
    }
  }

  const stored = Number.isInteger(current.request_count)
    ? current.request_count
    : 0
  const count = stored + 1
  return { allowed: count <= limit, count, windowStart: current.window_start }
}

/* ---------- EmailJS ---------- */

/**
 * EmailJS REST body (`POST /api.emailjs.com/api/v1.0/email/send`): the public
 * key is `user_id` and the private key is `accessToken`. Template variables
 * follow the owner's template setup in phase 04.
 */
export function emailNotification(record, config) {
  return {
    service_id: config.serviceId,
    template_id: config.templateId,
    user_id: config.publicKey,
    accessToken: config.privateKey,
    template_params: {
      name: record.fullName,
      email: record.email,
      business: record.company ?? '',
      service: record.projectType ?? '',
      plan: record.budgetRange ?? '',
      message: record.details,
      launch_date: record.targetLaunchDate ?? '',
      submitted_at: record.submittedAt,
    },
  }
}

/* ---------- Request flow ---------- */

/**
 * The endpoint's decision logic with injected side effects, so tests can
 * prove the order: idempotency, throttle, insert, then email. An email
 * failure is logged and swallowed; the saved inquiry still returns 201.
 */
export async function processInquiry({ body, ip, now = new Date(), deps }) {
  if (!isPlainObject(body)) {
    return { status: 400, body: { error: 'a JSON object is required' } }
  }

  // A bot that fills the hidden field gets the success it expects and
  // touches nothing: no validation, throttle, row, or email.
  const trap = body.website
  if (typeof trap === 'string' && trap.trim() !== '') {
    return { status: 201, body: { ok: true } }
  }

  const validation = validateInquiry(body)
  if (!validation.ok) {
    return {
      status: 400,
      body: { error: 'invalid inquiry', fields: validation.errors },
    }
  }

  const value = validation.value
  const id = value.id ?? `inquiry-${(deps.randomId ?? randomUUID)()}`

  // A repeated id (draft drain retry, lost response) must not duplicate the
  // row or send a second email.
  if (await deps.findInquiry(id)) {
    return { status: 200, body: { ok: true, id, duplicate: true } }
  }

  const throttle = await deps.consumeThrottle(ip)
  if (!throttle.allowed) {
    return {
      status: 429,
      body: { error: 'too many inquiries; try again later' },
    }
  }

  const record = inquiryRecord(value, id, now)
  // False means the insert lost a race with the same id: treat it as the
  // idempotent repeat rather than a failure.
  if (!(await deps.insertInquiry(record))) {
    return { status: 200, body: { ok: true, id, duplicate: true } }
  }

  try {
    await deps.sendNotification(record)
  } catch (error) {
    deps.logEmailFailure(id, error)
  }

  return { status: 201, body: { ok: true, id } }
}
