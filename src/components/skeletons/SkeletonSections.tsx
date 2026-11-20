import type { ReactNode } from 'react'
import { site } from '@/data'
import {
  SkeletonBlock,
  SkeletonButton,
  SkeletonCard,
  SkeletonCircle,
  SkeletonLine,
  SkeletonPill,
} from './SkeletonPrimitives'
import * as S from './styles/skeletons.styled'

/* ---------- Heroes ---------- */

type SkeletonPageHeroProps = {
  /** Team profiles carry their actions in the profile strip, not the hero. */
  showActions?: boolean
}

/** The shared PageHero band: badge, split title, lead, and optional actions. */
export function SkeletonPageHero({ showActions = true }: SkeletonPageHeroProps) {
  return (
    <S.Hero>
      <S.HeroBand>
        <S.HeroInner>
          <SkeletonPill $w="9rem" $tone="dark" />
          <SkeletonLine $w="92%" $h="2.5rem" $tone="dark" />
          <SkeletonLine $w="68%" $h="2.5rem" $tone="dark" />
          <SkeletonLine $w="100%" $h="1.25rem" $tone="dark" />
          <SkeletonLine $w="86%" $h="1.25rem" $tone="dark" />
          {showActions && (
            <S.HeroActions>
              <SkeletonButton $tone="dark" />
              <SkeletonButton $tone="dark" />
            </S.HeroActions>
          )}
        </S.HeroInner>
      </S.HeroBand>
    </S.Hero>
  )
}

const homeStats = [
  { id: 'views', value: site.profileStats.views },
  { id: 'projects', value: site.profileStats.projects },
  { id: 'likes', value: site.profileStats.likes },
].filter((stat) => stat.value.trim() !== '')
const homeTeam = ['founder', 'member']
const homeTeamPills = ['7rem', '6rem']

/** The home profile hero: cover, avatar, identity, stats, actions, team strip. */
export function SkeletonHomeHero() {
  return (
    <S.HomeHero>
      <S.HomeCover />
      <S.HomeProfile>
        <S.HomeAvatar />
        <S.HomeIdentity>
          <SkeletonLine $w="55%" $h="1.75rem" />
          <SkeletonLine $w="90%" />
          <SkeletonLine $w="70%" />
          {homeStats.length > 0 && (
            <S.HomeStats>
              {homeStats.map((stat) => (
                <S.HomeStat key={stat.id}>
                  <SkeletonLine $w="60%" $h="0.75rem" />
                  <SkeletonLine $w="45%" $h="1rem" />
                </S.HomeStat>
              ))}
            </S.HomeStats>
          )}
        </S.HomeIdentity>
        <S.HomeActions>
          <SkeletonButton />
          <SkeletonButton />
          <S.HomeLike />
        </S.HomeActions>
      </S.HomeProfile>
      <S.HomeTeam>
        <SkeletonLine $w="9rem" $h="1rem" />
        <S.TeamGrid>
          {homeTeam.map((member, index) => (
            <S.TeamCard key={member}>
              <S.TeamAvatar />
              <S.TeamBody>
                <SkeletonLine $w="70%" $h="1rem" />
                <SkeletonPill $w={homeTeamPills[index]} />
              </S.TeamBody>
            </S.TeamCard>
          ))}
        </S.TeamGrid>
      </S.HomeTeam>
    </S.HomeHero>
  )
}

/* ---------- Section pieces ---------- */

type SkeletonSectionHeadProps = {
  /** Optional control placeholder shown beside the heading. */
  action?: ReactNode
}

/** A section heading placeholder: title, description, and optional action. */
export function SkeletonSectionHead({ action }: SkeletonSectionHeadProps = {}) {
  if (!action) {
    return (
      <S.SectionHead>
        <SkeletonLine $w="58%" $h="2rem" />
        <SkeletonLine $w="82%" $h="1rem" />
      </S.SectionHead>
    )
  }

  return (
    <S.SectionHeadRow>
      <S.SectionHeadText>
        <SkeletonLine $w="58%" $h="2rem" />
        <SkeletonLine $w="82%" $h="1rem" />
      </S.SectionHeadText>
      {action}
    </S.SectionHeadRow>
  )
}

const gridCards = ['one', 'two', 'three', 'four', 'five', 'six']

/** Heading plus the three-column project-style card grid. */
export function SkeletonCardGrid() {
  return (
    <S.Section>
      <SkeletonSectionHead />
      <S.CardGrid>
        {gridCards.map((card) => (
          <S.GridCard key={card}>
            <S.CardMedia />
            <S.CardBody>
              <SkeletonLine $w="72%" $h="1.25rem" />
              <S.CardActions>
                <SkeletonButton />
                <SkeletonButton />
              </S.CardActions>
            </S.CardBody>
          </S.GridCard>
        ))}
      </S.CardGrid>
    </S.Section>
  )
}

