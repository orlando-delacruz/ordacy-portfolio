// Lists Supabase Auth users and their MFA factors so the owner allowlist and
// the pinned TOTP factor can be recorded in ADMIN_USER_ID and
// ADMIN_TOTP_FACTOR_ID.
//
// Read-only and service-role only. Run from the repository root:
//   node --env-file=.env.local scripts/auth-info.mjs
//
// Copy the printed ids into .env.local and the Vercel project. Never print or
// commit the service-role key itself.
import { createClient } from '@supabase/supabase-js'

async function main() {
  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    console.error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set. Run with --env-file=.env.local.',
    )
    process.exitCode = 1
    return
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const perPage = 200
  const users = []

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    })
    if (error) {
      console.error(`Could not list users: ${error.message}`)
      process.exitCode = 1
      return
    }

    users.push(...data.users)
    if (data.users.length < perPage || page >= (data.lastPage ?? page)) break
  }

  if (users.length === 0) {
    console.log('No auth users exist yet. Create the owner user first.')
    return
  }

  console.log(`Auth users: ${users.length}`)
  if (users.length > 1) {
    console.log(
      'WARNING: more than one user exists. Disable sign-ups in Supabase Authentication → Providers (Email) so only the owner account can exist.',
    )
  }

  for (const user of users) {
    console.log('')
    console.log(user.email ?? '(no email)')
    console.log(`  ADMIN_USER_ID=${user.id}`)

    const { data, error } = await supabase.auth.admin.mfa.listFactors({
      userId: user.id,
    })
    if (error) {
      console.log(`  factor lookup failed: ${error.message}`)
      continue
    }

    const factors = data.factors
    if (factors.length === 0) {
      console.log('  factors: none (sign in to /admin/login to enroll TOTP)')
      continue
    }

    console.log(`  factors (${factors.length}):`)
    for (const factor of factors) {
      const verifiedTotp =
        factor.factor_type === 'totp' && factor.status === 'verified'
      console.log(
        `    - id=${factor.id} type=${factor.factor_type} status=${factor.status}${
          verifiedTotp ? '  <- verified TOTP: set ADMIN_TOTP_FACTOR_ID' : ''
        }`,
      )
    }

    const verified = factors.filter((factor) => factor.status === 'verified')
    if (verified.length > 1) {
      console.log(
        `  WARNING: ${verified.length} verified factors exist. The admin API denies every request unless the pinned TOTP factor is the only verified factor; remove the extra verified factors.`,
      )
    }
  }

  console.log('')
  console.log(
    'Record the owner ids in .env.local and the Vercel environment variables. After removing or resetting the factor, re-enroll and run this script again.',
  )
}

main().catch((error) => {
  console.error('auth-info failed:', error)
  process.exitCode = 1
})
