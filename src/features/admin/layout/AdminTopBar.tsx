import {
  ChevronDown,
  ExternalLink,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppTheme } from '@/app/theme-context'
import { navItemForPath } from '../navigation'
import * as S from './styles/admin-layout.styled'

type AdminTopBarProps = {
  onOpenMenu: (button: HTMLButtonElement) => void
}

export function AdminTopBar({ onOpenMenu }: AdminTopBarProps) {
  const { theme, toggleTheme } = useAppTheme()
  const { pathname } = useLocation()
  const current = navItemForPath(pathname)
  const ThemeIcon = theme === 'dark' ? Sun : Moon
  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <S.TopBar>
      <S.TopIconButton
        type="button"
        $mobileOnly
        aria-label="Open navigation"
        aria-haspopup="dialog"
        onClick={(event) => onOpenMenu(event.currentTarget)}
      >
        <Menu size={20} strokeWidth={2} aria-hidden="true" />
      </S.TopIconButton>

      <S.Breadcrumb aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          {current && current.path !== '/admin' && (
            <li aria-current="page">{current.label}</li>
          )}
          {current?.path === '/admin' && <li aria-current="page">Dashboard</li>}
        </ol>
      </S.Breadcrumb>

      <S.TopActions>
        <S.TopIconButton
          type="button"
          aria-label={themeLabel}
          title={themeLabel}
          onClick={toggleTheme}
        >
          <ThemeIcon size={18} strokeWidth={2} aria-hidden="true" />
        </S.TopIconButton>
        <ProfileMenu />
      </S.TopActions>
    </S.TopBar>
  )
}

/** Profile menu. Sign-in is not configured, so it says so plainly. */
function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <S.Profile ref={rootRef}>
      <S.ProfileButton
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="admin-profile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <S.Avatar aria-hidden="true">
          <UserRound size={16} strokeWidth={2} />
        </S.Avatar>
        <S.ProfileName>Administrator</S.ProfileName>
        <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
      </S.ProfileButton>

      {open && (
        <S.ProfileMenu id="admin-profile-menu">
          <S.ProfileInfo>
            <strong>Administrator</strong>
            <span>Sign-in is not configured.</span>
          </S.ProfileInfo>
          <S.ProfileLink to="/admin/settings" onClick={() => setOpen(false)}>
            <Settings size={16} strokeWidth={2} aria-hidden="true" />
            Settings
          </S.ProfileLink>
          <S.ProfileAnchor href="/">
            <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
            View public site
          </S.ProfileAnchor>
        </S.ProfileMenu>
      )}
    </S.Profile>
  )
}