const planCards = ['starter', 'growth', 'custom']
const planFits = ['one', 'two', 'three', 'four', 'five']

type SkeletonPlanCardsProps = {
  /** Pricing shows the currency toggle in the section head; Home does not. */
  showCurrencyToggle?: boolean
}

/** Heading, plan cards (horizontal on phones), and the help strip. */
export function SkeletonPlanCards({
  showCurrencyToggle = false,
}: SkeletonPlanCardsProps = {}) {
  return (
    <S.Section>
      <SkeletonSectionHead
        action={
          showCurrencyToggle ? (
            <S.TogglePlaceholder>
              <SkeletonBlock
                $w="3.5rem"
                $h="2.5rem"
                $r="999px"
                $tone="muted"
              />
              <SkeletonBlock
                $w="3.5rem"
                $h="2.5rem"
                $r="999px"
                $tone="muted"
              />
            </S.TogglePlaceholder>
          ) : undefined
        }
      />
      <S.PlanGrid>
        {planCards.map((plan) => (
          <S.PlanCard key={plan}>
            <S.PlanHeader>
              <S.PlanIcon />
              <S.PlanName>
                <SkeletonLine $w="60%" $h="1.25rem" />
                <SkeletonPill $w="5rem" />
              </S.PlanName>
            </S.PlanHeader>
            <S.PriceBlock>
              <SkeletonLine $w="45%" $h="0.75rem" />
              <SkeletonLine $w="60%" $h="2rem" />
              <SkeletonLine $w="50%" $h="0.75rem" />
            </S.PriceBlock>
            <SkeletonLine $w="100%" />
            <SkeletonLine $w="80%" />
            <SkeletonButton />
            <S.FitList>
              {planFits.map((fit) => (
                <S.FitRow key={fit}>
                  <S.FitDot />
                  <SkeletonLine $w="80%" $h="0.75rem" />
                </S.FitRow>
              ))}
            </S.FitList>
          </S.PlanCard>
        ))}
      </S.PlanGrid>
      <S.HelpStrip>
        <S.HelpBody>
          <SkeletonLine $w="60%" $h="1rem" $tone="muted" />
          <SkeletonLine $w="80%" $h="0.75rem" $tone="muted" />
        </S.HelpBody>
        <SkeletonButton $w="9rem" $tone="muted" />
      </S.HelpStrip>
    </S.Section>
  )
}

/** Heading, fanned project carousel, and the view-all action. */
export function SkeletonProjectCarousel() {
  return (
    <S.Section>
      <SkeletonSectionHead />
      <S.CarouselStage>
        <S.CarouselSide />
        <S.CarouselMain>
          <SkeletonPill $w="7rem" $tone="dark" />
          <S.CarouselMainBody>
            <SkeletonLine $w="85%" $h="1.25rem" $tone="dark" />
            <S.CarouselActions>
              <SkeletonButton $tone="dark" />
              <SkeletonButton $tone="dark" />
            </S.CarouselActions>
          </S.CarouselMainBody>
        </S.CarouselMain>
        <S.CarouselSide />
      </S.CarouselStage>
      <S.ViewAll>
        <SkeletonButton $w="10rem" />
      </S.ViewAll>
    </S.Section>
  )
}

const faqTopics = ['6rem', '5rem', '7rem', '5.5rem', '6.5rem', '5rem']
const faqRows = ['one', 'two', 'three', 'four', 'five']

/** Heading, search/topic rail, ask card, and FAQ accordion rows. */
export function SkeletonFaqWorkspace() {
  return (
    <S.Section>
      <SkeletonSectionHead />
      <S.FaqWorkspace>
        <S.FaqRail>
          <S.FaqTools>
            <S.FaqSearch />
            <S.FaqTopics>
              {faqTopics.map((width, index) => (
                <S.FaqTopic key={`${width}-${index}`} $w={width} />
              ))}
            </S.FaqTopics>
          </S.FaqTools>
          <S.FaqAsk>
            <S.FaqAskIcon />
            <SkeletonLine $w="70%" $h="1rem" />
            <SkeletonLine $w="100%" $h="0.75rem" />
            <SkeletonLine $w="82%" $h="0.75rem" />
            <SkeletonButton />
          </S.FaqAsk>
        </S.FaqRail>
        <S.FaqResults>
          <S.FaqResultRow>
            <SkeletonLine $w="7rem" $h="0.75rem" />
          </S.FaqResultRow>
          <S.FaqList>
            {faqRows.map((row) => (
              <S.FaqItem key={row}>
                <S.FaqQuestion>
                  <SkeletonLine $w="78%" $h="1rem" />
                </S.FaqQuestion>
                <S.FaqToggle />
              </S.FaqItem>
            ))}
          </S.FaqList>
        </S.FaqResults>
      </S.FaqWorkspace>
    </S.Section>
  )
}

