import { adminNavGroups } from '../navigation'
import * as S from './styles/admin-layout.styled'

/** Grouped admin links; used by the desktop sidebar and the mobile drawer. */
export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <S.Nav aria-label="Admin">
      {adminNavGroups.map((group) => (
        <S.NavGroup key={group.id}>
          <S.NavGroupLabel id={`admin-nav-${group.id}`}>{group.label}</S.NavGroupLabel>
          <S.NavList aria-labelledby={`admin-nav-${group.id}`}>
            {group.items.map(({ id, label, path, Icon }) => (
              <li key={id}>
                <S.NavLink to={path} end={path === '/admin'} onClick={onNavigate}>
                  <Icon size={18} strokeWidth={2} aria-hidden="true" />
                  {label}
                </S.NavLink>
              </li>
            ))}
          </S.NavList>
        </S.NavGroup>
      ))}
    </S.Nav>
  )
}
