import type { ReactNode } from 'react'
import { usePageMeta } from '@/hooks/usePageMeta'
import { findAdminNavItem } from '../navigation'
import * as S from './styles/admin-page.styled'

type AdminPageProps = {
  /** Id from data/database/admin-navigation.json; supplies title and intro. */
  navId: string
  actions?: ReactNode
  children: ReactNode
}

/** Admin page frame: heading, description, actions, noindex meta. */
export function AdminPage({ navId, actions, children }: AdminPageProps) {
  const item = findAdminNavItem(navId)

  usePageMeta({
    path: '*',
    title: `${item.label} · Ordacy Admin`,
    description: item.description,
    noindex: true,
  })

  return (
    <S.Page>
      <S.Header>
        <S.HeaderText>
          <S.Title>{item.label}</S.Title>
          <S.Description>{item.description}</S.Description>
        </S.HeaderText>
        {actions && <S.Actions>{actions}</S.Actions>}
      </S.Header>
      {children}
    </S.Page>
  )
}
