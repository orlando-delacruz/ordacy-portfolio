import { Section } from '../components/Section'
import { steps } from '../home.data'
import * as S from './styles/process.styled'

export function Process() {
  return (
    <Section
      id="process"
      title="Challenge to Solution."
      description="A clear path to launch."
    >
      <S.Timeline>
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <S.Step key={step.title}>
              <S.StepNumber aria-hidden="true">
                Step {index + 1}
              </S.StepNumber>
              <S.StepHeader>
                <S.IconBadge>
                  <Icon size={20} strokeWidth={2} aria-hidden="true" />
                </S.IconBadge>
                <S.StepTitle>{step.title}</S.StepTitle>
              </S.StepHeader>
              <S.StepText>{step.description}</S.StepText>
            </S.Step>
          )
        })}
      </S.Timeline>
    </Section>
  )
}
