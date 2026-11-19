import styled, { css } from 'styled-components'
import { PrimaryAction } from '@/components/ui/styles/buttons.styled'
import type { AppTheme } from '@/styles/theme'

export {
  PrimaryAction,
  SecondaryAction,
} from '@/components/ui/styles/buttons.styled'

/* ---------- Hero ---------- */

export const Hero = styled.header`
  /* Cancel the shell's top padding so the band sits under the Top Bar. */
  margin-top: calc(-1 * ${({ theme }) => theme.spacing.xl});
`

// Inset photographic band: the art carries the navy field, the left side is
// veiled for the copy, and the laptop stays visible on the right.
export const HeroBand = styled.div`
  position: relative;
  isolation: isolate;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: #00243e url('/images/ordacy-hero-wave.png') no-repeat;
  background-size: cover;
  background-position: 65% center;

  &::before {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
    /* On phones the copy spans the band, so the photo stays a faint texture
       instead of showing the logo through the headline. */
    background: linear-gradient(
      95deg,
      rgba(0, 36, 62, 0.98) 0%,
      rgba(0, 36, 62, 0.96) 58%,
      rgba(0, 36, 62, 0.9) 100%
    );
    content: '';
    pointer-events: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-inline: ${({ theme }) => theme.spacing['2xl']};
    background-position: right center;

    &::before {
      background: linear-gradient(
        to right,
        rgba(0, 36, 62, 0.92) 0%,
        rgba(0, 36, 62, 0.62) 46%,
        rgba(0, 36, 62, 0.18) 100%
      );
    }
  }

  /* Mid-width bands are narrow enough for the lead to sit over the bright
     laptop art; darken that range so the copy keeps 4.5:1. */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: 87.5rem) {
    &::before {
      background: linear-gradient(
        to right,
        rgba(0, 36, 62, 0.95) 0%,
        rgba(0, 36, 62, 0.82) 52%,
        rgba(0, 36, 62, 0.5) 100%
      );
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    padding-inline: ${({ theme }) => theme.spacing['3xl']};
  }
`

export const HeroCopy = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-items: start;
  max-width: 34rem;
`

// Translucent teal pill over navy, matching the other photo heroes.
export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 45%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radii.pill};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.primary} 18%,
    transparent
  );
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const HeroTitle = styled.h1`
  max-width: 34rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.white};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['4xl']},
    4.2vw,
    3.5rem
  );
  letter-spacing: -0.02em;
  line-height: 1.05;

  /* Small phones: 40px would break "Let's talk about" into three lines. */
  @media (max-width: 22.5rem) {
    font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  }
`

export const HeroAccent = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.brand.primary};
`

export const HeroLead = styled.p`
  max-width: 30rem;
  margin: 0;
  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.white} 78%,
    transparent
  );
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

/* ---------- Layout ---------- */

export const Layout = styled.div`
  display: grid;
  gap: 2.5rem;
  /* Site-wide 40px section rhythm. */
  padding-block: 2.5rem;
`

export const FormColumn = styled.div`
  width: 100%;
  min-width: 0;
`

/* ---------- What happens next ---------- */

export const Aside = styled.aside`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  align-content: start;
  min-width: 0;
`

export const AsideHeader = styled.div`
  display: grid;
  justify-items: start;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Rule = styled.span`
  width: 5rem;
  height: 4px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.brand.primary};
`

export const AsideTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const Steps = styled.ol`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  /* Full-width section: three steps in a row instead of a long rail. */
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`

// Each row draws the dotted rail to the row edge; the padding and the next
// row's top segment close the gap, so no fixed heights are needed.
export const Step = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  column-gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    padding-bottom: 0;
  }

  &::before,
  &::after {
    position: absolute;
    left: calc(1rem - 1px);
    width: 0;
    border-left: 2px dotted ${({ theme }) => theme.colors.border.default};
    content: '';
    pointer-events: none;
  }

  &::before {
    top: 0;
    height: calc(50% - 1.75rem);
  }

  &::after {
    top: calc(50% + 0.75rem);
    bottom: 0;
  }

  &:first-child::before {
    display: none;
  }

  &:last-child::after {
    display: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    align-items: stretch;
    padding-bottom: 0;

    &::before,
    &::after {
      display: none;
    }
  }
`

export const StepNumber = styled.span`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  align-self: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 55%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const StepCard = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const IconTile = styled.span`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.primary} 14%,
    ${({ theme }) => theme.colors.surface.default}
  );
  color: ${({ theme }) => theme.colors.text.accent};
`

