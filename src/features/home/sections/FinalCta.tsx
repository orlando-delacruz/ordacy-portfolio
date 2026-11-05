import {
  ArrowRight,
  ChevronRight,
  Compass,
  FileText,
  Handshake,
  MessageSquareText,
  Rocket,
} from 'lucide-react'
import { Fragment } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import * as S from './styles/final-cta.styled'
import { getSection } from '@/data'

// Mirrors the Process section's steps, condensed for the banner.
const nextSteps = [
  { icon: MessageSquareText, label: 'Share your goals' },
  { icon: FileText, label: 'Get a proposal' },
  { icon: Rocket, label: 'We build it' },
] as const

const copy = getSection('home', 'final-cta')

export function FinalCta() {
  // Shapes drift in and the steps light up in order the first time the banner is seen.
  const [bannerRef, revealed] = useRevealOnce<HTMLElement>(0.3)

  return (
    // Page-wide scroll fade on the wrapper; the banner's own data-revealed drives its inner sequence.
    <div data-reveal="">
      <S.Banner
        ref={bannerRef}
        data-revealed={revealed || undefined}
        aria-labelledby="final-cta-title"
      >
        <S.Decor aria-hidden="true">
          <S.Glow />
          <S.RingLarge />
          <S.RingSmall />
          <S.DotGrid />
          <S.Orbit>
            <S.OrbitDot />
          </S.Orbit>
        </S.Decor>

        <S.Copy>
          <S.Eyebrow>
            <Handshake size={16} strokeWidth={2} aria-hidden="true" />
            {copy.eyebrow}
          </S.Eyebrow>
          <S.Title id="final-cta-title">{copy.title}</S.Title>
          <S.Description>{copy.description}</S.Description>

          <S.Steps aria-label="What happens next">
            {nextSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Fragment key={step.label}>
                  {index > 0 && (
                    <S.Pointer $index={index} aria-hidden="true">
                      <ChevronRight size={16} strokeWidth={2.5} />
                    </S.Pointer>
                  )}
                  <S.StepItem $index={index}>
                    <S.StepIcon>
                      <Icon size={16} strokeWidth={2} aria-hidden="true" />
                    </S.StepIcon>
                    {step.label}
                  </S.StepItem>
                </Fragment>
              )
            })}
          </S.Steps>
        </S.Copy>

        <S.Actions>
          <S.PrimaryButton to="/contact">
            <Rocket size={18} strokeWidth={2} aria-hidden="true" />
            Start a Project
            <S.ButtonArrow aria-hidden="true">
              <ArrowRight size={16} strokeWidth={2.25} />
            </S.ButtonArrow>
          </S.PrimaryButton>
          <S.SecondaryButton to="/#services">
            <Compass size={18} strokeWidth={2} aria-hidden="true" />
            Explore Our Services
          </S.SecondaryButton>
        </S.Actions>
      </S.Banner>
    </div>
  )
}
