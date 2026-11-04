import { useRevealOnce } from '@/hooks/useRevealOnce'
import { Section } from '../components/Section'
import { steps } from '../home.data'
import * as S from './styles/process.styled'

export function Process() {
  // Plays the step sequence once, the first time the timeline scrolls into view.
  const [timelineRef, revealed] = useRevealOnce<HTMLOListElement>()

  return (
    <Section
      id="process"
      title="Challenge to Solution."
      description="A clear path to launch."
    >
      <S.Timeline ref={timelineRef} data-revealed={revealed || undefined}>
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <S.Step key={step.title} $index={index}>
              <S.Marker aria-hidden="true">
                <S.Node>
                  <Icon size={18} strokeWidth={2} />
                </S.Node>
              </S.Marker>
              <S.StepBody>
                <S.StepLabel>Step {String(index + 1).padStart(2, '0')}</S.StepLabel>
                <S.StepTitle>{step.title}</S.StepTitle>
                <S.StepText>{step.description}</S.StepText>
              </S.StepBody>
            </S.Step>
          )
        })}
      </S.Timeline>
    </Section>
  )
}
