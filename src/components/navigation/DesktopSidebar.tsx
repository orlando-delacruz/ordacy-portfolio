import type { NavigationItem } from './navigation'
import { primaryNavItems, secondaryNavItems } from './navigation'
import { BrandLogo, Wordmark } from './Wordmark'
import * as S from './styles/desktop-sidebar.styled'

type DesktopSidebarProps = {
  collapsed: boolean
}

export function DesktopSidebar({ collapsed }: DesktopSidebarProps) {
  const renderItem = (item: NavigationItem) => {
    const Icon = item.icon

    return (
      <S.NavItem
        key={item.to}
        to={item.to}
        end={item.end}
        $collapsed={collapsed}
        data-tooltip={collapsed ? item.label : undefined}
      >
        <S.ItemIcon>
          <Icon size={20} strokeWidth={2} aria-hidden="true" />
        </S.ItemIcon>
        <S.Label $collapsed={collapsed}>{item.label}</S.Label>
      </S.NavItem>
    )
  }

  return (
    <S.Sidebar
      $collapsed={collapsed}
      aria-label="Ordacy sidebar"
      data-print-hide
    >
      <S.BrandRow $collapsed={collapsed}>
        <S.BrandLink
          to="/"
          $collapsed={collapsed}
          aria-label="Ordacy home"
        >
          <BrandLogo />
          <S.BrandWordmark $collapsed={collapsed}>
            <Wordmark />
          </S.BrandWordmark>
        </S.BrandLink>
      </S.BrandRow>

      <S.NavScroll>
        <S.Nav id="desktop-primary-navigation" aria-label="Primary navigation">
          <S.GroupLabel $collapsed={collapsed}>Menu</S.GroupLabel>
          {primaryNavItems.map(renderItem)}
        </S.Nav>

        <S.Nav aria-label="Pages navigation">
          <S.NavDivider $collapsed={collapsed} />
          <S.GroupLabel $collapsed={collapsed}>Pages</S.GroupLabel>
          {secondaryNavItems.map(renderItem)}
        </S.Nav>
      </S.NavScroll>
    </S.Sidebar>
  )
}
