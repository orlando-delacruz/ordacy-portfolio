import { useCallback, useEffect, useRef } from 'react'
import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppTheme } from '@/app/theme-context'
import { breakpoints } from '@/styles/breakpoints'
import { MobileMoreMenu } from '@/components/navigation/MobileMoreMenu'
import {
  getPageTitle,
  moreNavItem,
  secondaryNavItems,
} from '@/components/navigation/navigation'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import * as S from './styles/top-bar.styled'

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
      <S.Header>
        <S.Inner>
          <S.BrandLink to="/" aria-label="Ordacy home">
            <BrandLogo />
            <Wordmark />
          </S.BrandLink>

          <S.SidebarToggle
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            aria-controls="desktop-primary-navigation"
            onClick={onToggleSidebar}
          >
            <SidebarIcon size={20} strokeWidth={2} aria-hidden="true" />
          </S.SidebarToggle>

          <S.Title>{getPageTitle(pathname)}</S.Title>

          <S.Actions>
            <S.ThemeToggle
              type="button"
              aria-label={label}
              title={label}
              onClick={toggleTheme}
            >
              <ThemeIcon size={20} strokeWidth={2} aria-hidden="true" />
            </S.ThemeToggle>
            <S.MoreButton
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
            </S.MoreButton>
          </S.Actions>
        </S.Inner>
      </S.Header>

      {moreOpen && (
        <MobileMoreMenu
          onClose={closeMore}
          returnFocusRef={moreButtonRef}
        />
      )}
    </>
  )
}
