// Server-side admin authentication.
//
// Reads only `Authorization: Bearer <token>`; no cookies and no client flags.
// Supabase verifies the signature with the anon key, then three checks run:
//   1. the user id must equal ADMIN_USER_ID (owner allowlist),
//   2. the user's verified TOTP factor id must equal ADMIN_TOTP_FACTOR_ID,
//   3. the decoded token must carry aal2 (password + TOTP).
// Missing configuration fails closed. The service-role client is created only
// after the owner check, so a non-owner request never touches it.
import { createClient } from '@supabase/supabase-js'
import { sendJson } from './http.mjs'
import {
  authorizeAdmin,
  authorizeFactor,
  authorizeOwner,
  bearerToken,
  decodeJwtPayload,
} from './rules.mjs'

let authClient
let adminClient

function getAuthClient() {
  if (authClient) return authClient
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY is not set')
  }
  authClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return authClient
}

function getAdminClient() {
  if (adminClient) return adminClient
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  adminClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return adminClient
}

/** Factors for one user, through the service-role Admin API. */
async function listFactors(userId) {
  const { data, error } = await getAdminClient().auth.admin.mfa.listFactors({
    userId,
  })
  if (error) throw error
  return data?.factors ?? null
}

const forbidden = (res) => sendJson(res, 403, { error: 'forbidden' })

/**
 * Returns `{ user, payload }` for an authorized AAL2 request, or sends
 * 401/403 and returns null. Callers must stop when the result is null.
 */
export async function requireAdmin(req, res) {
  const token = bearerToken(req.headers?.authorization)
  if (!token) {
    sendJson(res, 401, { error: 'unauthorized' })
    return null
  }

  const { data, error } = await getAuthClient().auth.getUser(token)
  if (error || !data.user) {
    sendJson(res, 401, { error: 'unauthorized' })
    return null
  }

  const owner = authorizeOwner(
    data.user.id,
    process.env.ADMIN_USER_ID?.trim(),
  )
  if (!owner.ok) {
    forbidden(res)
    return null
  }

  const factorId = process.env.ADMIN_TOTP_FACTOR_ID?.trim()
  if (!factorId) {
    forbidden(res)
    return null
  }

  let factors
  try {
    factors = await listFactors(data.user.id)
  } catch (lookupError) {
    // A lookup failure must not open the admin: deny and log server-side.
    console.error('admin factor lookup failed:', lookupError)
    forbidden(res)
    return null
  }

  const factor = authorizeFactor(factors, factorId)
  if (!factor.ok) {
    forbidden(res)
    return null
  }

  const payload = decodeJwtPayload(token)
  const decision = authorizeAdmin(payload)
  if (!decision.ok) {
    sendJson(res, decision.status, { error: decision.error })
    return null
  }

  return { user: data.user, payload }
}
