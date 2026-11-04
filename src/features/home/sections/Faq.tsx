import { useState } from 'react'
import { Section } from '../components/Section'
import { faqs } from '../home.data'
import * as S from './styles/faq.styled'

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Section
      id="faqs"
      title="Questions Before Getting Started?"
      description="Here are answers to common questions about our services, project process, pricing, and working arrangements."
    >
      <S.List>
        {faqs.map((faq, index) => {
          const open = openIndex === index

          return (
            <S.Item key={faq.question}>
              <S.ItemHeading>
                <S.Question
                  type="button"
                  $open={open}
                  aria-expanded={open}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  {faq.question}
                  <S.Chevron
                    $open={open}
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </S.Question>
              </S.ItemHeading>
              {open && (
                <S.Answer
                  role="region"
                  id={`faq-answer-${index}`}
                  aria-labelledby={`faq-question-${index}`}
                >
                  {faq.answer}
                </S.Answer>
              )}
            </S.Item>
          )
        })}
      </S.List>
    </Section>
  )
}
