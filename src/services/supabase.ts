// Browser Supabase client for admin authentication only.
//
// Vite exposes VITE_* values to the bundle; both are public by design. The
// service-role key is never imported here. Sessions persist in localStorage so
// a reload keeps the owner signed in, and the client refreshes tokens itself.
//
// The SDK loads on first use: public pages import `@/services` for the contact
// form, and they must not download the auth client for it.
import type { SupabaseClient } from '@supabase/supabase-js'

let clientPromise: Promise<SupabaseClient> | null = null

/** The singleton client, created on the first admin request. */
export function getSupabase(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const url = import.meta.env.VITE_SUPABASE_URL
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      if (!url || !anonKey) {
        throw new Error(
          'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set to use the admin.',
        )
      }
      const { createClient } = await import('@supabase/supabase-js')
      return createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    })()
  }
  return clientPromise
}

/** The current access token, or null when there is no session. */
export async function getAccessToken(): Promise<string | null> {
  const supabase = await getSupabase()
  const { data, error } = await supabase.auth.getSession()
  if (error) return null
  return data.session?.access_token ?? null
}
