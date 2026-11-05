import { CircleAlert, CircleCheck, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from './toast-context'
import type { ToastTone } from './toast-context'
import * as S from './styles/toast.styled'

type Toast = { id: number; message: string; tone: ToastTone }

const DISMISS_MS = 4500

/** Success and error feedback for admin actions, announced politely. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const show = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      const id = nextId.current++
      setToasts((current) => [...current.slice(-2), { id, message, tone }])
      timers.current.set(id, window.setTimeout(() => dismiss(id), DISMISS_MS))
    },
    [dismiss],
  )

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <S.Region role="status" aria-live="polite">
        {toasts.map((toast) => (
          <S.Toast key={toast.id} $tone={toast.tone}>
            {toast.tone === 'success' ? (
              <CircleCheck size={18} strokeWidth={2} aria-hidden="true" />
            ) : (
              <CircleAlert size={18} strokeWidth={2} aria-hidden="true" />
            )}
            <span>{toast.message}</span>
            <S.Dismiss
              type="button"
              aria-label="Dismiss message"
              onClick={() => dismiss(toast.id)}
            >
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </S.Dismiss>
          </S.Toast>
        ))}
      </S.Region>
    </ToastContext.Provider>
  )
}
