// Browser-local persistence shared by the admin services (writes) and the
// public data exports (reads). There is no backend yet: edits live in this
// browser only. Bump the version when stored record shapes change, so old
// saved data can never break newer pages.
export const STORAGE_PREFIX = 'ordacy-cms:v2:'

/** The saved copy of a dataset, or the fallback when none or unreadable. */
export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // Storage unavailable (private mode, SSR) or corrupt: use the seed.
  }
  return fallback
}
