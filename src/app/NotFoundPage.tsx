import { ClosingCta } from '@/components/ui/ClosingCta'
import { closingCta, pageHeader, seo } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import * as S from './styles/not-found-page.styled'

const copy = pageHeader('not-found')
const cta = closingCta('not-found', 'cta')

export function NotFoundPage() {
  usePageMeta(seo.notFound)
  useScrollReveal()

  return (
    <>
      <S.Section aria-labelledby="not-found-title">
        <S.Code>{copy.eyebrow}</S.Code>
        <S.Title id="not-found-title">{copy.title}</S.Title>
        <S.Description>{copy.description}</S.Description>
      </S.Section>

      <ClosingCta id="cta" titleId="not-found-cta-title" {...cta} />
    </>
  )
}
