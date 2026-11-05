import { FolderKanban, House, MessagesSquare, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { pageHeader, seo } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import * as S from './styles/not-found-page.styled'

const copy = pageHeader('not-found')

const links: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Back to home', to: '/', icon: House },
  { label: 'Projects', to: '/projects', icon: FolderKanban },
  { label: 'Pricing', to: '/pricing', icon: Wallet },
  { label: 'Contact', to: '/contact', icon: MessagesSquare },
]

export function NotFoundPage() {
  usePageMeta(seo.notFound)

  return (
    <S.Section aria-labelledby="not-found-title">
      <S.Code>{copy.eyebrow}</S.Code>
      <S.Title id="not-found-title">{copy.title}</S.Title>
      <S.Description>{copy.description}</S.Description>
      <S.Links aria-label="Suggested pages">
        {links.map(({ label, to, icon: Icon }, index) => {
          const Link = index === 0 ? S.PrimaryLink : S.SecondaryLink
          return (
            <Link key={to} to={to}>
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </S.Links>
    </S.Section>
  )
}
