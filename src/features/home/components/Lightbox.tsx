import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDialogFocusTrap } from '@/hooks/useDialogFocusTrap'
import * as S from './styles/lightbox.styled'

type LightboxProps = {
  title: string
  onClose: () => void
  returnFocusTo: HTMLButtonElement | null
  children: ReactNode
}

export function Lightbox({
  title,
  onClose,
  returnFocusTo,
  children,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const [closing, setClosing] = useState(false)
  const trapFocus = useDialogFocusTrap(dialogRef)
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || !dialog.open || closing) return

    if (reduceMotion) {
      dialog.close()
      return
    }

    setClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      if (dialogRef.current?.open) dialogRef.current.close()
    }, S.CLOSE_MS)
  }, [closing, reduceMotion])

  const handleCancel = useEffectEvent((event: Event) => {
    event.preventDefault()
    requestClose()
  })

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    // Intercept Escape before the browser can act on it, so closing the
    // dialog always plays the exit animation.
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      requestClose()
    }
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!dialog.open) dialog.showModal()
    closeButtonRef.current?.focus()

    // Native cancel event as a backup: animate out instead of closing instantly.
    // (Used instead of React's onCancel so Escape is always intercepted.)
    dialog.addEventListener('cancel', handleCancel)
    window.addEventListener('keydown', handleKeyDown, true)

    const bodyOverflow = document.body.style.overflow
    const rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      dialog.removeEventListener('cancel', handleCancel)
      window.removeEventListener('keydown', handleKeyDown, true)
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow

      requestAnimationFrame(() => {
        if (dialog.isConnected) return

        if (returnFocusTo?.offsetParent !== null) returnFocusTo?.focus()
      })
    }
  }, [returnFocusTo])

  return createPortal(
    <S.Dialog
      ref={dialogRef}
      aria-labelledby="lightbox-title"
      $closing={closing}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose()
      }}
      onKeyDown={trapFocus}
    >
      <S.Header>
        <S.Title id="lightbox-title">{title}</S.Title>
        <S.CloseButton
          ref={closeButtonRef}
          type="button"
          aria-label="Close image viewer"
          onClick={requestClose}
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </S.CloseButton>
      </S.Header>
      <S.Body>{children}</S.Body>
    </S.Dialog>,
    document.body,
  )
}
