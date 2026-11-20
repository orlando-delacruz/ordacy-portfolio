// Data access layer for the admin (and the contact form). UI code calls these
// functions only; every admin read and write now travels through the
// authenticated `/api/admin` endpoint. The bearer token comes from the
// Supabase browser session. The contact form stays browser-local until phase
// 04 adds the public inquiries endpoint.
import type {
  FaqRecord,
  GalleryImageRecord,
  InquiryRecord,
  InquiryStatus,
  PageRecord,
  PlanRecord,
  ProjectRecord,
  SeoRecord,
  ServiceRecord,
  SettingsRecord,
  SiteRecord,
  TeamMemberRecord,
  TestimonialRecord,
} from '@/data'
import { getAccessToken, getSupabase } from './supabase'

export type Collection<T extends { id: string }> = {
  list(): Promise<T[]>
  get(id: string): Promise<T>
  create(record: T): Promise<T>
  update(id: string, patch: Partial<T>): Promise<T>
  remove(id: string): Promise<void>
  /**
   * Full import only (seed restore or bulk load). Single deletes use
   * `remove(id)` and moves use one `update({ displayOrder })` per record, so
   * a stale snapshot cannot overwrite another device's changes.
   */
  replaceAll(records: T[]): Promise<T[]>
}

export type DocumentStore<T> = {
  get(): Promise<T>
  save(value: T): Promise<T>
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`No ${resource} record with id "${id}"`)
    this.name = 'NotFoundError'
  }
}

const ADMIN_ENDPOINT = '/api/admin'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  id?: string
  body?: unknown
}

/** One authenticated request; non-2xx responses become readable errors. */
async function adminRequest<T>(
  resource: string,
  { method = 'GET', id, body }: RequestOptions = {},
): Promise<T> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('You are signed out. Sign in again to continue.')
  }

  const params = new URLSearchParams({ resource })
  if (id !== undefined) params.set('id', id)

  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${ADMIN_ENDPOINT}?${params.toString()}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`
    try {
      const payload = (await response.json()) as { error?: unknown }
      if (typeof payload.error === 'string') message = payload.error
    } catch {
      // Non-JSON error body: keep the status message.
    }

    if (response.status === 401) {
      // A revoked or expired token cannot be repaired here: clear the local
      // session so the admin guard returns to login. A 403 is different — the
      // session is valid but the server denied the caller (owner allowlist or
      // factor pin); signing out would hide a configuration problem, so keep
      // the session and surface the error.
      void getSupabase()
        .then((supabase) => supabase.auth.signOut({ scope: 'local' }))
        .catch(() => {})
    }

    if (response.status === 401) {
      message = 'Your session has expired. Sign in again.'
    } else if (response.status === 403) {
      message =
        'The admin API denied this account. Check the owner allowlist and authenticator configuration.'
    } else if (
      response.status === 404 &&
      id !== undefined &&
      (method === 'GET' || method === 'PATCH' || method === 'DELETE')
    ) {
      throw new NotFoundError(resource, id)
    }

    throw new Error(message)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

function createCollection<T extends { id: string }>(
  resource: string,
): Collection<T> {
  return {
    list: () => adminRequest<T[]>(resource),
    get: (id) => adminRequest<T>(resource, { id }),
    create: (record) =>
      adminRequest<T>(resource, { method: 'POST', body: record }),
    update: (id, patch) =>
      adminRequest<T>(resource, { method: 'PATCH', id, body: patch }),
    remove: async (id) => {
      await adminRequest<void>(resource, { method: 'DELETE', id })
    },
    replaceAll: (records) =>
      adminRequest<T[]>(resource, { method: 'PUT', body: records }),
  }
}

function createDocument<T>(resource: string): DocumentStore<T> {
  return {
    get: () => adminRequest<T>(resource),
    save: (value) =>
      adminRequest<T>(resource, { method: 'PUT', body: value }),
  }
}

/**
 * Persists a reordered list one record at a time: only records whose
 * displayOrder changed are written, so a move never sends a stale full
 * snapshot. Re-reads the collection for the caller afterwards.
 */
export async function saveOrder<T extends { id: string; displayOrder: number }>(
  collection: Collection<T>,
  current: readonly T[],
  next: readonly T[],
): Promise<T[]> {
  const before = new Map(
    current.map((record) => [record.id, record.displayOrder]),
  )

  for (const record of next) {
    if (before.get(record.id) === record.displayOrder) continue
    await collection.update(record.id, {
      displayOrder: record.displayOrder,
    } as Partial<T>)
  }

  return collection.list()
}

/*
 * Contact submissions remain browser-local until phase 04. They use the key
 * the old local store wrote, so drafts saved before this phase are not lost.
 * Every other inquiry read/write goes to the authenticated API.
 */
const INQUIRY_DRAFTS_KEY = 'ordacy-cms:v3:inquiries'

function readInquiryDrafts(): InquiryRecord[] {
  try {
    const raw = localStorage.getItem(INQUIRY_DRAFTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as InquiryRecord[]) : []
  } catch {
    return []
  }
}

// Returns false (never throws) when this browser cannot store the draft; the
// caller turns that into a visible failure instead of a false success.
function writeInquiryDrafts(records: InquiryRecord[]): boolean {
  try {
    localStorage.setItem(INQUIRY_DRAFTS_KEY, JSON.stringify(records))
    return true
  } catch {
    return false
  }
}

const draftStorageError = () =>
  new Error('This browser could not store the inquiry. Please try again.')

const remoteInquiries = createCollection<InquiryRecord>('inquiries')

export const inquiriesService: Collection<InquiryRecord> = {
  async list() {
    const remote = await remoteInquiries.list()
    const merged = new Map(remote.map((record) => [record.id, record]))
    for (const draft of readInquiryDrafts()) merged.set(draft.id, draft)
    return [...merged.values()]
  },

  async get(id) {
    const draft = readInquiryDrafts().find((record) => record.id === id)
    return draft ?? remoteInquiries.get(id)
  },

  async create(record) {
    const saved = writeInquiryDrafts([
      ...readInquiryDrafts().filter((item) => item.id !== record.id),
      record,
    ])
    if (!saved) throw draftStorageError()
    return record
  },

  async update(id, patch) {
    const drafts = readInquiryDrafts()
    const index = drafts.findIndex((record) => record.id === id)
    if (index === -1) return remoteInquiries.update(id, patch)

    const next = { ...drafts[index], ...patch, id }
    drafts[index] = next
    if (!writeInquiryDrafts(drafts)) throw draftStorageError()
    return next
  },

  async remove(id) {
    const drafts = readInquiryDrafts()
    if (!drafts.some((record) => record.id === id)) {
      return remoteInquiries.remove(id)
    }
    if (!writeInquiryDrafts(drafts.filter((record) => record.id !== id))) {
      throw draftStorageError()
    }
  },

  replaceAll: (records) => remoteInquiries.replaceAll(records),
}

export const projectsService = createCollection<ProjectRecord>('projects')
export const testimonialsService =
  createCollection<TestimonialRecord>('testimonials')
export const servicesService = createCollection<ServiceRecord>('services')
export const plansService = createCollection<PlanRecord>('plans')
export const faqsService = createCollection<FaqRecord>('faqs')
export const galleryService = createCollection<GalleryImageRecord>('gallery')
export const teamService = createCollection<TeamMemberRecord>('team')
export const pagesService = createCollection<PageRecord>('pages')
export const seoService = createCollection<SeoRecord>('seo')
export const siteService = createDocument<SiteRecord>('site')
export const settingsService = createDocument<SettingsRecord>('settings')

export const createId = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().slice(0, 8)}`

