import { ChevronDown, ChevronUp, MessagesSquare, Plus } from 'lucide-react'
import { useState } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import * as Sec from '@/components/ui/styles/section.styled'
import type { Faq as FaqItem } from '../home.data'
import { faqs } from '../home.data'
import * as S from './styles/faq.styled'
import { getSection } from '@/data'

// The home page shows only the featured questions (five, flagged in the data).
const featuredFaqs = faqs.filter((faq) => faq.featured)
const homeFaqs = getSection('home', 'faqs')

type FaqProps = {
  id?: string
  title?: string
  description?: string
  items?: readonly FaqItem[]
  /** Adds a "Show all questions" toggle that reveals every published FAQ. */
  expandable?: boolean
}

export function Faq({
  id = 'faqs',
  title = homeFaqs.title,
  description = homeFaqs.description ?? '',
  items = featuredFaqs,
  expandable = false,
}: FaqProps) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? faqs : items
  const canExpand = expandable && faqs.length > items.length
  // All questions start closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // Questions rise in one after another the first time the list scrolls into view.
  const [listRef, revealed] = useRevealOnce<HTMLDivElement>(0.15)

  return (
    <Sec.Wrapper id={id} aria-labelledby={`${id}-title`}>
      <S.Layout>
        <S.Intro>
          <Sec.Title id={`${id}-title`} data-reveal="">
            {title}
          </Sec.Title>
          <Sec.Description data-reveal="1">{description}</Sec.Description>
        </S.Intro>

        {/* No page-wide data-reveal here: the list's own reveal staggers its items. */}
        <S.List ref={listRef} data-revealed={revealed || undefined}>
          {visible.map((faq, index) => {
            const open = openIndex === index
            const Icon = faq.icon

            return (
              <S.Item key={faq.id} $index={showAll ? 0 : index}>
                {showAll && faq.category !== visible[index - 1]?.category && (
                  <S.Category>{faq.category}</S.Category>
                )}
                <S.ItemHeading>
                  <S.Question
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${id}-answer-${index}`}
                    id={`${id}-question-${index}`}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <S.QuestionIcon $open={open} aria-hidden="true">
                      <Icon size={18} strokeWidth={2} />
                    </S.QuestionIcon>
                    <S.QuestionText>{faq.question}</S.QuestionText>
                    <S.Toggle $open={open} aria-hidden="true">
                      <Plus size={18} strokeWidth={2.25} />
                    </S.Toggle>
                  </S.Question>
                </S.ItemHeading>
                <S.Panel
                  $open={open}
                  role="region"
                  id={`${id}-answer-${index}`}
                  aria-labelledby={`${id}-question-${index}`}
                >
                  <S.Clip>
                    <S.Answer $open={open}>{faq.answer}</S.Answer>
                  </S.Clip>
                </S.Panel>
              </S.Item>
            )
          })}
        </S.List>

        <S.Aside data-reveal="2">
          {canExpand && (
            <S.ShowAll
              type="button"
              aria-expanded={showAll}
              onClick={() => {
                setShowAll((value) => !value)
                setOpenIndex(null)
              }}
            >
              {showAll ? (
                <ChevronUp size={18} strokeWidth={2} aria-hidden="true" />
              ) : (
                <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
              )}
              {showAll ? 'Show fewer questions' : `Show all ${faqs.length} questions`}
            </S.ShowAll>
          )}
          <S.AsideText>Have a question that isn't listed here?</S.AsideText>
          <S.SecondaryButton to="/contact">
            <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
            Ask us directly
          </S.SecondaryButton>
        </S.Aside>
      </S.Layout>
    </Sec.Wrapper>
  )
}