const testimonialCards = ['one', 'two', 'three', 'four']

/** Heading, two-column testimonial cards, and pagination controls. */
export function SkeletonTestimonialCards() {
  return (
    <S.Section>
      <SkeletonSectionHead />
      <S.TestimonialGrid>
        {testimonialCards.map((card) => (
          <S.TestimonialCard key={card}>
            <S.TestimonialTop>
              <SkeletonLine $w="40%" $h="0.75rem" />
              <SkeletonCircle $size="1.5rem" />
            </S.TestimonialTop>
            <S.TestimonialQuote>
              <SkeletonLine $w="100%" />
              <SkeletonLine $w="96%" />
              <SkeletonLine $w="88%" />
              <SkeletonLine $w="60%" />
            </S.TestimonialQuote>
            <S.TestimonialAuthor>
              <SkeletonCircle $size="2.75rem" />
              <S.TestimonialAuthorBody>
                <SkeletonLine $w="55%" $h="0.75rem" />
                <SkeletonLine $w="75%" $h="0.75rem" />
              </S.TestimonialAuthorBody>
            </S.TestimonialAuthor>
          </S.TestimonialCard>
        ))}
      </S.TestimonialGrid>
      <S.Pagination>
        {testimonialCards.map((page) => (
          <S.PaginationDot key={page} />
        ))}
      </S.Pagination>
    </S.Section>
  )
}

const comparePlans = ['starter', 'growth', 'custom']
const compareRows = ['fit', 'price']
const compareTableColumns = ['plan', 'starter', 'growth', 'custom']

/** Heading, stacked comparison below xl, and the table above xl. */
export function SkeletonComparison() {
  return (
    <S.Section>
      <SkeletonSectionHead />
      <S.CompareStack>
        {comparePlans.map((plan) => (
          <S.ComparePlan key={plan}>
            <S.ComparePlanHead>
              <S.PlanIcon />
              <SkeletonLine $w="7rem" $h="1.25rem" />
            </S.ComparePlanHead>
            <S.ComparePlanDetails>
              {compareRows.map((row) => (
                <S.CompareRow key={row}>
                  <SkeletonLine $w="4rem" $h="0.75rem" />
                  <SkeletonLine $w="90%" />
                </S.CompareRow>
              ))}
              <S.CompareRow>
                <SkeletonLine $w="5rem" $h="0.75rem" />
                <SkeletonLine $w="45%" $h="1rem" />
              </S.CompareRow>
            </S.ComparePlanDetails>
          </S.ComparePlan>
        ))}
      </S.CompareStack>
      <S.CompareTable>
        <S.CompareTableHead>
          {compareTableColumns.map((column) => (
            <S.CompareTableCell key={column}>
              <SkeletonLine $w="55%" $h="0.75rem" $tone="muted" />
            </S.CompareTableCell>
          ))}
        </S.CompareTableHead>
        {comparePlans.map((plan) => (
          <S.CompareTableRow key={plan}>
            <S.CompareTableCell>
              <SkeletonLine $w="60%" $h="0.75rem" />
            </S.CompareTableCell>
            {compareTableColumns.slice(1).map((column) => (
              <S.CompareTableCell key={`${plan}-${column}`}>
                <SkeletonLine $w="90%" />
              </S.CompareTableCell>
            ))}
          </S.CompareTableRow>
        ))}
      </S.CompareTable>
    </S.Section>
  )
}

/* ---------- Page-specific compositions ---------- */

const contactFields = ['name', 'email']

