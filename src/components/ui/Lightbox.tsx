import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDialogFocusTrap } from '@/hooks/useDialogFocusTrap'
import * as S from './styles/lightbox.styled'

type LightboxProps = {
  title: string
  onClose: () => void
  returnFocusTo: HTMLButtonElement | null
  children: ReactNode
  closeLabel?: string
  /** Image-only view: no card or visible title, just the content and a floating close button. */
  bare?: boolean
  /** Dialog width: md (default) for content, sm for confirmations. */
  size?: 'md' | 'sm'
}

export function Lightbox({
  title,
  onClose,
  returnFocusTo,
  children,
  closeLabel = 'Close image viewer',
  bare = false,
  size = 'md',
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

  const closeButton = (
    <S.CloseButton
      ref={closeButtonRef}
      type="button"
      aria-label={closeLabel}
      $bare={bare}
      onClick={requestClose}
    >
      <X size={bare ? 22 : 20} strokeWidth={2} aria-hidden="true" />
    </S.CloseButton>
  )

  // Clicks on the dialog itself (not its content) count as backdrop clicks.
  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) requestClose()
  }

  if (bare) {
    return createPortal(
      <S.BareDialog
        ref={dialogRef}
        aria-label={title}
        $closing={closing}
        data-closing={closing || undefined}
        onClose={onClose}
        onClick={handleBackdropClick}
        onKeyDown={trapFocus}
      >
        {closeButton}
        <S.BareBody onClick={handleBackdropClick}>{children}</S.BareBody>
      </S.BareDialog>,
      document.body,
    )
  }

  return createPortal(
    <S.Dialog
      ref={dialogRef}
      aria-labelledby="lightbox-title"
      $closing={closing}
      $size={size}
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={trapFocus}
    >
      <S.Header>
        <S.Title id="lightbox-title">{title}</S.Title>
        {closeButton}
      </S.Header>
      <S.Body>{children}</S.Body>
    </S.Dialog>,
    document.body,
  )
}
