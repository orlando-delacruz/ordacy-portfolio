import { PageHeader } from '@/components/common/PageHeader'
import { getSection, pageHeader, seo, site } from '@/data'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { ContactForm } from './ContactForm'
import * as S from './styles/contact.styled'

const nextSteps = getSection('contact', 'next-steps')

type Detail = { label: string; value: string; href?: string }

export function ContactPage() {
  usePageMeta(seo.contact)
  useScrollReveal()

  // Only confirmed contact details are shown; pending ones stay hidden.
  const { email, phone, location } = site.contact
  const details: Detail[] = []
  if (email.value) {
    details.push({
      label: 'Email',
      value: email.value,
      href: `mailto:${email.value}`,
    })
  }
  if (phone.value) {
    details.push({
      label: 'Phone',
      value: phone.value,
      href: `tel:${phone.value}`,
    })
  }
  if (location.value) details.push({ label: 'Location', value: location.value })

  return (
    <>
      <PageHeader {...pageHeader('contact')} />

      <S.Layout>
        <S.Aside data-reveal="1" aria-labelledby="contact-next">
          <S.AsideTitle id="contact-next">{nextSteps.title}</S.AsideTitle>
          <S.Steps>
            {(nextSteps.items ?? []).map((step) => (
              <S.Step key={step.title}>
                <div>
                  <S.StepTitle>{step.title}</S.StepTitle>
                  <S.StepText>{step.text}</S.StepText>
                </div>
              </S.Step>
            ))}
          </S.Steps>

          {details.length > 0 && (
            <S.Details>
              {details.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>
                    {item.href ? (
                      <a href={item.href}>{item.value}</a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </S.Details>
          )}
        </S.Aside>

        <div data-reveal="2">
          <ContactForm />
        </div>
      </S.Layout>
    </>
  )
}
