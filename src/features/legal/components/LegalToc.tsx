import { ListTree } from 'lucide-react'
import type { LegalSection } from '@/data'
import * as S from '../styles/legal.styled'

type LegalTocProps = {
  sections: readonly LegalSection[]
  activeId: string | null
}

/** Sticky table of contents with the current section marked. */
export function LegalToc({ sections, activeId }: LegalTocProps) {
  return (
    <S.Toc data-print-hide aria-labelledby="legal-toc-title">
      <S.TocTitle id="legal-toc-title">
        <ListTree size={16} strokeWidth={2} aria-hidden="true" />
        On this page
      </S.TocTitle>
      <S.TocList>
        {sections.map((section, index) => {
          const active = activeId === section.id

          return (
            <li key={section.id}>
              <S.TocLink
                href={`#${section.id}`}
                $active={active}
                aria-current={active ? 'location' : undefined}
              >
                <S.TocNumber aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </S.TocNumber>
                {section.tocLabel}
              </S.TocLink>
            </li>
          )
        })}
      </S.TocList>
    </S.Toc>
  )
}
