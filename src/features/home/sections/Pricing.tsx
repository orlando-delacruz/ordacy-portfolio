import { Check, Send } from 'lucide-react'
import { useState } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import { Section } from '@/components/ui/Section'
import type { Currency } from '../home.data'
import { plans } from '../home.data'
import * as S from './styles/pricing.styled'
import { sectionCopy } from '@/data'

const currencies = ['PHP', 'USD'] as const

export type PricingPlansProps = {
  currency?: Currency
  onCurrencyChange?: (c: Currency) => void
  showToggle?: boolean
}

export function PlanCurrencyToggle({
  currency,
  onCurrencyChange
}: {
  currency: Currency
  onCurrencyChange: (c: Currency) => void
}) {
  return (
    <S.Toggle
      role="group"
      aria-label="Show prices in"
      $index={currencies.indexOf(currency)}
    >
      {currencies.map((option) => (
        <S.ToggleOption
          key={option}
          type="button"
          $selected={currency === option}
          aria-pressed={currency === option}
          onClick={() => onCurrencyChange(option)}
        >
          {/* One icon per option: the currency sign itself. */}
          <S.CurrencyGlyph aria-hidden="true">
            {option === 'PHP' ? '₱' : '$'}
          </S.CurrencyGlyph>
          {option}
        </S.ToggleOption>
      ))}
    </S.Toggle>
  )
}

/** The currency toggle, plan cards and help strip. Shared by the home section and /pricing. */
export function PricingPlans({
  currency: controlledCurrency,
  onCurrencyChange,
  showToggle = true
}: PricingPlansProps) {
  const [internalCurrency, setInternalCurrency] = useState<Currency>('PHP')
  const currency = controlledCurrency ?? internalCurrency
  const handleCurrencyChange = (next: Currency) => {
    if (controlledCurrency === undefined) setInternalCurrency(next)
    onCurrencyChange?.(next)
  }
  // Cards rise in one after another the first time the section is seen.
  const [stageRef, revealed] = useRevealOnce<HTMLDivElement>(0.15)

  return (
    <S.Stage ref={stageRef} data-revealed={revealed || undefined}>
      <S.Decor aria-hidden="true">
        <S.Glow />
        <S.Dots />
      </S.Decor>

      {showToggle && (
        <S.Toolbar>
          <PlanCurrencyToggle
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
          />
        </S.Toolbar>
      )}

      {/* Focusable so keyboard users can scroll the card row on small screens. */}
      <S.Grid role="region" aria-label="Pricing plans" tabIndex={0}>
        {plans.map((plan, planIndex) => {
          const price = plan.prices[currency]
          const featured = plan.id === 'growth'
          const Button = featured ? S.FeaturedButton : S.PrimaryButton
          const CtaIcon = plan.ctaIcon
          const PlanIcon = plan.icon

          return (
            <S.Card key={plan.id} $featured={featured} $index={planIndex}>
              <S.CardHeader>
                <S.PlanIcon>
                  <PlanIcon size={24} strokeWidth={2} aria-hidden="true" />
                </S.PlanIcon>
                <S.NameRow>
                  <S.PlanName>{plan.name}</S.PlanName>
                  <S.Category>{plan.category}</S.Category>
                </S.NameRow>
              </S.CardHeader>

              <S.PriceBlock>
                <S.PriceLabel>
                  {price ? 'Starting at' : 'Priced per project'}
                </S.PriceLabel>
                {/* Keyed by currency so the figure flips in on every switch. */}
                <S.Price key={currency} $featured={featured}>
                  {featured && price ? (
                    <>
                      {/* Price strings start with the symbol (₱ / $). */}
                      <S.Currency>{price.slice(0, 1)}</S.Currency>
                      {price.slice(1)}
                    </>
                  ) : (
                    (price ?? 'Custom quote')
                  )}
                </S.Price>
                <S.PriceNote>
                  {price
                    ? 'Final quote after scoping'
                    : 'Quoted after our review'}
                </S.PriceNote>
              </S.PriceBlock>

              <S.Positioning>{plan.positioning}</S.Positioning>

              {/* Directly under the description, so the CTAs line up across plans. */}
              <S.CardAction>
                <Button to="/contact">
                  <CtaIcon size={18} strokeWidth={2} aria-hidden="true" />
                  {plan.cta}
                </Button>
              </S.CardAction>

              <S.FitList aria-label={`Good fit for ${plan.name}`}>
                {plan.fits.map((fit, fitIndex) => (
                  <S.FitItem key={fit} $card={planIndex} $index={fitIndex}>
                    <S.FitIcon>
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                    </S.FitIcon>
                    {fit}
                  </S.FitItem>
                ))}
              </S.FitList>
            </S.Card>
          )
        })}
      </S.Grid>

      <S.Help>
        <S.HelpRing aria-hidden="true" />
        <div>
          <S.HelpTitle>Not sure which plan fits?</S.HelpTitle>
          <S.HelpText>
            Share what you need and we'll suggest the right scope.
          </S.HelpText>
        </div>
        <S.HelpButton to="/contact">
          <Send size={18} strokeWidth={2} aria-hidden="true" />
          Contact us
        </S.HelpButton>
      </S.Help>
    </S.Stage>
  )
}

export function Pricing() {
  return (
    <Section
      id="pricing"
      {...sectionCopy('home', 'pricing')}
    >
      <PricingPlans />
    </Section>
  )
}
