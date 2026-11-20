import {
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppTheme } from '@/app/theme-context'
import { getSupabase } from '@/services/supabase'
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

/** Profile menu: the signed-in account and the sign-out action. */
function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    void getSupabase()
      .then((supabase) => supabase.auth.getSession())
      .then(({ data }) => {
        if (active) setEmail(data.session?.user.email ?? null)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

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

  const signOut = async () => {
    setBusy(true)
    try {
      const supabase = await getSupabase()
      await supabase.auth.signOut()
    } finally {
      navigate('/admin/login', { replace: true })
    }
  }

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
      </S.ProfileButton>

      {open && (
        <S.ProfileMenu id="admin-profile-menu">
          <S.ProfileInfo>
            <strong>{email ?? 'Administrator'}</strong>
            <span>Signed in with two-factor authentication.</span>
          </S.ProfileInfo>
          <S.ProfileLink to="/admin/settings" onClick={() => setOpen(false)}>
            <Settings size={16} strokeWidth={2} aria-hidden="true" />
            Settings
          </S.ProfileLink>
          <S.ProfileAnchor href="/">
            <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
            View public site
          </S.ProfileAnchor>
          <S.ProfileAction type="button" onClick={signOut} disabled={busy}>
            <LogOut size={16} strokeWidth={2} aria-hidden="true" />
            {busy ? 'Signing out…' : 'Sign out'}
          </S.ProfileAction>
        </S.ProfileMenu>
      )}
    </S.Profile>
  )
}
