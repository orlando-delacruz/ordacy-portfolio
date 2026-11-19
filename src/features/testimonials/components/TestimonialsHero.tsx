import {
  FolderKanban,
  MessageSquareQuote,
  MessagesSquare,
} from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import * as Hero from '@/components/ui/styles/page-hero.styled'

const ACCENT_PHRASE = 'looks like.'

type TestimonialsHeroProps = {
  eyebrow: string
  title: string
  description: string
}

export function TestimonialsHero({
  eyebrow,
  title,
  description,
}: TestimonialsHeroProps) {
  return (
    <PageHero
      titleId="testimonials-title"
      eyebrow={eyebrow}
      badgeIcon={MessageSquareQuote}
      title={title}
      accent={ACCENT_PHRASE}
      description={description}
      actions={
        <>
          <Hero.PrimaryButton to="/contact">
            <MessagesSquare size={18} strokeWidth={2} aria-hidden="true" />
            Let's talk
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
