// Pure, dependency-free rules for the admin API. Kept separate from the
// handler so `node --test` can exercise the security-relevant decisions
// without a server, network, or environment variables.
//
// Record shapes follow src/data/types.ts exactly; a renamed field must fail
// review, not slip through an unchecked payload.

import iconNames from '../../data/icons.json' with { type: 'json' }

export const COLLECTION_RESOURCES = Object.freeze([
  'projects',
  'testimonials',
  'services',
  'plans',
  'faqs',
  'team',
  'gallery',
  'inquiries',
  'pages',
  'seo',
])

export const DOCUMENT_RESOURCES = Object.freeze(['site', 'settings'])

export const RESOURCE_NAMES = Object.freeze([
  ...COLLECTION_RESOURCES,
  ...DOCUMENT_RESOURCES,
])

const collectionSet = new Set(COLLECTION_RESOURCES)
const documentSet = new Set(DOCUMENT_RESOURCES)
const resourceSet = new Set(RESOURCE_NAMES)

export const isCollectionResource = (name) => collectionSet.has(name)
export const isDocumentResource = (name) => documentSet.has(name)
export const isKnownResource = (name) => resourceSet.has(name)

/* ---------- Request identity ---------- */

/** Case-insensitive `Bearer <token>`; null when absent or malformed. */
export function bearerToken(header) {
  if (typeof header !== 'string') return null
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim())
  return match ? match[1] : null
}

/**
 * Reads a JWT payload without verifying it. Verification is
 * `supabase.auth.getUser(token)`'s job; this only exposes the `aal` claim the
 * MFA gate needs. Returns null for anything unreadable.
 */
export function decodeJwtPayload(token) {
  if (typeof token !== 'string') return null
  const part = token.split('.')[1]
  if (!part) return null

  try {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    )
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'))
    return isPlainObject(payload) ? payload : null
  } catch {
    return null
  }
}

/**
 * The MFA gate: a verified token must also be at AAL2. A password-only
 * session (aal1) may read its own auth data but never write admin content.
 */
export function authorizeAdmin(payload) {
  if (!isPlainObject(payload)) {
    return { ok: false, status: 401, error: 'unauthorized' }
  }
  if (payload.aal !== 'aal2') {
    return { ok: false, status: 403, error: 'mfa required' }
  }
  return { ok: true }
}

/**
 * Owner allowlist. Only the pre-recorded auth user may reach the admin at
 * all. Fails closed when ADMIN_USER_ID is unset, so a deployment that forgets
 * the variable admits nobody instead of every signed-in account.
 */
export function authorizeOwner(userId, adminUserId) {
  if (typeof adminUserId !== 'string' || adminUserId.length === 0) {
    return { ok: false, status: 403, error: 'forbidden' }
  }
  if (typeof userId !== 'string' || userId !== adminUserId) {
    return { ok: false, status: 403, error: 'forbidden' }
  }
  return { ok: true }
}

/**
 * Factor pin: the pre-recorded verified TOTP factor must be the only verified
 * factor of any type. An extra verified factor enrolled by someone who knows
 * the password therefore locks the admin rather than granting access; the
 * Supabase factor limit of 1 is the primary prevention. Unverified extra
 * factors are accepted. Fails closed when the id is unset, missing,
 * unverified, or not TOTP.
 */
export function authorizeFactor(factors, factorId) {
  if (typeof factorId !== 'string' || factorId.length === 0) {
    return { ok: false, status: 403, error: 'forbidden' }
  }
  if (!Array.isArray(factors)) {
    return { ok: false, status: 403, error: 'forbidden' }
  }
  const verified = factors
    .filter(isPlainObject)
    .filter((factor) => factor.status === 'verified')
  if (verified.length !== 1) {
    return { ok: false, status: 403, error: 'forbidden' }
  }
  const [factor] = verified
  if (factor.id !== factorId || factor.factor_type !== 'totp') {
    return { ok: false, status: 403, error: 'forbidden' }
  }
  return { ok: true }
}

/* ---------- Ordering ---------- */

// pages and seo have no display_order column; these lists preserve the order
// the admin has always shown (the JSON seed order), then any new id by name.
const PAGE_ORDER = Object.freeze([
  'home',
  'about',
  'projects',
  'testimonials',
  'faqs',
  'team',
  'pricing',
  'contact',
  'not-found',
])

const SEO_ORDER = Object.freeze([
  'home',
  'projects',
  'testimonials',
  'pricing',
  'contact',
  'about',
  'faqs',
  'privacy',
  'terms',
  'notFound',
])

const byId = (a, b) => String(a.id).localeCompare(String(b.id))

