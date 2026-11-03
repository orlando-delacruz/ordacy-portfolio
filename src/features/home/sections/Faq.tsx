import { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'
import { Section } from '../components/Section'
import { faqs } from '../home.data'

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 48rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

const Item = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

const ItemHeading = styled.h3`
  margin: 0;
`

const Question = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  min-height: 3.5rem;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border: 0;
  background: transparent;
  color: ${({ $open, theme }) =>
    $open ? theme.colors.text.accent : theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  text-align: left;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

const Chevron = styled(ChevronDown)<{ $open: boolean }>`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  transition: transform ${({ theme }) => theme.transitions.fast};
`

const Answer = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Section
      id="faqs"
      title="Questions Before Getting Started?"
      description="Here are answers to common questions about our services, project process, pricing, and working arrangements."
    >
      <List>
        {faqs.map((faq, index) => {
          const open = openIndex === index

          return (
            <Item key={faq.question}>
              <ItemHeading>
                <Question
                  type="button"
                  $open={open}
                  aria-expanded={open}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  {faq.question}
                  <Chevron
                    $open={open}
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Question>
              </ItemHeading>
              {open && (
                <Answer
                  role="region"
                  id={`faq-answer-${index}`}
                  aria-labelledby={`faq-question-${index}`}
                >
                  {faq.answer}
                </Answer>
              )}
            </Item>
          )
        })}
      </List>
    </Section>
  )
}
