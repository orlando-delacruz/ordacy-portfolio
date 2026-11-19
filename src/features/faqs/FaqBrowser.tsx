import { MessagesSquare, RotateCcw, SearchX } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchField } from '@/components/ui/SearchField'
import { faqs, getSection } from '@/data'
import { FaqList } from '@/features/home/sections/Faq'
import { TopicFilter } from './components/TopicFilter'
import * as S from './styles/faq-browser.styled'

const categoryNames = [...new Set(faqs.map((faq) => faq.category))]
const topics = [
  { value: 'All', label: 'All', count: faqs.length },
  ...categoryNames.map((name) => ({
    value: name,
    label: name,
    count: faqs.filter((faq) => faq.category === name).length,
  })),
]
const ask = getSection('faqs', 'cta')

export function FaqBrowser() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const normalized = query.trim().toLowerCase()

  const filtered = faqs.filter(
    (faq) =>
      (category === 'All' || faq.category === category) &&
      (!normalized ||
        faq.question.toLowerCase().includes(normalized) ||
        faq.answer.toLowerCase().includes(normalized)),
  )

  const clear = () => {
    setQuery('')
    setCategory('All')
  }

  const resultLabel = normalized
    ? `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'} for “${query.trim()}”`
    : `${filtered.length} of ${faqs.length} questions`

  return (
    <S.Workspace>
      <S.Rail>
        <S.Tools>
          <SearchField
            id="faq-search"
            label="Search questions"
            value={query}
            placeholder="Search questions…"
            onChange={setQuery}
          />
          <TopicFilter
            options={topics}
            value={category}
            onChange={setCategory}
          />
        </S.Tools>

        <S.AskCard aria-labelledby="faq-ask-title">
          <S.AskIcon aria-hidden="true">
            <MessagesSquare size={20} strokeWidth={2} />
          </S.AskIcon>
          <S.AskTitle id="faq-ask-title">{ask.title}</S.AskTitle>
          <S.AskText>{ask.description}</S.AskText>
          <S.AskAction to="/contact">
            <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
            Contact us
          </S.AskAction>
        </S.AskCard>
      </S.Rail>

      <S.Results>
        <S.ResultRow>
          <S.Result aria-live="polite">{resultLabel}</S.Result>
          {(normalized || category !== 'All') && (
            <S.Reset type="button" onClick={clear}>
              <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
              Clear
            </S.Reset>
          )}
        </S.ResultRow>

        {filtered.length > 0 ? (
          <FaqList
            id="all-faqs"
            items={filtered}
            showCategories={category === 'All'}
            animate={false}
          />
        ) : (
          <EmptyState
            icon={SearchX}
            title="No questions match."
            description="Try a different word or clear the filters."
          >
            <S.Reset type="button" onClick={clear}>
              <RotateCcw size={16} strokeWidth={2} aria-hidden="true" />
              Clear filters
            </S.Reset>
          </EmptyState>
        )}
      </S.Results>
    </S.Workspace>
  )
}