function rankOrder(records, order) {
  const rank = new Map(order.map((id, index) => [id, index]))
  return [...records].sort((a, b) => {
    const left = rank.get(a.id) ?? order.length
    const right = rank.get(b.id) ?? order.length
    return left - right || byId(a, b)
  })
}

/** Deterministic list order for the admin screens. */
export function orderRecords(resource, records) {
  if (resource === 'pages') return rankOrder(records, PAGE_ORDER)
  if (resource === 'seo') return rankOrder(records, SEO_ORDER)
  if (resource === 'inquiries') {
    return [...records].sort(
      (a, b) =>
        Date.parse(b.submittedAt) - Date.parse(a.submittedAt) || byId(a, b),
    )
  }
  return [...records].sort(
    (a, b) =>
      (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0) ||
      byId(a, b),
  )
}

/* ---------- Record validation ---------- */

export const isPlainObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isString = (value) => typeof value === 'string'
const isText = (value) => typeof value === 'string' && value.trim() !== ''
const isBoolean = (value) => typeof value === 'boolean'
const isInteger = (value) => Number.isInteger(value)
const isStringArray = (value) =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')
const isNullableString = (value) => value === null || isString(value)

const KNOWN_ICONS = new Set(iconNames)

/** Icons must resolve in src/data/icons.ts; unknown names would crash a page. */
export const isKnownIcon = (value) =>
  typeof value === 'string' && KNOWN_ICONS.has(value)

/* ---------- URLs ---------- */

// Same-document anchors (`#inquiry-form`) are stored by pages.json, so the
// relative rule accepts them too. Everything else must be http(s) or a
// rooted path; `javascript:`, `data:`, protocol-relative, and backslash
// tricks are rejected.
const SAFE_PATH_PATTERN = /^\/(?!\/)[^\s\\]*$/
const SAFE_FRAGMENT_PATTERN = /^#[A-Za-z0-9][A-Za-z0-9._-]*$/

/** Absolute http(s) URL with a host, or a safe relative path/fragment. */
export function isSafeUrl(value) {
  if (typeof value !== 'string' || value.trim() !== value) return false
  if (SAFE_PATH_PATTERN.test(value) || SAFE_FRAGMENT_PATTERN.test(value)) {
    return true
  }
  if (!/^https?:\/\//i.test(value)) return false
  try {
    const url = new URL(value)
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.hostname !== ''
    )
  } catch {
    return false
  }
}

/** The site's public origin must be an absolute https URL. */
export function isHttpsUrl(value) {
  if (typeof value !== 'string' || !/^https:\/\//i.test(value)) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname !== ''
  } catch {
    return false
  }
}

const isNullableUrl = (value) => value === null || isSafeUrl(value)

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
export const isRecordId = (value) =>
  typeof value === 'string' && ID_PATTERN.test(value)

const isShot = (value) =>
  isPlainObject(value) && isSafeUrl(value.src) && isText(value.alt)

const isShotArray = (value) => Array.isArray(value) && value.every(isShot)

const isPendingValue = (value) =>
  isPlainObject(value) &&
  isNullableString(value.value) &&
  isBoolean(value.pending)

const isSiteContact = (value) =>
  isPlainObject(value) && ['email', 'phone', 'location', 'responseTime'].every(
    (key) => isPendingValue(value[key]),
  )

const isProfileStats = (value) =>
  isPlainObject(value) &&
  ['views', 'projects', 'likes'].every((key) => isString(value[key]))

const isHeader = (value) =>
  isPlainObject(value) &&
  isString(value.eyebrow) &&
  isString(value.title) &&
  isString(value.description)

const isSection = (value) =>
  isPlainObject(value) &&
  isText(value.id) &&
  isText(value.label) &&
  isString(value.title) &&
  (value.eyebrow === null || isString(value.eyebrow)) &&
  (value.description === null || isString(value.description)) &&
  (value.items === null ||
    (Array.isArray(value.items) &&
      value.items.every(
        (item) =>
          isPlainObject(item) &&
          isString(item.title) &&
          isString(item.text),
      ))) &&
  (value.actions === undefined ||
    value.actions === null ||
    (Array.isArray(value.actions) &&
      value.actions.every(
        (action) =>
          isPlainObject(action) &&
          isString(action.label) &&
          isSafeUrl(action.to) &&
          isKnownIcon(action.icon),
      ))) &&
  (value.mobile === undefined ||
    value.mobile === null ||
    (isPlainObject(value.mobile) &&
      isString(value.mobile.eyebrow) &&
      isString(value.mobile.title) &&
      isString(value.mobile.description)))

