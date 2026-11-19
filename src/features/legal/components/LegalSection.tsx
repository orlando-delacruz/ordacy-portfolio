import { Link2 } from 'lucide-react'
import type { LegalSection as LegalSectionData } from '@/data'
import * as S from '../styles/legal.styled'

type LegalSectionProps = {
  section: LegalSectionData
  index: number
}

/** One numbered, linkable document section. */
export function LegalSection({ section, index }: LegalSectionProps) {
  return (
    <S.Section id={section.id} aria-labelledby={`${section.id}-title`}>
      <S.HeadingRow>
        <S.SectionNumber aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </S.SectionNumber>
        <S.SectionTitle id={`${section.id}-title`}>
          {section.title}
        </S.SectionTitle>
        <S.AnchorLink
          href={`#${section.id}`}
          aria-label={`Link to ${section.title}`}
        >
          <Link2 size={16} strokeWidth={2} aria-hidden="true" />
        </S.AnchorLink>
      </S.HeadingRow>

      <S.SectionBody>
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
      </S.SectionBody>
    </S.Section>
  )
}
