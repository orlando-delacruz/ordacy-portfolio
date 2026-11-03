import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { secondaryNavItems } from './navigation'
import { BrandLogo, Wordmark } from './Wordmark'

type MobileMoreMenuProps = {
  onClose: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

const moreIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Dialog = styled.dialog`
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  overflow-y: auto;
  overscroll-behavior: contain;

  &[open] {
    animation: ${moreIn} 180ms ease-out;
  }

  &:focus {
    outline: none;
  }
`

const Inner = styled.div`
  width: 100%;
  max-width: 36rem;
  min-height: 100%;
  margin-inline: auto;
  padding: calc(env(safe-area-inset-top) + ${({ theme }) => theme.spacing.md})
    ${({ theme }) => theme.spacing.lg}
    calc(env(safe-area-inset-bottom) + ${({ theme }) => theme.spacing['2xl']});
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 2.75rem;
`

const Brand = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
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
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

const Title = styled.h2`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
`

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
`

const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  padding: 0;
  list-style: none;
`

const Item = styled.li`
  min-width: 0;
`

const ItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 3.5rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &[aria-current='page'] {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }
`

const ItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Chevron = styled(ChevronRight)`
  flex-shrink: 0;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.7;
`

export function MobileMoreMenu({
  onClose,
  returnFocusRef,
}: MobileMoreMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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
    <Dialog
      ref={dialogRef}
      id="mobile-more-dialog"
      aria-labelledby="mobile-more-title"
      onClose={onClose}
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
      <Inner>
        <Header>
          <Brand>
            <BrandLogo />
            <Wordmark />
          </Brand>
          <CloseButton
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            onClick={() => dialogRef.current?.close()}
          >
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </CloseButton>
        </Header>

        <Title id="mobile-more-title">More</Title>

        <nav aria-label="More navigation">
          <Section>
            <List>
              {secondaryNavItems.map((item) => {
                const Icon = item.icon

                return (
                  <Item key={item.to}>
                    <ItemLink to={item.to} end={item.end}>
                      <Icon size={20} strokeWidth={2} aria-hidden="true" />
                      <ItemLabel>{item.label}</ItemLabel>
                      <Chevron size={18} strokeWidth={2} aria-hidden="true" />
                    </ItemLink>
                  </Item>
                )
              })}
            </List>
          </Section>
        </nav>
      </Inner>
    </Dialog>,
    document.body,
  )
}