const isPrices = (value) =>
  isPlainObject(value) &&
  Object.keys(value).length === 2 &&
  ['PHP', 'USD'].every((currency) => isNullableString(value[currency]))

const isAvatar = (value) =>
  isPlainObject(value) &&
  isSafeUrl(value.src) &&
  isString(value.alt) &&
  (value.darkSrc === undefined || isSafeUrl(value.darkSrc))

const isFacts = (value) =>
  Array.isArray(value) &&
  value.every(
    (fact) =>
      isPlainObject(fact) &&
      isString(fact.label) &&
      isString(fact.value),
  )

const hasStringFields = (value, keys) =>
  isPlainObject(value) && keys.every((key) => isString(value[key]))

const isExperience = (value) =>
  hasStringFields(value, ['role', 'organization', 'period', 'summary'])

// education.details must be a string: the resume UI splits it into lines.
const isEducation = (value) =>
  hasStringFields(value, ['credential', 'school', 'period', 'details'])

const isCertification = (value) =>
  hasStringFields(value, ['name', 'issuer', 'year'])

const isSkillGroups = (value) =>
  value === null ||
  (Array.isArray(value) &&
    value.every(
      (group) =>
        isPlainObject(group) &&
        isString(group.label) &&
        isStringArray(group.items),
    ))

const RECORD_FIELDS = {
  pages: {
    id: [isRecordId],
    label: [isText],
    path: [isText],
    header: [(value) => value === null || isHeader(value)],
    sections: [
      (value) => Array.isArray(value) && value.every(isSection),
    ],
  },
  services: {
    id: [isRecordId],
    icon: [isKnownIcon],
    title: [isText],
    description: [isText],
    problem: [isText],
    capabilities: [isStringArray],
    useCases: [isStringArray],
    audience: [isText],
    displayOrder: [isInteger],
    isPublished: [isBoolean],
  },
  plans: {
    id: [isRecordId],
    name: [isText],
    icon: [isKnownIcon],
    category: [isText],
    prices: [isPrices],
    positioning: [isText],
    fits: [isStringArray],
    cta: [isText],
    ctaIcon: [isKnownIcon],
    displayOrder: [isInteger],
    isPublished: [isBoolean],
  },
  faqs: {
    id: [isRecordId],
    icon: [isKnownIcon],
    category: [isText],
    question: [isText],
    answer: [isText],
    featured: [isBoolean],
    pricingPage: [isBoolean],
    displayOrder: [isInteger],
    isPublished: [isBoolean],
  },
  projects: {
    id: [isRecordId],
    slug: [isText],
    title: [isText],
    type: [(value) => value === 'client-project' || value === 'concept-demo'],
    icon: [isKnownIcon],
    category: [isText],
    summary: [isText],
    details: [isText],
    challenge: [isText],
    solution: [isText],
    features: [isStringArray],
    image: [isShot],
    screenshots: [isShotArray],
    url: [isNullableUrl],
    isPublished: [isBoolean],
    displayOrder: [isInteger],
    createdAt: [isText],
    updatedAt: [isText],
  },
  testimonials: {
    id: [isRecordId],
    quote: [isText],
    name: [isText],
    role: [isText],
    company: [isText],
    rating: [
      (value) => value === null || (isInteger(value) && value >= 1 && value <= 5),
    ],
    initials: [isText],
    status: [(value) => value === 'pending' || value === 'approved'],
    isPublished: [isBoolean],
    displayOrder: [isInteger],
    createdAt: [isText],
  },
  team: {
    id: [isRecordId],
    slug: [isText],
    name: [isText],
    role: [isText],
    initials: [isText],
    avatar: [(value) => value === null || isAvatar(value)],
    resumeUrl: [isNullableUrl, true],
    headline: [isText],
    summary: [isText],
    facts: [isFacts],
    skills: [isStringArray],
    skillGroups: [isSkillGroups, true],
    experience: [
      (value) => Array.isArray(value) && value.every(isExperience),
    ],
    education: [
      (value) => Array.isArray(value) && value.every(isEducation),
    ],
    certifications: [
      (value) => Array.isArray(value) && value.every(isCertification),
    ],
    languages: [isStringArray],
    displayOrder: [isInteger],
    isPublished: [isBoolean],
    createdAt: [isText],
    updatedAt: [isText],
  },
  gallery: {
    id: [isRecordId],
    src: [isSafeUrl],
    title: [isText],
    alt: [isText],
    caption: [isNullableString],
    displayOrder: [isInteger],
    isPublished: [isBoolean],
    createdAt: [isText],
  },
  inquiries: {
    id: [isRecordId],
    fullName: [isText],
    email: [isText],
    company: [isNullableString],
    projectType: [isNullableString],
    budgetRange: [isNullableString],
    details: [isText],
    targetLaunchDate: [isNullableString],
    status: [
      (value) =>
        value === 'new' || value === 'in-progress' || value === 'completed',
    ],
    submittedAt: [isText],
  },
  seo: {
    id: [isRecordId],
    path: [isText],
    title: [isText],
    description: [isText],
    canonical: [isNullableUrl, true],
    ogTitle: [isNullableString, true],
    ogDescription: [isNullableString, true],
    ogImage: [isNullableUrl, true],
    noindex: [isBoolean, true],
  },
}

