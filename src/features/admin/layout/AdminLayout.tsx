import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import { usePageScrollRestoration } from '@/hooks/usePageScrollRestoration'
import { getSupabase } from '@/services/supabase'
import { ToastProvider } from '../components/ToastProvider'
import { LoadingState } from '../components/States'
import { AdminDrawer } from './AdminDrawer'
import { AdminNav } from './AdminNav'
import { AdminTopBar } from './AdminTopBar'
import * as S from './styles/admin-layout.styled'

/*
 * The admin shell renders only for a verified session at AAL2 (password plus
 * TOTP). It waits for the session check before showing any chrome, so a
 * signed-out visitor never sees the admin interface. The server enforces the
 * same rule on every API call; this guard is the UX half.
 */
export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuButton, setMenuButton] = useState<HTMLButtonElement | null>(null)
  const [status, setStatus] = useState<'checking' | 'ready'>('checking')
  const navigate = useNavigate()

  // Same scroll contract as the public shell.
  usePageScrollRestoration()

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined

    const check = async () => {
      let supabase
      try {
        supabase = await getSupabase()
      } catch {
        if (active) navigate('/admin/login', { replace: true })
        return
      }
      if (!active) return

      const { data: subscription } = supabase.auth.onAuthStateChange(
        (event) => {
          if (event === 'SIGNED_OUT') navigate('/admin/login', { replace: true })
        },
      )
      unsubscribe = () => subscription.subscription.unsubscribe()

      // getUser verifies the token server-side, so a session revoked from
      // another device is cleared instead of rendering a broken admin shell.
      const { data, error } = await supabase.auth.getUser()
      if (!active) return
      if (error || !data.user) {
        await supabase.auth.signOut({ scope: 'local' })
        navigate('/admin/login', { replace: true })
        return
      }

      const level = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (!active) return
      if (level.error || level.data?.currentLevel !== 'aal2') {
        navigate('/admin/login', { replace: true })
        return
      }
      setStatus('ready')
    }

    void check()

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [navigate])

  if (status === 'checking') {
    return (
      <S.Shell>
        <S.Main id="admin-main" tabIndex={-1}>
          <LoadingState label="Checking your session…" />
        </S.Main>
      </S.Shell>
    )
  }

  return (
    <ToastProvider>
      <S.Shell>
        <S.SkipLink href="#admin-main">Skip to content</S.SkipLink>

        <S.Sidebar>
          <S.Brand to="/admin" aria-label="Ordacy Admin dashboard">
            <BrandLogo />
            <Wordmark />
            <S.BrandTag>Admin</S.BrandTag>
          </S.Brand>
          <AdminNav />
        </S.Sidebar>

        <S.Content>
          <AdminTopBar
            onOpenMenu={(button) => {
              setMenuButton(button)
              setDrawerOpen(true)
            }}
          />
          <S.Main id="admin-main" tabIndex={-1}>
            <Outlet />
          </S.Main>
        </S.Content>

        {drawerOpen && (
          <AdminDrawer
            onClose={() => setDrawerOpen(false)}
            returnFocusTo={menuButton}
          />
        )}
      </S.Shell>
    </ToastProvider>
  )
}
