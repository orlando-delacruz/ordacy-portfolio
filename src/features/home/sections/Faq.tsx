import { ListChecks, MessagesSquare, Plus } from 'lucide-react'
import { useState } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import { Section } from '@/components/ui/Section'
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
}

type FaqListProps = {
  id: string
  items: readonly FaqItem[]
  /** Adds category labels above the first question of each group. */
  showCategories?: boolean
  /** Skips the first-seen rise animation (used while filtering). */
  animate?: boolean
}

/** Accordion list shared by the home FAQ, the Pricing page, and /faqs. */
export function FaqList({
  id,
  items,
  showCategories = false,
  animate = true,
}: FaqListProps) {
  // All questions start closed; track by id so filtering cannot open another.
  const [openId, setOpenId] = useState<string | null>(null)
  // Questions rise in one after another the first time the list scrolls into view.
  const [listRef, revealed] = useRevealOnce<HTMLDivElement>(0.15)

  return (
    <S.List
      ref={listRef}
      data-revealed={animate && revealed ? '' : undefined}
      data-static={animate ? undefined : ''}
    >
      {items.map((faq, index) => {
        const open = openId === faq.id

        return (
          <S.Item key={faq.id} $index={index}>
            {showCategories && faq.category !== items[index - 1]?.category && (
              <S.Category>{faq.category}</S.Category>
            )}
            <S.ItemHeading>
              <S.Question
                type="button"
                aria-expanded={open}
                aria-controls={`${id}-answer-${index}`}
                id={`${id}-question-${index}`}
                onClick={() => setOpenId(open ? null : faq.id)}
              >
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
  )
}

export function Faq({
  id = 'faqs',
  title = homeFaqs.title,
  description = homeFaqs.description ?? '',
  items = featuredFaqs,
}: FaqProps) {
  return (
    <Section id={id} title={title} description={description}>
      <S.Layout>
        <FaqList id={id} items={items} />

        <S.Aside data-reveal="2">
          <S.AsideActions>
            <S.PrimaryButton to="/faqs">
              <ListChecks size={18} strokeWidth={2} aria-hidden="true" />
              All FAQs
            </S.PrimaryButton>
            <S.SecondaryButton to="/contact">
              <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
              Contact us
            </S.SecondaryButton>
          </S.AsideActions>
        </S.Aside>
      </S.Layout>
    </Section>
  )
}
