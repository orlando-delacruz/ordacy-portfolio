import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import styled, { css, keyframes } from 'styled-components'

type LightboxProps = {
  title: string
  onClose: () => void
  returnFocusTo: HTMLButtonElement | null
  children: ReactNode
}

const CLOSE_MS = 200

const backdropIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const cardIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const cardOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.98);
  }
`

const Dialog = styled.dialog<{ $closing: boolean }>`
  width: min(92vw, 56rem);
  max-height: 90vh;
  max-height: 90dvh;
  margin: auto;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: auto;
  animation: ${cardIn} 220ms ease-out;

  &::backdrop {
    background: rgba(0, 20, 32, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: ${backdropIn} 220ms ease-out;
  }

  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${cardOut} ${CLOSE_MS}ms ease-in forwards;

      &::backdrop {
        opacity: 0;
        transition: opacity ${CLOSE_MS}ms ease-in;
      }
    `}

  @media (prefers-reduced-motion: reduce) {
    &,
    &::backdrop {
      animation: none;
    }
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:active {
    transform: scale(0.96);
  }
`

const Body = styled.div`
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
`

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
    }, CLOSE_MS)
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
    <Dialog
      ref={dialogRef}
      aria-labelledby="lightbox-title"
      $closing={closing}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return

        const dialog = dialogRef.current
        if (!dialog) return

        const focusable = [
          ...dialog.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled])',
          ),
        ].filter((element) => element.offsetParent !== null)

        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }}
    >
      <Header>
        <Title id="lightbox-title">{title}</Title>
        <CloseButton
          ref={closeButtonRef}
          type="button"
          aria-label="Close image viewer"
          onClick={requestClose}
        >
          <X size={20} strokeWidth={2} aria-hidden="true" />
        </CloseButton>
      </Header>
      <Body>{children}</Body>
    </Dialog>,
    document.body,
  )
}
