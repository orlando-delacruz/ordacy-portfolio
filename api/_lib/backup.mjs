// Pure helpers for the weekly backup endpoint.
//
// Kept dependency-free so `node --test` can verify file naming and retention
// without a network, Storage, or environment variables.

export const BACKUP_BUCKET = 'backups'
export const BACKUP_PREFIX = 'backups/'
export const BACKUP_KEEP = 8

const FILE_PATTERN = /^(?:backups\/)?(\d{4}-\d{2}-\d{2})\.json$/

/** Object key inside the bucket: `backups/YYYY-MM-DD.json`, in UTC. */
export function backupFileName(date) {
  return `${BACKUP_PREFIX}${date.toISOString().slice(0, 10)}.json`
}

/**
 * Dated backup keys from a Storage list response, newest first.
 *
 * Accepts both `2026-11-21.json` (Supabase lists names relative to the
 * requested prefix) and the full `backups/2026-11-21.json` key, deduplicated
 * by date. Anything that is not a dated backup file is ignored.
 */
export function backupFileNames(names) {
  const dates = new Set()
  for (const name of Array.isArray(names) ? names : []) {
    if (typeof name !== 'string') continue
    const match = FILE_PATTERN.exec(name)
    if (match) dates.add(match[1])
  }
  return [...dates]
    .sort()
    .reverse()
    .map((date) => `${BACKUP_PREFIX}${date}.json`)
}

/** Keys to delete so only the newest `keep` dated backups remain. */
export function retentionPlan(names, keep = BACKUP_KEEP) {
  return backupFileNames(names).slice(keep)
}
