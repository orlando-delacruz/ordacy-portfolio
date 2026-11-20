import {
  AlertCircle,
  Building2,
  CalendarDays,
  CircleHelp,
  Layers,
  Lock,
  Mail,
  PencilLine,
  RotateCcw,
  Send,
  User,
  Wallet,
} from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  contactSuccessCopy,
  plans,
  sectionCopy,
  services,
  sharedStateCopy,
} from '@/data'
import { Spinner } from '@/components/state/Spinner'
import { StatePanel } from '@/components/state/StatePanel'
import { SelectField } from '@/components/ui/SelectField'
import { submitInquiry } from '@/services'
import type { InquiryInput } from '@/services'
import { ProjectTypeField } from './ProjectTypeField'
import * as S from './styles/contact.styled'

type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>
type Status = 'idle' | 'sending' | 'sent' | 'failed'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldOrder: Field[] = ['name', 'email', 'message']
const formCopy = sectionCopy('contact', 'form')
const successCopy = contactSuccessCopy()
const submitErrorCopy = sharedStateCopy('submitError')

// Budget ranges come from the approved plan prices; nothing is converted.
const budgetOptions = plans.map((plan) =>
  plan.prices.PHP
    ? `${plan.name}: ${plan.prices.PHP}`
    : `${plan.name}: quote`,
)

const projectTypeOptions = [
  { value: '', label: 'Not sure yet', icon: CircleHelp },
  ...services.map((service) => ({
    value: service.title,
    label: service.title,
    icon: service.icon,
  })),
]

const planOptions = [
  { value: '', label: 'Not sure yet' },
  ...budgetOptions.map((option) => ({ value: option, label: option })),
]

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

type ContactFormProps = {
  /** Dev preview only: opens on the completed-action panel. */
  previewSuccess?: boolean
}

export function ContactForm({ previewSuccess = false }: ContactFormProps) {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>(
    previewSuccess ? 'sent' : 'idle',
  )
  const successRef = useRef<HTMLDivElement>(null)
  const failureRef = useRef<HTMLDivElement>(null)
  // Guards against a second submit before React commits the disabled state.
  const submittingRef = useRef(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return

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

    submittingRef.current = true
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
      // The submit button was disabled mid-send; move focus to the alert.
      requestAnimationFrame(() => failureRef.current?.focus())
    } finally {
      submittingRef.current = false
    }
  }

  const cardHeader = (
    <S.FormHeader>
      <S.FormIcon aria-hidden="true">
        <Send size={24} strokeWidth={2} />
      </S.FormIcon>
      <div>
        <S.FormTitle>{formCopy.title}</S.FormTitle>
        {formCopy.description && (
          <S.FormLead>{formCopy.description}</S.FormLead>
        )}
      </div>
    </S.FormHeader>
  )

  if (status === 'sent') {
    return (
      <S.FormCard>
        {cardHeader}
        <S.PanelFocus ref={successRef} tabIndex={-1}>
          <StatePanel
            tone="success"
            headingLevel={2}
            title={successCopy.title}
            description={successCopy.description}
            actions={
              <S.SecondaryAction
                type="button"
                onClick={() => {
                  setErrors({})
                  setStatus('idle')
                  requestAnimationFrame(() =>
                    document.getElementById('contact-name')?.focus(),
                  )
                }}
              >
                <RotateCcw size={18} strokeWidth={2} aria-hidden="true" />
                Send again
              </S.SecondaryAction>
            }
          />
        </S.PanelFocus>
      </S.FormCard>
    )
  }

  const describedBy = (key: Field) =>
    errors[key] ? `contact-${key}-error` : undefined

  return (
    <S.FormCard>
      {cardHeader}

      <S.Form onSubmit={onSubmit} noValidate>
        <S.Row>
          <S.Field>
            <S.Label htmlFor="contact-name">
              Full name
              <S.Required aria-hidden="true">*</S.Required>
            </S.Label>
            <S.Control>
              <User size={16} strokeWidth={2} aria-hidden="true" />
              <S.Input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder="Your full name"
                required
                $invalid={!!errors.name}
                aria-invalid={!!errors.name}
                aria-describedby={describedBy('name')}
              />
            </S.Control>
            {errors.name && (
              <FieldError id="contact-name-error">{errors.name}</FieldError>
            )}
          </S.Field>
          <S.Field>
            <S.Label htmlFor="contact-email">
              Email address
              <S.Required aria-hidden="true">*</S.Required>
            </S.Label>
            <S.Control>
              <Mail size={16} strokeWidth={2} aria-hidden="true" />
              <S.Input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                $invalid={!!errors.email}
                aria-invalid={!!errors.email}
                aria-describedby={describedBy('email')}
              />
            </S.Control>
            {errors.email && (
              <FieldError id="contact-email-error">{errors.email}</FieldError>
            )}
          </S.Field>
        </S.Row>

        <S.Field>
          <S.Label htmlFor="contact-business">
            Business or company
            <S.Optional>(optional)</S.Optional>
          </S.Label>
          <S.Control>
            <Building2 size={16} strokeWidth={2} aria-hidden="true" />
            <S.Input
              id="contact-business"
              name="business"
              autoComplete="organization"
              placeholder="Company name"
            />
          </S.Control>
        </S.Field>

        <S.Row>
          <ProjectTypeField
            id="contact-service"
            name="service"
            label="Project type"
            optional
            icon={Layers}
            options={projectTypeOptions}
          />
          <SelectField
            id="contact-plan"
            name="plan"
            label="Budget range"
            optional
            icon={Wallet}
            options={planOptions}
            defaultValue=""
          />
        </S.Row>

        <S.Field>
          <S.Label htmlFor="contact-message">
            Project details
            <S.Required aria-hidden="true">*</S.Required>
          </S.Label>
          <S.Control $alignTop>
            <PencilLine size={16} strokeWidth={2} aria-hidden="true" />
            <S.Textarea
              id="contact-message"
              name="message"
              placeholder="Tell us about your project, goals, and any important details..."
              required
              $invalid={!!errors.message}
              aria-invalid={!!errors.message}
              aria-describedby={describedBy('message')}
            />
          </S.Control>
          {errors.message && (
            <FieldError id="contact-message-error">{errors.message}</FieldError>
          )}
        </S.Field>

        <S.Field>
          <S.Label htmlFor="contact-launch">
            Target launch date
            <S.Optional>(optional)</S.Optional>
          </S.Label>
          <S.Control>
            <CalendarDays size={16} strokeWidth={2} aria-hidden="true" />
            <S.Input
              id="contact-launch"
              name="launchDate"
              type="date"
              min={today()}
            />
          </S.Control>
        </S.Field>

        <S.Trap aria-hidden="true">
          <label>
            Leave this field empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </S.Trap>

        {status === 'failed' && (
          <S.PanelFocus ref={failureRef} tabIndex={-1}>
            <StatePanel
              tone="error"
              headingLevel={2}
              compact
              title={submitErrorCopy.title}
              description={submitErrorCopy.description}
            />
          </S.PanelFocus>
        )}

        <S.Submit
          type="submit"
          disabled={status === 'sending'}
          aria-busy={status === 'sending'}
        >
          {status === 'sending' ? (
            <Spinner size={18} />
          ) : (
            <Send size={18} strokeWidth={2} aria-hidden="true" />
          )}
          {status === 'sending' ? 'Sending…' : 'Send inquiry'}
        </S.Submit>

        <S.Note>
          <Lock size={14} strokeWidth={2} aria-hidden="true" />
          We only use what you share here to respond to your inquiry.
        </S.Note>
      </S.Form>
    </S.FormCard>
  )
}
