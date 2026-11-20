// Public contact submissions. Kept out of `src/services/index.ts` (the admin
// layer) so the public bootstrap can drain legacy drafts without loading any
// admin code.
//
// `POST /api/inquiries` validates, stores, and emails server-side. The form's
// existing spinner, success panel, failure panel, and retained values are the
// only UI contract here.

export type InquiryInput = {
  name: string
  email: string
  business: string
  service: string
  plan: string
  message: string
  /** YYYY-MM-DD, or empty when not given. */
  launchDate: string
  /**
   * Draft/drain id only. The server generates one for a normal submission and
   * returns success without duplicating a row when the id already exists.
   */
  id?: string
}

const INQUIRIES_ENDPOINT = '/api/inquiries'

// The key the browser-local store wrote before phase 04. It is read once on
// public loads to deliver inquiries submitted before the switch, then
// removed. Nothing writes it anymore.
const INQUIRY_DRAFTS_KEY = 'ordacy-cms:v3:inquiries'

/**
 * Sends one inquiry. Throws on any non-2xx so the contact form shows its
 * failure panel with the visitor's values still in the form.
 */
export async function submitInquiry(input: InquiryInput): Promise<void> {
  let response: Response
  try {
    response = await fetch(INQUIRIES_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: input.id,
        name: input.name,
        email: input.email,
        business: input.business,
        service: input.service,
        plan: input.plan,
        message: input.message,
        launchDate: input.launchDate,
      }),
    })
  } catch {
    throw new Error(
      'The inquiry could not be sent. Check your connection and try again.',
    )
  }

  if (!response.ok) {
    let message = 'The inquiry could not be sent. Please try again.'
    try {
      const payload = (await response.json()) as { error?: unknown }
      if (typeof payload.error === 'string') message = payload.error
    } catch {
      // Non-JSON error body: keep the generic message.
    }
    throw new Error(message)
  }
}

type StoredDraft = Record<string, unknown>

const draftText = (record: StoredDraft, key: string) =>
  typeof record[key] === 'string' ? (record[key] as string) : ''

/** Maps a pre-phase-04 InquiryRecord to the public payload. */
function draftInput(draft: unknown): InquiryInput {
  const record: StoredDraft =
    typeof draft === 'object' && draft !== null
      ? (draft as StoredDraft)
      : {}
  return {
    id: draftText(record, 'id') || undefined,
    name: draftText(record, 'fullName'),
    email: draftText(record, 'email'),
    business: draftText(record, 'company'),
    service: draftText(record, 'projectType'),
    plan: draftText(record, 'budgetRange'),
    message: draftText(record, 'details'),
    launchDate: draftText(record, 'targetLaunchDate'),
  }
}

function readDrafts(): unknown[] | null {
  try {
    const raw = localStorage.getItem(INQUIRY_DRAFTS_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? [...parsed] : null
  } catch {
    return null
  }
}

function writeDrafts(drafts: unknown[]): boolean {
  try {
    if (drafts.length === 0) localStorage.removeItem(INQUIRY_DRAFTS_KEY)
    else localStorage.setItem(INQUIRY_DRAFTS_KEY, JSON.stringify(drafts))
    return true
  } catch {
    return false
  }
}

/**
 * One-time delivery of inquiries saved in this browser before phase 04.
 *
 * Each draft is POSTed with its original id, so a retried draft returns the
 * existing inquiry instead of duplicating it or sending a second email. A
 * draft is removed only after its POST succeeds; a failure keeps it (and the
 * rest) for the next public load. Never throws, so bootstrap is unaffected.
 */
export async function drainInquiryDrafts(): Promise<void> {
  let drafts = readDrafts()
  if (!drafts) return

  while (drafts.length > 0) {
    try {
      await submitInquiry(draftInput(drafts[0]))
    } catch (error) {
      // Keep the draft for retry; a permanently invalid legacy draft would
      // otherwise retry invisibly on every load.
      console.warn('An old inquiry draft could not be delivered yet.', error)
      return
    }

    drafts = drafts.slice(1)
    // If storage fails after a successful POST, the key keeps the draft and
    // the next load repeats idempotently.
    if (!writeDrafts(drafts)) return
  }
}
