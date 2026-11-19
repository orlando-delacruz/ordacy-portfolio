import { Handshake } from 'lucide-react'
import type { CtaAction } from '@/data'
import { CtaBanner } from './CtaBanner'
import {
  PrimaryAnchor,
  PrimaryButton,
  SecondaryButton,
} from './styles/cta-banner.styled'

type ClosingCtaProps = {
  id?: string
  titleId: string
  eyebrow: string | null
  title: string
  description?: string | null
  actions: readonly CtaAction[]
}

/**
 * One banner for every page close: the Home eyebrow, title, description and
 * exactly two actions (primary with its leading icon, secondary quiet).
 */
export function ClosingCta({
  id,
  titleId,
  eyebrow,
  title,
  description,
  actions,
}: ClosingCtaProps) {
  const [primary, secondary] = actions
  const PrimaryIcon = primary?.icon
  const SecondaryIcon = secondary?.icon
  const isHash = primary?.to.startsWith('#') ?? false

  const primaryContent = primary && PrimaryIcon && (
    <>
      <PrimaryIcon size={18} strokeWidth={2} aria-hidden="true" />
      {primary.label}
    </>
  )

  return (
    <CtaBanner
      id={id}
      titleId={titleId}
      eyebrow={eyebrow ? { icon: Handshake, label: eyebrow } : undefined}
      title={title}
      description={description ?? ''}
    >
      {primary && primaryContent && isHash && (
        <PrimaryAnchor href={primary.to}>{primaryContent}</PrimaryAnchor>
      )}
      {primary && primaryContent && !isHash && (
        <PrimaryButton to={primary.to}>{primaryContent}</PrimaryButton>
      )}
      {secondary && SecondaryIcon && (
        <SecondaryButton to={secondary.to}>
          <SecondaryIcon size={18} strokeWidth={2} aria-hidden="true" />
          {secondary.label}
        </SecondaryButton>
      )}
    </CtaBanner>
  )
}