/* ---------- Inquiries ---------- */

export const inquiryStatuses: readonly InquiryStatus[] = [
  'new',
  'in-progress',
  'completed',
]

export type InquiryQuery = {
  search?: string
  status?: InquiryStatus | 'all'
  page?: number
  pageSize?: number
}

export type InquiryPage = {
  items: InquiryRecord[]
  /** Records matching the search and filter. */
  total: number
  page: number
  pageCount: number
}

const newestFirst = (a: InquiryRecord, b: InquiryRecord) =>
  Date.parse(b.submittedAt) - Date.parse(a.submittedAt)

/** Search (name or email), filter by status, newest first, paginated. */
export async function queryInquiries({
  search = '',
  status = 'all',
  page = 1,
  pageSize = 10,
}: InquiryQuery): Promise<InquiryPage> {
  const term = search.trim().toLowerCase()
  const matches = (await inquiriesService.list())
    .filter((inquiry) => status === 'all' || inquiry.status === status)
    .filter(
      (inquiry) =>
        !term ||
        inquiry.fullName.toLowerCase().includes(term) ||
        inquiry.email.toLowerCase().includes(term),
    )
    .sort(newestFirst)

  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize))
  const current = Math.min(Math.max(1, page), pageCount)
  const start = (current - 1) * pageSize

  return {
    items: matches.slice(start, start + pageSize),
    total: matches.length,
    page: current,
    pageCount,
  }
}

export type InquiryStats = Record<InquiryStatus | 'total', number> & {
  recent: InquiryRecord[]
}

/** Dashboard figures, derived from the stored inquiries. */
export async function getInquiryStats(recentCount = 5): Promise<InquiryStats> {
  const all = (await inquiriesService.list()).sort(newestFirst)
  const count = (status: InquiryStatus) =>
    all.filter((inquiry) => inquiry.status === status).length

  return {
    total: all.length,
    new: count('new'),
    'in-progress': count('in-progress'),
    completed: count('completed'),
    recent: all.slice(0, recentCount),
  }
}

export type InquiryInput = {
  name: string
  email: string
  business: string
  service: string
  plan: string
  message: string
  /** YYYY-MM-DD, or empty when not given. */
  launchDate: string
}

/**
 * Public contact form submission. Browser-local until phase 04 adds
 * `POST /api/inquiries`; a storage failure throws so the form's existing
 * failure panel appears rather than claiming a lost draft was received.
 */
export async function submitInquiry(input: InquiryInput): Promise<void> {
  await inquiriesService.create({
    id: createId('inquiry'),
    fullName: input.name,
    email: input.email,
    company: input.business || null,
    projectType: input.service || null,
    budgetRange: input.plan || null,
    details: input.message,
    targetLaunchDate: input.launchDate || null,
    status: 'new',
    submittedAt: new Date().toISOString(),
  })
}
