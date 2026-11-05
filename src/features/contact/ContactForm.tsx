import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Send,
} from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { plans, services } from '@/data'
import { submitInquiry } from '@/services'
import type { InquiryInput } from '@/services'
import * as S from './styles/contact.styled'

type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>
type Status = 'idle' | 'sending' | 'sent' | 'failed'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldOrder: Field[] = ['name', 'email', 'message']

// Budget ranges come from the approved plan prices; nothing is converted.
const budgetOptions = plans.map((plan) =>
  plan.prices.PHP && plan.prices.USD
    ? `${plan.name}: from ${plan.prices.PHP} / ${plan.prices.USD}`
    : `${plan.name}: quoted per project`,
)

const today = () => new Date().toISOString().slice(0, 10)

function validate(data: FormData): Errors {
  const errors: Errors = {}
  if (!String(data.get('name')).trim()) errors.name = 'Enter your name.'

  const email = String(data.get('email')).trim()
  if (!email) errors.email = 'Enter your email address.'
  else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address, like name@company.com.'
  }

  if (String(data.get('message')).trim().length < 10) {
    errors.message =
      'Tell us a little about your project (at least 10 characters).'
  }
  return errors
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <S.ErrorText id={id}>
      <AlertCircle size={16} strokeWidth={2.25} aria-hidden="true" />
      {children}
    </S.ErrorText>
  )
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const successRef = useRef<HTMLDivElement>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return

    const form = event.currentTarget
    const data = new FormData(form)

    // Bots fill the hidden field: pretend success and do nothing.
    if (String(data.get('website'))) {
      setStatus('sent')
      return
    }

    const found = validate(data)
    setErrors(found)
    const firstInvalid = fieldOrder.find((key) => found[key])
    if (firstInvalid) {
      const element = form.elements.namedItem(firstInvalid)
      if (element instanceof HTMLElement) element.focus()
      return
    }

    setStatus('sending')
    const value = (key: string) => String(data.get(key)).trim()
    const inquiry: InquiryInput = {
      name: value('name'),
      email: value('email'),
      business: value('business'),
      service: value('service'),
      plan: value('plan'),
      message: value('message'),
      launchDate: value('launchDate'),
    }

    try {
      await submitInquiry(inquiry)
      setStatus('sent')
      // Move focus to the confirmation so screen readers announce it.
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      setStatus('failed')
    }
  }

  if (status === 'sent') {
    return (
      <S.Success ref={successRef} tabIndex={-1} role="status">
        <CheckCircle2 size={32} strokeWidth={2} aria-hidden="true" />
        <h2>Thank you for sharing your project details.</h2>
        <p>
          We use them to understand your requirements and to discuss scope,
          timeline, and next steps with you.
        </p>
        <S.SecondaryAction
          type="button"
          onClick={() => {
            setErrors({})
            setStatus('idle')
          }}
        >
          <RotateCcw size={18} strokeWidth={2} aria-hidden="true" />
          Send another inquiry
        </S.SecondaryAction>
      </S.Success>
    )
  }

  const describedBy = (key: Field) =>
    errors[key] ? `contact-${key}-error` : undefined

  return (
    <S.Form onSubmit={onSubmit} noValidate>
      <S.Row>
        <S.Field>
          <S.Label htmlFor="contact-name">Full name</S.Label>
          <S.Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            $invalid={!!errors.name}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy('name')}
          />
          {errors.name && (
            <FieldError id="contact-name-error">{errors.name}</FieldError>
          )}
        </S.Field>
        <S.Field>
          <S.Label htmlFor="contact-email">Email address</S.Label>
          <S.Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            $invalid={!!errors.email}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('email')}
          />
          {errors.email && (
            <FieldError id="contact-email-error">{errors.email}</FieldError>
          )}
        </S.Field>
      </S.Row>

      <S.Field>
        <S.Label htmlFor="contact-business">
          Business or company <S.Optional>(optional)</S.Optional>
        </S.Label>
        <S.Input
          id="contact-business"
          name="business"
          autoComplete="organization"
        />
      </S.Field>

      <S.Row>
        <S.Field>
          <S.Label htmlFor="contact-service">
            Project type <S.Optional>(optional)</S.Optional>
          </S.Label>
          <S.Select id="contact-service" name="service" defaultValue="">
            <option value="">Not sure yet</option>
            {services.map((service) => (
              <option key={service.title}>{service.title}</option>
            ))}
          </S.Select>
        </S.Field>
        <S.Field>
          <S.Label htmlFor="contact-plan">
            Budget range <S.Optional>(optional)</S.Optional>
          </S.Label>
          <S.Select id="contact-plan" name="plan" defaultValue="">
            <option value="">Not sure yet</option>
            {budgetOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </S.Select>
        </S.Field>
      </S.Row>

      <S.Field>
        <S.Label htmlFor="contact-message">Project details</S.Label>
        <S.Textarea
          id="contact-message"
          name="message"
          required
          $invalid={!!errors.message}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy('message')}
        />
        {errors.message && (
          <FieldError id="contact-message-error">{errors.message}</FieldError>
        )}
      </S.Field>

      <S.Field>
        <S.Label htmlFor="contact-launch">
          Target launch date <S.Optional>(optional)</S.Optional>
        </S.Label>
        <S.Input id="contact-launch" name="launchDate" type="date" min={today()} />
      </S.Field>

      <S.Trap aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </S.Trap>

      {status === 'failed' && (
        <S.ErrorText role="alert">
          <AlertCircle size={16} strokeWidth={2.25} aria-hidden="true" />
          Something went wrong while sending. Please try again.
        </S.ErrorText>
      )}

      <S.PrimaryAction type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? (
          <Loader2 size={18} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Send size={18} strokeWidth={2} aria-hidden="true" />
        )}
        {status === 'sending' ? 'Sending…' : 'Send inquiry'}
      </S.PrimaryAction>

      <S.Note>
        We only use what you share here to respond to your inquiry.
      </S.Note>
    </S.Form>
  )
}