/**
 * Returns null when the record is safe to write, else a readable message.
 * `partial` is used by PATCH: absent keys are allowed, present keys are checked.
 */
export function validateRecord(resource, value, { partial = false } = {}) {
  if (!isPlainObject(value)) return `${resource} must be an object`
  const fields = RECORD_FIELDS[resource]
  if (!fields) return `unknown resource "${resource}"`

  for (const [key, [test, optional = false]] of Object.entries(fields)) {
    const present = value[key] !== undefined
    if (!present) {
      if (!partial && !optional) return `${resource}.${key} is required`
      continue
    }
    if (!test(value[key])) return `${resource}.${key} has an invalid value`
  }
  return null
}

/* ---------- Documents: key-whitelisted rebuilds ---------- */

function requireString(value, label) {
  if (typeof value !== 'string') {
    throw new TypeError(`${label} must be a string`)
  }
  return value
}

function requireBoolean(value, label) {
  if (typeof value !== 'boolean') {
    throw new TypeError(`${label} must be a boolean`)
  }
  return value
}

function requireStringArray(value, label) {
  if (!isStringArray(value)) {
    throw new TypeError(`${label} must be an array of strings`)
  }
  return [...value]
}

function requireHttpsUrl(value, label) {
  if (!isHttpsUrl(value)) {
    throw new TypeError(`${label} must be an absolute https URL`)
  }
  return value
}

function rebuildPendingValue(value, label) {
  if (!isPlainObject(value)) {
    throw new TypeError(`${label} must be an object`)
  }
  return {
    value:
      value.value === null
        ? null
        : requireString(value.value, `${label}.value`),
    pending: requireBoolean(value.pending, `${label}.pending`),
  }
}

/**
 * Builds the stored SiteRecord field by field. Unknown keys (including the
 * JSON seed's `_note` comments) never reach the database.
 */
export function sanitizeSiteDocument(value) {
  if (!isPlainObject(value)) throw new TypeError('site must be an object')
  if (!isPlainObject(value.profileStats)) {
    throw new TypeError('site.profileStats must be an object')
  }
  if (!isPlainObject(value.contact)) {
    throw new TypeError('site.contact must be an object')
  }

  return {
    name: requireString(value.name, 'site.name'),
    tagline: requireString(value.tagline, 'site.tagline'),
    description: requireString(value.description, 'site.description'),
    siteUrl: requireHttpsUrl(value.siteUrl, 'site.siteUrl'),
    siteUrlPending: requireBoolean(
      value.siteUrlPending,
      'site.siteUrlPending',
    ),
    footerTagline: requireString(value.footerTagline, 'site.footerTagline'),
    profileStats: {
      views: requireString(value.profileStats.views, 'site.profileStats.views'),
      projects: requireString(
        value.profileStats.projects,
        'site.profileStats.projects',
      ),
      likes: requireString(value.profileStats.likes, 'site.profileStats.likes'),
    },
    contact: {
      email: rebuildPendingValue(value.contact.email, 'site.contact.email'),
      phone: rebuildPendingValue(value.contact.phone, 'site.contact.phone'),
      location: rebuildPendingValue(
        value.contact.location,
        'site.contact.location',
      ),
      responseTime: rebuildPendingValue(
        value.contact.responseTime,
        'site.contact.responseTime',
      ),
    },
    markets: requireStringArray(value.markets, 'site.markets'),
  }
}

/** Rebuilds the SettingsRecord: only `inquiriesPageSize` is stored. */
export function sanitizeSettingsDocument(value) {
  if (!isPlainObject(value)) throw new TypeError('settings must be an object')
  const size = value.inquiriesPageSize
  if (!isInteger(size) || size < 1 || size > 100) {
    throw new TypeError('settings.inquiriesPageSize must be an integer from 1 to 100')
  }
  return { inquiriesPageSize: size }
}

export function sanitizeDocument(resource, value) {
  if (resource === 'site') return sanitizeSiteDocument(value)
  if (resource === 'settings') return sanitizeSettingsDocument(value)
  throw new TypeError(`unknown document "${resource}"`)
}
