import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDialogFocusTrap } from '@/hooks/useDialogFocusTrap'
import { secondaryNavItems } from './navigation'
import { BrandLogo, Wordmark } from './Wordmark'
import * as S from './styles/mobile-more-menu.styled'

type MobileMoreMenuProps = {
  onClose: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export function MobileMoreMenu({
  onClose,
  returnFocusRef,
}: MobileMoreMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const trapFocus = useDialogFocusTrap(dialogRef)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const trigger = returnFocusRef.current

    if (!dialog.open) dialog.showModal()
    closeButtonRef.current?.focus()
    const bodyOverflow = document.body.style.overflow
    const rootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflow
      document.documentElement.style.overflow = rootOverflow

      requestAnimationFrame(() => {
        if (dialog.isConnected) return

        if (trigger?.offsetParent !== null) trigger?.focus()
        else document.getElementById('main-content')?.focus()
      })
    }
  }, [returnFocusRef])

  return createPortal(
    <S.Dialog
      ref={dialogRef}
      id="mobile-more-dialog"
      aria-labelledby="mobile-more-title"
      onClose={onClose}
      onKeyDown={trapFocus}
    >
      <S.Inner>
        <S.Header>
          <S.Brand>
            <BrandLogo />
            <Wordmark />
          </S.Brand>
          <S.CloseButton
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            onClick={() => dialogRef.current?.close()}
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </S.CloseButton>
        </S.Header>

        <S.Title id="mobile-more-title">More</S.Title>

        <nav aria-label="More navigation">
          <S.Section>
            <S.List>
              {secondaryNavItems.map((item) => {
                const Icon = item.icon

                return (
                  <S.Item key={item.to}>
                    <S.ItemLink to={item.to} end={item.end}>
                      <Icon size={20} strokeWidth={2} aria-hidden="true" />
                      <S.ItemLabel>{item.label}</S.ItemLabel>
                      <S.Chevron
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </S.ItemLink>
                  </S.Item>
                )
              })}
            </S.List>
          </S.Section>
        </nav>
      </S.Inner>
    </S.Dialog>,
    document.body,
  )
}
