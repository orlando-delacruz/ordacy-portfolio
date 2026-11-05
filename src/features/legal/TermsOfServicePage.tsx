import { legal, seo } from '@/data'
import { LegalPage } from './LegalPage'

export function TermsOfServicePage() {
  return <LegalPage seo={seo.terms} document={legal.terms} />
}
