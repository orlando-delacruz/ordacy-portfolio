import { useCallback, useEffect, useRef } from 'react'
import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppTheme } from '@/app/theme-context'
import { breakpoints } from '@/styles/breakpoints'
import { MobileMoreMenu } from '@/components/navigation/MobileMoreMenu'
import {
  getPageTitle,
  moreNavItem,
  secondaryNavItems,
} from '@/components/navigation/navigation'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface.default};
`

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  min-height: 3.5rem;
  margin-inline: auto;
  padding: env(safe-area-inset-top) ${({ theme }) => theme.spacing.lg} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    min-height: 4rem;
  }
`

const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  text-decoration: none;

  &:hover {
    color: inherit;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

const Title = styled.p`
  display: none;
  min-width: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: auto;
`

const ThemeToggle = styled.button`
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

const MoreButton = styled(ThemeToggle)`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

const SidebarToggle = styled(ThemeToggle)`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: grid;
  }
`

type TopBarProps = {
  collapsed: boolean
  onToggleSidebar: () => void
}

export function TopBar({ collapsed, onToggleSidebar }: TopBarProps) {
  const { pathname, hash, key } = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useAppTheme()
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const moreOpen = hash === '#more'
  const secondaryActive = secondaryNavItems.some(
    (item) => item.to === pathname,
  )
  const label =
    theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  const ThemeIcon = theme === 'dark' ? Sun : Moon
  const MoreIcon = moreNavItem.icon
  const SidebarIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  const closeMore = useCallback(() => {
    if (key === 'default') {
      navigate({ pathname, hash: '' }, { replace: true })
    } else {
      navigate(-1)
    }
  }, [key, navigate, pathname])

  useEffect(() => {
    if (!moreOpen) return

    const desktop = window.matchMedia(`(min-width: ${breakpoints.lg})`)
    const closeOnDesktop = () => {
      if (desktop.matches) closeMore()
    }

    closeOnDesktop()
    desktop.addEventListener('change', closeOnDesktop)

    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [closeMore, moreOpen])

  return (
    <>
      <Header>
        <Inner>
          <BrandLink to="/" aria-label="Ordacy home">
            <BrandLogo />
            <Wordmark />
          </BrandLink>

          <SidebarToggle
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            aria-controls="desktop-primary-navigation"
            onClick={onToggleSidebar}
          >
            <SidebarIcon size={20} strokeWidth={2} aria-hidden="true" />
          </SidebarToggle>

          <Title>{getPageTitle(pathname)}</Title>

          <Actions>
            <ThemeToggle
              type="button"
              aria-label={label}
              title={label}
              onClick={toggleTheme}
            >
              <ThemeIcon size={20} strokeWidth={2} aria-hidden="true" />
            </ThemeToggle>
            <MoreButton
              ref={moreButtonRef}
              type="button"
              aria-label={moreNavItem.label}
              aria-expanded={moreOpen}
              aria-haspopup="dialog"
              aria-controls={moreOpen ? 'mobile-more-dialog' : undefined}
              aria-current={secondaryActive ? 'page' : undefined}
              onClick={() => {
                if (!moreOpen) navigate({ pathname, hash: 'more' })
              }}
            >
              <MoreIcon size={20} strokeWidth={2} aria-hidden="true" />
            </MoreButton>
          </Actions>
        </Inner>
      </Header>

      {moreOpen && (
        <MobileMoreMenu
          onClose={closeMore}
          returnFocusRef={moreButtonRef}
        />
      )}
    </>
  )
}
