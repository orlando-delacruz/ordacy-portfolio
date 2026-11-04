import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { TopBar } from './TopBar'
import * as S from './styles/root-layout.styled'

export function RootLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()

  return (
    <S.Shell>
      <S.SkipLink href="#main-content">Skip to content</S.SkipLink>
      <DesktopSidebar collapsed={collapsed} />
      <S.Content $collapsed={collapsed}>
        <TopBar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((current) => !current)}
        />
        <S.Main id="main-content" tabIndex={-1}>
          <S.MainInner>
            <Outlet />
          </S.MainInner>
        </S.Main>
      </S.Content>
      <MobileBottomNav key={pathname} />
    </S.Shell>
  )
}
