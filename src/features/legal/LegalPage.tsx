import { FileText, Home, MessagesSquare, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { ClosingCta } from '@/components/ui/ClosingCta'
import { PageHero } from '@/components/ui/PageHero'
import * as Hero from '@/components/ui/styles/page-hero.styled'
import type { LegalDocument, PageSeo } from '@/data'
import { useActiveSection } from '@/hooks/useActiveSection'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { LegalMeta } from './components/LegalMeta'
import { LegalSection } from './components/LegalSection'
import { LegalToc } from './components/LegalToc'
import * as S from './styles/legal.styled'

type LegalPageProps = {
  seo: PageSeo
  document: LegalDocument
}

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

/** Long-form legal layout: document meta, an active TOC, and readable copy. */
export function LegalPage({ seo, document }: LegalPageProps) {
  usePageMeta(seo)
  useScrollReveal()

  const sectionIds = useMemo(
    () => document.sections.map((section) => section.id),
    [document],
  )
  const activeId = useActiveSection(sectionIds)

  return (
    <>
      <PageHero
        titleId="legal-title"
        eyebrow={`Last updated ${formatDate(document.updated)}`}
        badgeIcon={seo.path === '/privacy-policy' ? ShieldCheck : FileText}
        title={document.title}
        description={document.heroDescription}
        actions={
          <>
            <Hero.PrimaryButton to="/contact">
              <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
              Contact us
            </Hero.PrimaryButton>
            <Hero.GhostButton to="/">
              <Home size={18} strokeWidth={2} aria-hidden="true" />
              Go home
            </Hero.GhostButton>
          </>
        }
      />

      <S.Doc>
        <LegalMeta document={document} />

        <S.Layout>
          <LegalToc sections={document.sections} activeId={activeId} />

          <S.Body>
            <S.PrintHeader>
              <S.PrintTitle>{document.title}</S.PrintTitle>
              <S.PrintMeta>
                Last updated {formatDate(document.updated)}
              </S.PrintMeta>
            </S.PrintHeader>

            <S.Lead>{document.intro}</S.Lead>

            {document.sections.map((section, index) => (
              <LegalSection
                key={section.id}
                section={section}
                index={index}
              />
            ))}
          </S.Body>
        </S.Layout>
      </S.Doc>

      <ClosingCta titleId="legal-cta-title" {...document.cta} />
    </>
  )
}
