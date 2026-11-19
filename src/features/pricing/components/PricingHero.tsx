import { FolderKanban, Rocket, Tag } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import * as Hero from '@/components/ui/styles/page-hero.styled'
import { pageHeader } from '@/data'

// The H1's second line renders in teal; everything before it stays white.
const ACCENT_PHRASE = 'scoped to fit.'

export function PricingHero() {
  const header = pageHeader('pricing')

  return (
    <PageHero
      titleId="pricing-title"
      eyebrow={header.eyebrow}
      badgeIcon={Tag}
      title={header.title}
      accent={ACCENT_PHRASE}
      description={header.description}
      actions={
        <>
          <Hero.PrimaryButton to="/contact">
            <Rocket size={18} strokeWidth={2} aria-hidden="true" />
            Get started
          </Hero.PrimaryButton>
          <Hero.GhostButton to="/projects">
            <FolderKanban size={18} strokeWidth={2} aria-hidden="true" />
            View projects
          </Hero.GhostButton>
        </>
      }
    />
  )
}
