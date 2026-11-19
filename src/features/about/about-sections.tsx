import {
  CircleCheck,
  FileText,
  Globe,
  Layers,
  MessageSquareQuote,
  MessagesSquare,
  Rocket,
  Target,
} from 'lucide-react'
import type { ContentItem, Step } from '@/data'
import * as S from './styles/about-sections.styled'

const principleIcons = [
  MessagesSquare,
  Target,
  FileText,
  Layers,
  MessageSquareQuote,
] as const

const audienceIcons = [Rocket, MessagesSquare, FileText, Globe] as const

export function Principles({ items }: { items: readonly ContentItem[] }) {
  return (
    <S.PrinciplesList>
      {items.map((item, index) => {
        const Icon = principleIcons[index % principleIcons.length]

        return (
          <S.PrincipleCard key={item.title}>
            <S.CardTile>
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
            </S.CardTile>
            <S.PrincipleNumber aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </S.PrincipleNumber>
            <S.PrincipleTitle>{item.title}</S.PrincipleTitle>
            <S.CardText>{item.text}</S.CardText>
          </S.PrincipleCard>
        )
      })}
    </S.PrinciplesList>
  )
}

export function ProcessPath({ steps }: { steps: readonly Step[] }) {
  return (
    <S.ProcessList>
      {steps.map((step) => {
        const Icon = step.icon

        return (
          <S.ProcessStep key={step.id}>
            <S.ProcessIcon>
              <Icon size={24} aria-hidden="true" />
            </S.ProcessIcon>
            <S.ProcessTitle>{step.title}</S.ProcessTitle>
            <S.ProcessText>{step.description}</S.ProcessText>
          </S.ProcessStep>
        )
      })}
    </S.ProcessList>
  )
}

export function Audience({ items }: { items: readonly ContentItem[] }) {
  return (
    <S.AudienceList>
      {items.map((item, index) => {
        const Icon = audienceIcons[index % audienceIcons.length]

        return (
          <S.AudienceCard key={item.title}>
            <S.CardTile>
              <Icon size={18} aria-hidden="true" />
            </S.CardTile>
            <S.AudienceBody>
              <S.CardTitle>{item.title}</S.CardTitle>
              <S.CardText>{item.text}</S.CardText>
            </S.AudienceBody>
          </S.AudienceCard>
        )
      })}
    </S.AudienceList>
  )
}

export function Expectations({ items }: { items: readonly ContentItem[] }) {
  return (
    <S.ExpectationsList>
      {items.map((item) => (
        <S.Expectation key={item.title}>
          <S.ExpectationIcon>
            <CircleCheck size={20} aria-hidden="true" />
          </S.ExpectationIcon>
          <S.ExpectationBody>
            <S.ExpectationTitle>{item.title}</S.ExpectationTitle>
            <S.ExpectationText>{item.text}</S.ExpectationText>
          </S.ExpectationBody>
        </S.Expectation>
      ))}
    </S.ExpectationsList>
  )
}