/** The inquiry form card: header, fields, textarea, submit, and note. */
export function SkeletonContactForm() {
  return (
    <S.ContactCard>
      <S.ContactHeader>
        <S.ContactIcon />
        <S.ContactHeaderBody>
          <SkeletonLine $w="55%" $h="1.5rem" />
          <SkeletonLine $w="85%" $h="0.75rem" />
        </S.ContactHeaderBody>
      </S.ContactHeader>
      <S.ContactForm>
        <S.FieldRow>
          {contactFields.map((field) => (
            <S.Field key={field}>
              <SkeletonLine $w="40%" $h="0.75rem" />
              <S.Control />
            </S.Field>
          ))}
        </S.FieldRow>
        <S.Field>
          <SkeletonLine $w="35%" $h="0.75rem" />
          <S.Control />
        </S.Field>
        <S.FieldRow>
          {contactFields.map((field) => (
            <S.Field key={field}>
              <SkeletonLine $w="40%" $h="0.75rem" />
              <S.Control />
            </S.Field>
          ))}
        </S.FieldRow>
        <S.Field>
          <SkeletonLine $w="30%" $h="0.75rem" />
          <S.Textarea />
        </S.Field>
        <S.Field>
          <SkeletonLine $w="30%" $h="0.75rem" />
          <S.Control />
        </S.Field>
        <S.Submit />
        <S.NoteLine>
          <SkeletonLine $w="60%" $h="0.75rem" />
        </S.NoteLine>
      </S.ContactForm>
    </S.ContactCard>
  )
}

const legalToc = ['one', 'two', 'three', 'four', 'five']
const legalSections = ['one', 'two', 'three']

/** Document meta, a TOC column, and long-form body sections. */
export function SkeletonLegalDoc() {
  return (
    <S.LegalDoc>
      <S.LegalMeta>
        <SkeletonLine $w="8rem" $h="1rem" />
        <SkeletonLine $w="6rem" $h="1rem" />
        <S.LegalMetaAction />
      </S.LegalMeta>
      <S.LegalLayout>
        <S.LegalToc>
          <SkeletonLine $w="45%" $h="0.75rem" />
          <S.LegalTocList>
            {legalToc.map((item) => (
              <S.LegalTocItem key={item}>
                <S.LegalTocNumber />
                <S.LegalTocLabel>
                  <SkeletonLine $w="70%" $h="0.75rem" />
                </S.LegalTocLabel>
              </S.LegalTocItem>
            ))}
          </S.LegalTocList>
        </S.LegalToc>
        <S.LegalBody>
          <S.LegalLead>
            <SkeletonLine $w="100%" />
            <SkeletonLine $w="94%" />
            <SkeletonLine $w="70%" />
          </S.LegalLead>
          {legalSections.map((section) => (
            <S.LegalSection key={section}>
              <S.LegalHeadingRow>
                <S.LegalSectionNumber />
                <S.LegalSectionTitle>
                  <SkeletonLine $w="60%" $h="1.5rem" />
                </S.LegalSectionTitle>
              </S.LegalHeadingRow>
              <S.LegalSectionBody>
                <SkeletonLine $w="100%" />
                <SkeletonLine $w="96%" />
                <SkeletonLine $w="88%" />
                <SkeletonLine $w="72%" />
              </S.LegalSectionBody>
            </S.LegalSection>
          ))}
        </S.LegalBody>
      </S.LegalLayout>
    </S.LegalDoc>
  )
}

const profileStats = ['one', 'two', 'three']
const timelineRoles = ['one', 'two', 'three']
const timelineEducation = ['one', 'two']
const profilePills = ['5rem', '6rem', '4rem', '7rem', '5rem']
const skillGroups = ['stack', 'tools', 'platforms', 'practices']
const skillGroupPills = ['4rem', '5rem', '6rem']
const skillCounts = ['1rem', '1rem', '1rem', '1rem']

/**
 * Page hero, profile strip, resume columns, and the full-width skills band.
 */
