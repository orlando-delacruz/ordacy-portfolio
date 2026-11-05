const dateTime = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const dateOnly = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' })

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))

export const formatDate = (iso: string) => dateOnly.format(new Date(iso))

/** Lowercase, hyphenated id from free text. */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

export const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

/** Splits a textarea into trimmed, non-empty lines. */
export const lines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

/** Renumbers displayOrder 1..n after a move or delete. */
export const renumber = <T extends { displayOrder: number }>(items: T[]) =>
  items.map((item, index) => ({ ...item, displayOrder: index + 1 }))

export const byOrder = <T extends { displayOrder: number }>(a: T, b: T) =>
  a.displayOrder - b.displayOrder

/** Returns a copy with the item at `index` moved by `delta`, renumbered. */
export function move<T extends { displayOrder: number }>(
  items: T[],
  index: number,
  delta: number,
) {
  const target = index + delta
  if (target < 0 || target >= items.length) return items
  const next = [...items]
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return renumber(next)
}

/** Reads a trimmed string from FormData. */
export const text = (data: FormData, key: string) =>
  String(data.get(key) ?? '').trim()
