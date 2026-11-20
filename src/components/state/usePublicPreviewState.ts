import type { PublicPreviewState } from './types'

export type { PublicPreviewState }

const isPreviewState = (value: string | null): value is PublicPreviewState =>
  value === 'loading' ||
  value === 'empty' ||
  value === 'error' ||
  value === 'success'

/**
 * Reads the development-only `?state=` preview. Production always returns
 * null, so the query can never replace real content in a built site.
 */
export function usePublicPreviewState(): PublicPreviewState | null {
  if (!import.meta.env.DEV) return null

  const value = new URLSearchParams(window.location.search).get('state')
  return isPreviewState(value) ? value : null
}
