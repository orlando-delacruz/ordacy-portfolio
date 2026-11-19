import { Clock, FileText, Printer } from 'lucide-react'
import type { LegalDocument } from '@/data'
import * as S from '../styles/legal.styled'
import { readingTime } from '../readingTime'

type LegalMetaProps = {
  document: LegalDocument
}

/** Reading time, section count, and the print action above the document. */
export function LegalMeta({ document }: LegalMetaProps) {
  return (
    <S.Meta data-print-hide>
      <S.MetaItem>
        <Clock size={16} strokeWidth={2} aria-hidden="true" />
        {readingTime(document)}
      </S.MetaItem>
      <S.MetaItem>
        <FileText size={16} strokeWidth={2} aria-hidden="true" />
        {document.sections.length} sections
      </S.MetaItem>
      <S.PrintButton type="button" onClick={() => window.print()}>
        <Printer size={18} strokeWidth={2} aria-hidden="true" />
        Print
      </S.PrintButton>
    </S.Meta>
  )
}
