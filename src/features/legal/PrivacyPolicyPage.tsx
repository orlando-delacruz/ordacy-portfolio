import { legal, seo } from '@/data'
import { LegalPage } from './LegalPage'

export function PrivacyPolicyPage() {
  return <LegalPage seo={seo.privacy} document={legal.privacy} />
}
