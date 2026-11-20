// Shared CRON_SECRET gate for the scheduled endpoints.
//
// Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically for cron
// invocations when that variable is set. Missing configuration fails closed:
// an unset secret denies every request instead of opening the endpoint.
import { timingSafeEqual } from 'node:crypto'
import { sendJson } from './http.mjs'
import { bearerToken } from './rules.mjs'

function sameSecret(candidate, secret) {
  const left = Buffer.from(candidate)
  const right = Buffer.from(secret)
  return left.length === right.length && timingSafeEqual(left, right)
}

/** True when the request may run; otherwise sends 401 and returns false. */
export function requireCronSecret(req, res) {
  const secret = process.env.CRON_SECRET?.trim()
  const token = bearerToken(req.headers?.authorization)
  if (!secret || !token || !sameSecret(token, secret)) {
    sendJson(res, 401, { error: 'unauthorized' })
    return false
  }
  return true
}
