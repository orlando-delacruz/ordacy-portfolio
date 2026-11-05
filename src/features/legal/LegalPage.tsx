import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import type { LegalDocument, PageSeo } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
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

/** Long-form legal layout: table of contents beside the document. */
export function LegalPage({ seo, document }: LegalPageProps) {
  usePageMeta(seo)
  useScrollReveal()

  return (
    <>
      <PageHeader
        eyebrow={`Last updated ${formatDate(document.updated)}`}
        title={document.title}
        description={document.intro}
      />

      <S.Layout>
        <S.Toc aria-labelledby="legal-toc-title">
          <h2 id="legal-toc-title">On this page</h2>
          <ol>
            {document.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>
                  <ChevronRight size={14} strokeWidth={2.25} aria-hidden="true" />
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </S.Toc>

        <S.Body>
          {document.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items && (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p>
            Questions? <Link to="/contact">Contact us</Link>.
          </p>
        </S.Body>
      </S.Layout>
    </>
  )
}
