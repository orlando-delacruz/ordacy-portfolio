import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DesktopSidebar } from '@/components/navigation/DesktopSidebar'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { usePageScrollRestoration } from '@/hooks/usePageScrollRestoration'
import { SiteFooter } from './SiteFooter'
import { TopBar } from './TopBar'
import * as S from './styles/root-layout.styled'

export function RootLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()

  // Forward links start at the top; browser back restores the exact position.
  usePageScrollRestoration()

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
            <SiteFooter />
          </S.MainInner>
        </S.Main>
      </S.Content>
      <MobileBottomNav key={pathname} />
    </S.Shell>
  )
}
