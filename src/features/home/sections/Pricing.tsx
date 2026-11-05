import { Check, Send } from 'lucide-react'
import { useState } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'
import { Section } from '@/components/ui/Section'
import type { Currency } from '../home.data'
import { plans } from '../home.data'
import * as S from './styles/pricing.styled'
import { sectionCopy } from '@/data'

const currencies = ['PHP', 'USD'] as const

/** The currency toggle, plan cards and help strip. Shared by the home section and /pricing. */
export function PricingPlans() {
  const [currency, setCurrency] = useState<Currency>('PHP')
  // Cards rise in one after another the first time the section is seen.
  const [stageRef, revealed] = useRevealOnce<HTMLDivElement>(0.15)

  return (
    <S.Stage ref={stageRef} data-revealed={revealed || undefined}>
      <S.Decor aria-hidden="true">
        <S.Glow />
        <S.Dots />
      </S.Decor>

      <S.Toolbar>
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
              onClick={() => setCurrency(option)}
            >
              {/* One icon per option: the currency sign itself. */}
              <S.CurrencyGlyph aria-hidden="true">
                {option === 'PHP' ? '₱' : '$'}
              </S.CurrencyGlyph>
              {option}
            </S.ToggleOption>
          ))}
        </S.Toggle>
      </S.Toolbar>

      {/* Focusable so keyboard users can scroll the card row on small screens. */}
      <S.Grid role="region" aria-label="Pricing plans" tabIndex={0}>
        {plans.map((plan, planIndex) => {
          const price = plan.prices[currency]
          const featured = plan.id === 'growth'
          const Button = featured ? S.PrimaryButton : S.SecondaryButton
          const CtaIcon = plan.ctaIcon
          const PlanIcon = plan.icon

          return (
            <S.Card key={plan.id} $featured={featured} $index={planIndex}>
              <S.CardHeader>
                <S.PlanIcon>
                  <PlanIcon size={22} strokeWidth={2} aria-hidden="true" />
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
                    ? `${currency} · final quote after scoping`
                    : 'Quoted after we review your requirements'}
                </S.PriceNote>
              </S.PriceBlock>

              <S.Positioning>{plan.positioning}</S.Positioning>

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

              <S.CardAction>
                <Button to="/contact">
                  <CtaIcon size={18} strokeWidth={2} aria-hidden="true" />
                  {plan.cta}
                </Button>
              </S.CardAction>
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
          Tell us about your project
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
