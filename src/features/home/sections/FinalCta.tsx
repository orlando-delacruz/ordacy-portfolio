import { ClosingCta } from '@/components/ui/ClosingCta'
import { closingCta } from '@/data'

const cta = closingCta('home', 'final-cta')

export function FinalCta() {
  return <ClosingCta titleId="final-cta-title" {...cta} />
}
