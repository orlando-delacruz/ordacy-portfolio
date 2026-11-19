import {
  CalendarDays,
  ClipboardCheck,
  Headset,
  MessagesSquare,
  Phone,
  Rocket,
  ShieldCheck,
  Tag,
  Users,
  Zap,
} from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHead } from '@/components/ui/SectionHead'
import { ClosingCta } from '@/components/ui/ClosingCta'
import * as Hero from '@/components/ui/styles/page-hero.styled'
import { PrimaryAnchor } from '@/components/ui/styles/buttons.styled'
import { closingCta, getSection, pageHeader, seo } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ContactForm } from './ContactForm'
import * as S from './styles/contact.styled'

const header = pageHeader('contact')
const nextSteps = getSection('contact', 'next-steps')
const assurances = getSection('contact', 'assurances')
const callout = getSection('contact', 'callout')
const cta = closingCta('contact', 'cta')

// The H1's second line renders in teal; everything before it stays white.
const ACCENT_PHRASE = 'your project.'

// Steps and assurances draw their icons by position, matching the copy order.
const stepIcons = [Rocket, ClipboardCheck, CalendarDays]
const assuranceIcons = [ShieldCheck, Zap, Users]

export function ContactPage() {
  usePageMeta(seo.contact)
  useScrollReveal()

  return (
    <>
      <PageHero
        titleId="contact-title"
        eyebrow={header.eyebrow}
        badgeIcon={Phone}
        title={header.title}
        accent={ACCENT_PHRASE}
        description={header.description}
        actions={
          <>
            <PrimaryAnchor href="#inquiry-form">
              <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
              Send inquiry
            </PrimaryAnchor>
            <Hero.GhostButton to="/pricing">
              <Tag size={18} strokeWidth={2} aria-hidden="true" />
              View pricing
            </Hero.GhostButton>
          </>
        }
      />

      <S.Layout>
        <S.FormColumn id="inquiry-form" data-reveal="1">
          <ContactForm />
        </S.FormColumn>

        <S.Aside data-reveal="2" aria-labelledby="contact-next-title">
          <SectionHead id="contact-next" title={nextSteps.title} />

          <S.Steps>
            {(nextSteps.items ?? []).map((step, index) => {
              const Icon = stepIcons[index] ?? Rocket
              return (
                <S.Step key={step.title}>
                  <S.StepNumber aria-hidden="true">{index + 1}</S.StepNumber>
                  <S.StepCard>
                    <S.StepIcon aria-hidden="true">
                      <Icon size={24} strokeWidth={2} />
                    </S.StepIcon>
                    <S.StepBody>
                      <S.StepTitle>{step.title}</S.StepTitle>
                      <S.StepText>{step.text}</S.StepText>
                    </S.StepBody>
                  </S.StepCard>
                </S.Step>
              )
            })}
          </S.Steps>

          {assurances.items && (
            <S.Assurances>
              {assurances.items.map((item, index) => {
                const Icon = assuranceIcons[index] ?? ShieldCheck
                return (
                  <S.Assurance key={item.title}>
                    <Icon size={28} strokeWidth={1.75} aria-hidden="true" />
                    {item.title}
                  </S.Assurance>
                )
              })}
            </S.Assurances>
          )}

          <S.Callout>
            <S.CalloutIcon aria-hidden="true">
              <Headset size={24} strokeWidth={2} />
            </S.CalloutIcon>
            <S.CalloutBody>
              <S.CalloutTitle>{callout.title}</S.CalloutTitle>
              <S.CalloutText>{callout.description}</S.CalloutText>
            </S.CalloutBody>
          </S.Callout>
        </S.Aside>
      </S.Layout>

      <ClosingCta id="cta" titleId="contact-cta-title" {...cta} />
    </>
  )
}
