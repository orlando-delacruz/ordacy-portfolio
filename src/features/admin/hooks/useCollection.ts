import { useCallback, useEffect, useState } from 'react'
import type { Collection } from '@/services'
import { useToast } from '../components/toast-context'

export type LoadStatus = 'loading' | 'ready' | 'error'

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.'

/**
 * Loads a collection and wraps mutations with success/error feedback.
 * Components never touch storage directly; they call `mutate` with a
 * service operation.
 */
export function useCollection<T extends { id: string }>(
  service: Collection<T>,
) {
  const [items, setItems] = useState<T[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [version, setVersion] = useState(0)
  const toast = useToast()

  useEffect(() => {
    let active = true
    service.list().then(
      (records) => {
        if (!active) return
        setItems(records)
        setStatus('ready')
      },
      () => active && setStatus('error'),
    )
    return () => {
      active = false
    }
  }, [service, version])

  const refresh = useCallback(() => {
    setStatus('loading')
    setVersion((current) => current + 1)
  }, [])

  /** Runs a service call, shows feedback, and re-reads the list. */
  const mutate = useCallback(
    async (action: () => Promise<unknown>, success: string) => {
      try {
        await action()
        setItems(await service.list())
        toast.show(success, 'success')
        return true
      } catch (error) {
        toast.show(errorMessage(error), 'error')
        return false
      }
    },
    [service, toast],
  )

  return { items, status, refresh, mutate }
}

/** Same pattern for a single document (site details, settings). */
export function useDocument<T>(store: {
  get(): Promise<T>
  save(value: T): Promise<T>
}) {
  const [value, setValue] = useState<T | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const toast = useToast()

  useEffect(() => {
    let active = true
    store.get().then(
      (next) => {
        if (!active) return
        setValue(next)
        setStatus('ready')
      },
      () => active && setStatus('error'),
    )
    return () => {
      active = false
    }
  }, [store])

  const save = useCallback(
    async (next: T, success: string) => {
      try {
        setValue(await store.save(next))
        toast.show(success, 'success')
        return true
      } catch (error) {
        toast.show(errorMessage(error), 'error')
        return false
      }
    },
    [store, toast],
  )

  return { value, status, save }
}
