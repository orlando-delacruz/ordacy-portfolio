import { MessagesSquare, Plus } from 'lucide-react'
import { useState } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import * as Sec from '../components/styles/section.styled'
import { faqs } from '../home.data'
import * as S from './styles/faq.styled'

// The home page shows only the featured questions (five, flagged in home.data.ts).
const featuredFaqs = faqs.filter((faq) => faq.featured)

export function Faq() {
  // All questions start closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // Questions rise in one after another the first time the list scrolls into view.
  const [listRef, revealed] = useRevealOnce<HTMLDivElement>(0.15)

  return (
    <Sec.Wrapper id="faqs" aria-labelledby="faqs-title">
      <S.Layout>
        <S.Intro>
          <Sec.Title id="faqs-title" data-reveal="">
            Common Questions, Answered.
          </Sec.Title>
          <Sec.Description data-reveal="1">
            Answers before you commit.
          </Sec.Description>
        </S.Intro>

        {/* No page-wide data-reveal here: the list's own reveal staggers its items. */}
        <S.List ref={listRef} data-revealed={revealed || undefined}>
          {featuredFaqs.map((faq, index) => {
            const open = openIndex === index
            const Icon = faq.icon

            return (
              <S.Item key={faq.question} $index={index}>
                <S.ItemHeading>
                  <S.Question
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
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
                  id={`faq-answer-${index}`}
                  aria-labelledby={`faq-question-${index}`}
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
