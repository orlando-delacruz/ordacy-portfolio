import { LayoutGrid, MessagesSquare } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { ContentItems } from '@/components/ui/ContentItems'
import { Section } from '@/components/ui/Section'
import { SecondaryButton } from '@/components/ui/styles/buttons.styled'
import {
  getSection,
  pageHeader,
  problems,
  sectionCopy,
  seo,
  site,
  steps,
} from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ServiceExplorer } from './ServiceExplorer'
import * as S from './styles/about.styled'

const items = (id: string) => getSection('about', id).items

export function AboutUsPage() {
  usePageMeta(seo.about)
  useScrollReveal()

  return (
    <>
      <PageHeader {...pageHeader('about')} />

      <Section id="what-we-do" {...sectionCopy('about', 'what-we-do')}>
        <S.Lead>{site.description}</S.Lead>
      </Section>

      <Section id="problems" {...sectionCopy('about', 'problems')}>
        <S.Services>
          {problems.map((problem) => {
            const Icon = problem.icon
            return (
              <S.Service key={problem.id}>
                <Icon size={22} strokeWidth={2} aria-hidden="true" />
                <div>
                  <h3>{problem.title}</h3>
                  <p>{problem.description}</p>
                  <S.SolvedBy>Addressed by: {problem.solvedBy.join(', ')}</S.SolvedBy>
                </div>
              </S.Service>
            )
          })}
        </S.Services>
      </Section>

      <Section id="offerings" {...sectionCopy('about', 'offerings')}>
        <ServiceExplorer />
      </Section>

      <Section id="approach" {...sectionCopy('about', 'approach')}>
        <ContentItems items={items('approach')} variant="numbered" />
      </Section>

      <Section id="how-we-work" {...sectionCopy('about', 'how-we-work')}>
        <S.Timeline>
          {steps.map((step) => (
            <S.TimelineItem key={step.id}>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </S.TimelineItem>
          ))}
        </S.Timeline>
      </Section>

      <Section id="who-we-help" {...sectionCopy('about', 'who-we-help')}>
        <ContentItems items={items('who-we-help')} variant="ruled" />
      </Section>

      <Section id="expectations" {...sectionCopy('about', 'expectations')}>
        <ContentItems items={items('expectations')} variant="checklist" />
      </Section>

      <Section id="work-with-us" {...sectionCopy('about', 'work-with-us')}>
        <S.Closing>
          <S.PrimaryButton to="/contact">
            <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
            Start a project
          </S.PrimaryButton>
          <SecondaryButton to="/pricing">
            <LayoutGrid size={18} strokeWidth={2} aria-hidden="true" />
            See pricing
          </SecondaryButton>
        </S.Closing>
      </Section>
    </>
  )
}
