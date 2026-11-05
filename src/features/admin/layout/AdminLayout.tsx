import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BrandLogo, Wordmark } from '@/components/navigation/Wordmark'
import { ToastProvider } from '../components/ToastProvider'
import { AdminDrawer } from './AdminDrawer'
import { AdminNav } from './AdminNav'
import { AdminTopBar } from './AdminTopBar'
import * as S from './styles/admin-layout.styled'

/*
 * No authentication exists yet: anyone who opens /admin sees this interface,
 * so it must not hold real client data until a backend with server-side auth
 * exists. Edits are saved in this browser only (see src/services/local-store.ts).
 */
export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuButton, setMenuButton] = useState<HTMLButtonElement | null>(null)

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