export function SkeletonProfile() {
  return (
    <>
      <SkeletonPageHero showActions={false} />
      <S.ProfileStrip>
        <S.ProfileAvatar />
        <S.ProfileRole>
          <SkeletonLine $w="52%" $h="1.25rem" />
          <SkeletonLine $w="36%" $h="1rem" />
        </S.ProfileRole>
        <S.ProfileFacts>
          {profileStats.map((stat) => (
            <S.ProfileStat key={stat}>
              <SkeletonLine $w="60%" $h="0.75rem" />
              <SkeletonLine $w="45%" $h="0.75rem" />
            </S.ProfileStat>
          ))}
        </S.ProfileFacts>
        <S.ProfileActions>
          <SkeletonButton />
          <SkeletonButton />
          <S.ProfileBack />
        </S.ProfileActions>
      </S.ProfileStrip>

      <S.Resume>
        <S.ResumeMain>
          <SkeletonCard>
            <S.BlockHead>
              <S.BlockIcon />
              <S.BlockHeadLine>
                <SkeletonLine $w="40%" $h="1rem" />
              </S.BlockHeadLine>
            </S.BlockHead>
            <SkeletonLine $w="100%" />
            <SkeletonLine $w="92%" />
            <SkeletonLine $w="70%" />
          </SkeletonCard>

          <SkeletonCard>
            <S.BlockHead>
              <S.BlockIcon />
              <S.BlockHeadLine>
                <SkeletonLine $w="45%" $h="1rem" />
              </S.BlockHeadLine>
            </S.BlockHead>
            <S.Timeline>
              {timelineRoles.map((role) => (
                <S.TimelineRow key={role}>
                  <S.TimelineMarker />
                  <S.TimelineBody>
                    <SkeletonLine $w="65%" $h="1rem" />
                    <SkeletonLine $w="45%" $h="0.75rem" />
                    <SkeletonLine $w="80%" $h="0.75rem" />
                  </S.TimelineBody>
                </S.TimelineRow>
              ))}
            </S.Timeline>
          </SkeletonCard>

          <SkeletonCard>
            <S.BlockHead>
              <S.BlockIcon />
              <S.BlockHeadLine>
                <SkeletonLine $w="45%" $h="1rem" />
              </S.BlockHeadLine>
            </S.BlockHead>
            <S.Timeline>
              {timelineEducation.map((entry) => (
                <S.TimelineRow key={entry}>
                  <S.TimelineMarker />
                  <S.TimelineBody>
                    <SkeletonLine $w="60%" $h="1rem" />
                    <SkeletonLine $w="40%" $h="0.75rem" />
                  </S.TimelineBody>
                </S.TimelineRow>
              ))}
            </S.Timeline>
          </SkeletonCard>
        </S.ResumeMain>

        <S.ResumeSide>
          <SkeletonCard>
            <S.BlockHead>
              <S.BlockIcon />
              <S.BlockHeadLine>
                <SkeletonLine $w="50%" $h="1rem" />
              </S.BlockHeadLine>
            </S.BlockHead>
            <S.Pills>
              {profilePills.map((pill, index) => (
                <SkeletonPill key={`${pill}-${index}`} $w={pill} />
              ))}
            </S.Pills>
          </SkeletonCard>

          <SkeletonCard>
            <S.BlockHead>
              <S.BlockIcon />
              <S.BlockHeadLine>
                <SkeletonLine $w="55%" $h="1rem" />
              </S.BlockHeadLine>
            </S.BlockHead>
            <S.CompareRow>
              <SkeletonLine $w="70%" $h="0.75rem" />
              <SkeletonLine $w="45%" $h="0.75rem" />
            </S.CompareRow>
            <S.CompareRow>
              <SkeletonLine $w="60%" $h="0.75rem" />
              <SkeletonLine $w="35%" $h="0.75rem" />
            </S.CompareRow>
          </SkeletonCard>

          <S.ProfileContactCard>
            <S.BlockHead>
              <S.BlockIcon />
              <S.BlockHeadLine>
                <SkeletonLine $w="55%" $h="1rem" />
              </S.BlockHeadLine>
            </S.BlockHead>
            <SkeletonLine $w="100%" />
            <SkeletonLine $w="80%" />
            <S.ProfileContactActions>
              <SkeletonButton />
              <SkeletonButton />
            </S.ProfileContactActions>
          </S.ProfileContactCard>
        </S.ResumeSide>
      </S.Resume>

      <S.SkillsBand>
        <S.BlockHead>
          <S.BlockIcon />
          <S.BlockHeadLine>
            <SkeletonLine $w="30%" $h="1rem" />
          </S.BlockHeadLine>
        </S.BlockHead>
        <S.SkillsGrid>
          {skillGroups.map((group, index) => (
            <S.SkillGroup key={group}>
              <S.SkillGroupHead>
                <SkeletonLine $w="55%" $h="0.75rem" />
                <SkeletonLine $w={skillCounts[index]} $h="0.75rem" />
              </S.SkillGroupHead>
              <S.Pills>
                {skillGroupPills.map((pill) => (
                  <SkeletonPill key={`${group}-${pill}`} $w={pill} />
                ))}
              </S.Pills>
            </S.SkillGroup>
          ))}
        </S.SkillsGrid>
      </S.SkillsBand>
    </>
  )
}

/** The teal closing banner, without its actions' real labels. */
export function SkeletonCta() {
  return (
    <S.CtaBand>
      <S.CtaCopy>
        <S.CtaShape $w="7rem" $h="1.75rem" $r="999px" />
        <S.CtaShape $w="70%" $h="2rem" $r="0.5rem" />
        <S.CtaShape $w="90%" $h="1rem" $r="0.5rem" />
        <S.CtaShape $w="70%" $h="1rem" $r="0.5rem" />
      </S.CtaCopy>
      <S.CtaActions>
        <S.CtaAction />
        <S.CtaAction />
      </S.CtaActions>
    </S.CtaBand>
  )
}