export const StepIcon = styled(IconTile)``

export const StepBody = styled.div`
  min-width: 0;
`

export const StepTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

export const StepText = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

/* ---------- Assurances ---------- */

export const Assurances = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
  }
`

export const Assurance = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.3;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.text.accent};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-inline: ${({ theme }) => theme.spacing.md};

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    & + & {
      border-left: 1px solid ${({ theme }) => theme.colors.border.default};
    }
  }
`

/* ---------- Callout ---------- */

export const Callout = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 30%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(
    135deg,
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 14%,
      ${({ theme }) => theme.colors.surface.default}
    ),
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 5%,
      ${({ theme }) => theme.colors.surface.default}
    )
  );
`

export const CalloutIcon = styled(IconTile)``

export const CalloutBody = styled.div`
  min-width: 0;
`

export const CalloutTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const CalloutText = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

/* ---------- Inquiry card ---------- */

export const FormCard = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 1.5rem;
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

export const FormHeader = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;
`

export const FormIcon = styled(IconTile)``

export const FormTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['2xl']},
    2.2vw,
    1.75rem
  );
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.01em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const FormLead = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

export const Form = styled.form`
  display: grid;
  gap: 1.25rem;
`

export const Row = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`

export const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
`

export const Label = styled.label`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.35;
`

export const Required = styled.span`
  color: ${({ theme }) => theme.colors.danger.text};
`

export const Optional = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
`

// Icon-in-control wrapper: the svg is decorative and never intercepts clicks.
export const Control = styled.div<{ $alignTop?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  & > svg {
    position: absolute;
    left: 0.75rem;
    z-index: 1;
    color: ${({ theme }) => theme.colors.text.secondary};
    pointer-events: none;
    transition: color ${({ theme }) => theme.transitions.base};
  }

  &:focus-within > svg {
    color: ${({ theme }) => theme.colors.text.accent};
  }

  ${({ $alignTop }) =>
    $alignTop &&
    css`
      & > svg {
        top: 1rem;
      }
    `}

  ${({ $alignTop }) =>
    !$alignTop &&
    css`
      & > svg {
        top: 50%;
        transform: translateY(-50%);
      }
    `}
`

// Control boundaries need 3:1 against their surface; the softer card border
// does not. Light and dark get different mixes to clear that threshold.
const controlBorder = (theme: AppTheme) =>
  theme.mode === 'dark'
    ? `color-mix(in srgb, ${theme.colors.text.secondary} 55%, ${theme.colors.surface.default})`
    : `color-mix(in srgb, ${theme.colors.text.secondary} 75%, ${theme.colors.surface.default})`

const controlStyles = css`
  width: 100%;
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.md} 0 2.25rem;
  border: 1px solid ${({ theme }) => controlBorder(theme)};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  transition:
    border-color ${({ theme }) => theme.transitions.base},
    background-color ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: color ${({ theme }) => theme.transitions.base};
  }

  &:hover:not(:focus-visible) {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.border.focus};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.border.focus} 4%,
      ${({ theme }) => theme.colors.surface.default}
    );
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 1px;
  }

  /* Native date picker: keep the control quiet until hovered. */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.65;
    transition: opacity ${({ theme }) => theme.transitions.base};
  }

  &::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
`

export const Input = styled.input<{ $invalid?: boolean }>`
  ${controlStyles}
  border-color: ${({ $invalid, theme }) =>
    $invalid ? theme.colors.danger.text : controlBorder(theme)};

  /* Keep the error border through hover and focus; the outline still shows. */
  ${({ $invalid, theme }) =>
    $invalid &&
    css`
      &:hover:not(:focus-visible),
      &:focus-visible {
        border-color: ${theme.colors.danger.text};
      }
    `}
`

export const Textarea = styled(Input).attrs({ as: 'textarea' })`
  min-height: 7rem;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.md} 2.25rem;
  resize: vertical;
`

export const ErrorText = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  color: ${({ theme }) => theme.colors.danger.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

// Honeypot: off-screen, not focusable, ignored by assistive tech.
export const Trap = styled.div`
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
`

export const Submit = styled(PrimaryAction)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.sm};
`

export const Note = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-align: center;

  svg {
    flex-shrink: 0;
  }
`

export const Success = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  justify-items: start;
  padding-top: ${({ theme }) => theme.spacing.sm};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  h2,
  p {
    margin: 0;
  }

  h2 {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }

  svg {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`
