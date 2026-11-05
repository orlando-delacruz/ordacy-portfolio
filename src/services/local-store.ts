/*
 * Browser-local persistence. There is no backend yet.
 *
 * Each store starts from its seed in /data/database and saves edits to this
 * browser's localStorage. Nothing is sent to a server and other browsers never
 * see the changes. The public site reads the same saved data on load
 * (src/data/index.ts), so edits appear there in this browser after a reload.
 * "Restore original content" in admin Settings clears everything.
 *
 * Every method is async so a future API client can replace this file
 * without changing callers.
 */

import { STORAGE_PREFIX as PREFIX } from '@/data/storage'
// Small delay so loading states are exercised the way a network would.
const LATENCY_MS = 180

const wait = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS))

const clone = <T>(value: T): T => structuredClone(value)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // Unavailable or corrupt storage: fall back to the seed.
  }
  return clone(fallback)
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: the change lives in memory for this visit.
  }
}

export class NotFoundError extends Error {
  constructor(key: string, id: string) {
    super(`No ${key} record with id "${id}"`)
  }
}

export type Collection<T extends { id: string }> = {
  list(): Promise<T[]>
  get(id: string): Promise<T>
  create(record: T): Promise<T>
  update(id: string, patch: Partial<T>): Promise<T>
  remove(id: string): Promise<void>
  /** Replaces every record, e.g. after reordering. */
  replaceAll(records: T[]): Promise<T[]>
}

export function createCollection<T extends { id: string }>(
  key: string,
  seed: readonly T[],
): Collection<T> {
  let records = load<T[]>(key, [...seed])

  const commit = (next: T[]) => {
    records = next
    save(key, records)
  }

  const find = (id: string) => {
    const record = records.find((item) => item.id === id)
    if (!record) throw new NotFoundError(key, id)
    return record
  }

  return {
    async list() {
      await wait()
      return clone(records)
    },
    async get(id) {
      await wait()
      return clone(find(id))
    },
    async create(record) {
      await wait()
      if (records.some((item) => item.id === record.id)) {
        throw new Error(`A ${key} record with id "${record.id}" already exists`)
      }
      commit([...records, clone(record)])
      return clone(record)
    },
    async update(id, patch) {
      await wait()
      const next = { ...find(id), ...clone(patch), id }
      commit(records.map((item) => (item.id === id ? next : item)))
      return clone(next)
    },
    async remove(id) {
      await wait()
      find(id)
      commit(records.filter((item) => item.id !== id))
    },
    async replaceAll(next) {
      await wait()
      commit(clone(next))
      return clone(records)
    },
  }
}

export type DocumentStore<T> = {
  get(): Promise<T>
  save(value: T): Promise<T>
}

/** A single stored object (site details, settings). */
export function createDocument<T>(key: string, seed: T): DocumentStore<T> {
  let value = load<T>(key, seed)

  return {
    async get() {
      await wait()
      return clone(value)
    },
    async save(next) {
      await wait()
      value = clone(next)
      save(key, value)
      return clone(value)
    },
  }
}

/** Clears every saved edit. The page reloads so stores re-read their seeds. */
export function restoreOriginalContent() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    // Nothing persisted, nothing to clear.
  }
  window.location.reload()
}

export const createId = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().slice(0, 8)}`
