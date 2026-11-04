import { Fragment } from 'react'
import {
  primaryNavItems,
  secondaryNavItems,
} from './navigation'
import { BrandLogo, Wordmark } from './Wordmark'
import * as S from './styles/desktop-sidebar.styled'

type DesktopSidebarProps = {
  collapsed: boolean
}

export function DesktopSidebar({ collapsed }: DesktopSidebarProps) {
  const navItems = [...primaryNavItems, ...secondaryNavItems]

  return (
    <S.Sidebar $collapsed={collapsed} aria-label="Ordacy sidebar">
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

      <S.Nav id="desktop-primary-navigation" aria-label="Primary navigation">
        {navItems.map((item, index) => {
          const Icon = item.icon

          return (
            <Fragment key={item.to}>
              {index === primaryNavItems.length && (
                <S.Divider aria-hidden="true" />
              )}
              <S.NavItem
                to={item.to}
                end={item.end}
                $collapsed={collapsed}
                data-tooltip={collapsed ? item.label : undefined}
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
                <S.Label $collapsed={collapsed}>{item.label}</S.Label>
              </S.NavItem>
            </Fragment>
          )
        })}
      </S.Nav>
    </S.Sidebar>
  )
}
