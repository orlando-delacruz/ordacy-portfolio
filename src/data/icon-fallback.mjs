// Per-field icon fallback for live content.
//
// A stored icon name that no longer resolves must not fail the whole content
// payload: the item keeps a working icon and the mismatch is reported once
// per field/value, so a run of bad rows cannot flood the console.
//
// The helper is a plain .mjs module so `node --test` can exercise it; the
// browser imports it through the sibling declaration file.

/**
 * @template T
 * @param {T} fallbackIcon
 * @param {(message: string) => void} [warn]
 * @returns {(name: string, field: string) => T}
 */
export function createIconFallback(fallbackIcon, warn = console.warn) {
  const warned = new Set()
  return (name, field) => {
    const key = `${field}:${name}`
    if (!warned.has(key)) {
      warned.add(key)
      warn(`Unknown icon "${name}" in ${field}; using the fallback icon.`)
    }
    return fallbackIcon
  }
}
