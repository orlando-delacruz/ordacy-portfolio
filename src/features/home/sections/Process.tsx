import { Section } from '../components/Section'
import { steps } from '../home.data'
import * as S from './styles/process.styled'

export function Process() {
  return (
    <Section
      id="process"
      title="From Business Challenge to Working Solution."
      description="A clear development process helps keep your project organized, aligned, and moving toward the right outcome."
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
