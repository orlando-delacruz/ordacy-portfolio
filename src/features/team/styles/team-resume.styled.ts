import styled from 'styled-components'
import { cardShell } from '@/components/ui/styles/card.styled'

export const Resume = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;
  /* Breathing room below the profile strip and its hairline. */
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: ${({ theme }) => theme.spacing.xl};
  }
`

export const Main = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  min-width: 0;
`

export const Side = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;

  /* The side column follows on tall screens; the main column stays the
     reading path and the contact card is always in reach. */
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    position: sticky;
    top: calc(var(--top-bar-height) + ${({ theme }) => theme.spacing.lg});
  }
`

export const Block = styled.section`
  ${cardShell}
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  align-content: start;
  overflow: hidden;

  /* The 24px card inset is generous on a phone; 16px keeps lines readable. */
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

// Quiet dotted texture for the profile block, matching the cover art.
export const DotField = styled.span`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    color-mix(
        in srgb,
        ${({ theme }) => theme.colors.text.accent} 38%,
        transparent
      )
      1px,
    transparent 1px
  );
  background-size: 1rem 1rem;
  mask-image: radial-gradient(70% 90% at 100% 0%, #000 0%, transparent 68%);
  opacity: 0.28;
  pointer-events: none;
  -webkit-mask-image: radial-gradient(
    70% 90% at 100% 0%,
    #000 0%,
    transparent 68%
  );
`

export const BlockHead = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
`

export const BlockIcon = styled.span`
  display: grid;
  flex: none;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 10%,
    transparent
  );
  color: ${({ theme }) => theme.colors.text.accent};
`

export const BlockTitle = styled.h2`
  min-width: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

// Hairline that carries the eye from the heading to the card edge.
export const BlockRule = styled.span`
  display: none;
  flex: 1;
  height: 1px;
  margin-left: ${({ theme }) => theme.spacing.xs};
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.border.default},
    transparent
  );

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
  }
`

export const Lead = styled.p`
  max-width: ${({ theme }) => theme.layout.readingMaxWidth};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  text-wrap: pretty;
`

export const Timeline = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const TimelineItem = styled.li`
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;
`

export const TimelineMarker = styled.span`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text.accent} 24%,
      ${({ theme }) => theme.colors.border.default}
    );
  border-radius: ${({ theme }) => theme.radii.sm};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 8%,
    ${({ theme }) => theme.colors.surface.default}
  );
  color: ${({ theme }) => theme.colors.text.accent};
`

export const EntryBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const EntryHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
`

export const EntryTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const EntryPeriod = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  white-space: nowrap;
`

export const EntryOrg = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const EntryText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  text-wrap: pretty;
`

// Honors and awards read as separate lines instead of one run-on sentence.
export const EducationDetails = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};

    &::before {
      position: absolute;
      top: 0.5rem;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: ${({ theme }) => theme.radii.round};
      background: ${({ theme }) => theme.colors.text.accent};
      content: '';
    }
  }
`

export const Pills = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Pill = styled.li`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

// Two rows maximum in the collapsed state; the toggle reveals the grouped
// lists without the band dominating the page.
// shortcut: 4.5rem assumes the 14px pill height; revisit with the type scale.
export const SkillsPreview = styled.div`
  max-height: 4.5rem;
  overflow: hidden;
`

export const SkillsToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 2.75rem;
  padding: ${({ theme }) => theme.spacing.xs}
    ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.accent};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.base},
    background ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    background: ${({ theme }) => theme.colors.background.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

// Full-width stack band under the resume columns: a long grouped list reads
// better across the page than inside the narrow side card.
export const StackBand = styled.section`
  ${cardShell}
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const StackGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export const StackGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  min-width: 0;
`

export const StackHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const StackLabel = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  letter-spacing: 0.08em;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-transform: uppercase;
`

export const StackCount = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-variant-numeric: tabular-nums;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const MetaList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const MetaItem = styled.li`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
`

export const MetaIcon = styled.span`
  display: grid;
  flex: none;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const MetaBody = styled.div`
  display: grid;
  gap: 0.125rem;
  min-width: 0;
`

export const MetaName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const MetaDetail = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`

export const ContactCard = styled.section`
  ${cardShell}
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  overflow: hidden;
  border-color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text.accent} 38%,
    ${({ theme }) => theme.colors.border.default}
  );
  background:
    radial-gradient(
      120% 140% at 100% 0%,
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.text.accent} 14%,
        transparent
      )
        0%,
      transparent 58%
    ),
    ${({ theme }) => theme.colors.surface.default};

  /* Brand ring, echoing the profile cover. */
  &::after {
    position: absolute;
    top: -4rem;
    right: -4rem;
    width: 10rem;
    height: 10rem;
    border: 1px solid
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.text.accent} 22%,
        transparent
      );
    border-radius: ${({ theme }) => theme.radii.round};
    content: '';
    pointer-events: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const ContactTitle = styled.h2`
  min-width: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

export const ContactText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  text-wrap: pretty;
`

export const ContactActions = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
  }
`
