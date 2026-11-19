import { useParams } from 'react-router-dom'
import { NotFoundPage } from '@/app/NotFoundPage'
import { ClosingCta } from '@/components/ui/ClosingCta'
import { closingCta, seo, teamMemberBySlug } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { personJsonLd } from './personJsonLd'
import { TeamHero } from './sections/TeamHero'
import { TeamResume } from './sections/TeamResume'

const cta = closingCta('team', 'cta')

export function TeamMemberPage() {
  const { slug = '' } = useParams()
  const member = teamMemberBySlug(slug)

  const meta = member
    ? {
        path: `/team/${member.slug}`,
        title: `${member.name} — ${member.role} | Ordacy`,
        description: member.headline,
        canonical: null,
        ogTitle: `${member.name} — ${member.role}`,
        ogDescription: member.headline,
        ogImage: member.avatar?.src ?? null,
        noindex: false,
      }
    : seo.notFound
  const structuredData = member ? personJsonLd(member) : undefined

  usePageMeta({ ...meta, ...(structuredData ? { structuredData } : {}) })
  useScrollReveal()

  if (!member) return <NotFoundPage />

  return (
    <>
      <TeamHero member={member} />
      <TeamResume member={member} />
      <ClosingCta id="cta" titleId="team-cta-title" {...cta} />
    </>
  )
}
