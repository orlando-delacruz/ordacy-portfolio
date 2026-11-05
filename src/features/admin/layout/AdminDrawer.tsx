import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import { useDialogFocusTrap } from '@/hooks/useDialogFocusTrap'
import { AdminNav } from './AdminNav'
import * as S from './styles/admin-layout.styled'

type AdminDrawerProps = {
  onClose: () => void
  returnFocusTo: HTMLButtonElement | null
}

/** Mobile/tablet navigation: native modal dialog sliding in from the left. */
export function AdminDrawer({ onClose, returnFocusTo }: AdminDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const trapFocus = useDialogFocusTrap(dialogRef)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    closeRef.current?.focus()

    const bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      requestAnimationFrame(() => {
        if (returnFocusTo?.offsetParent !== null) returnFocusTo?.focus()
      })
    }
  }, [returnFocusTo])

  const close = () => dialogRef.current?.close()

  const handleBackdrop = (event: MouseEvent) => {
    if (event.target === event.currentTarget) close()
  }

  return createPortal(
    <S.Drawer
      ref={dialogRef}
      aria-label="Admin navigation"
      onClose={onClose}
      onClick={handleBackdrop}
      onKeyDown={trapFocus}
    >
      <S.DrawerInner>
        <S.DrawerHeader>
          <S.Brand to="/admin" onClick={close} aria-label="Ordacy Admin dashboard">
            <BrandLogo />
            <Wordmark />
            <S.BrandTag>Admin</S.BrandTag>
          </S.Brand>
          <S.TopIconButton
            ref={closeRef}
            type="button"
            aria-label="Close navigation"
            onClick={close}
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </S.TopIconButton>
        </S.DrawerHeader>
        <AdminNav onNavigate={close} />
      </S.DrawerInner>
    </S.Drawer>,
    document.body,
  )
}
