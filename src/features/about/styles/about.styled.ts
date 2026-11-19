import styled from 'styled-components'

/* ---------- Hero ---------- */

export const Page = styled.div`
  /* Soft mint wash at the page edges, as in the About reference. */
  background:
    radial-gradient(
      36rem 20rem at 0% 100%,
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.brand.primary} 8%,
        transparent
      ),
      transparent 72%
    ),
    radial-gradient(
      28rem 18rem at 100% 0%,
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.brand.primary} 6%,
        transparent
      ),
      transparent 72%
    );
`

export const Hero = styled.header`
  /* Cancel the shell's top padding so the band sits under the Top Bar. */
  margin-top: calc(-1 * ${({ theme }) => theme.spacing.xl});
`

export const HeroBand = styled.div`
  position: relative;
  isolation: isolate;
  padding: ${({ theme }) => theme.spacing.lg};
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
    /* Mobile keeps the laptop visible while the copy stays on the dark side. */
    background: linear-gradient(
      100deg,
      rgba(0, 36, 62, 0.97) 0%,
      rgba(0, 36, 62, 0.9) 55%,
      rgba(0, 36, 62, 0.72) 100%
    );
    content: '';
    pointer-events: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing['2xl']};
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

  /* Keep the lead over the dark part of the art at mid widths. */
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
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  letter-spacing: -0.02em;
  line-height: 1.05;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: clamp(2.5rem, 4.2vw, 3.5rem);
  }
`

export const HeroAccent = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.brand.primary};
`

export const HeroLead = styled.p`
  max-width: 32rem;
  margin: 0;
  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.white} 78%,
    transparent
  );
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  }
`

/* ---------- Sections ---------- */

// The About reference uses a tighter rhythm than the site's 40px default,
// with a hairline between every block.
export const Block = styled.section`
  padding-block: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};

  /* The mobile composition separates sections with eyebrows and whitespace. */
  @media (max-width: 63.999rem) {
    border-top: 0;
  }
`

/* ---------- Mobile section heading ---------- */

export const MobileStack = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  min-width: 0;

  & > * {
    min-width: 0;
  }
`

export const MobileSection = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;

  & > * {
    min-width: 0;
  }
`

export const MobileHead = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-items: start;
`

export const MobileEyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;

  &::before {
    display: block;
    width: 1.25rem;
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.brand.primary};
    content: '';
  }
`

export const MobileTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const MobileDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.6;
`

export const BlockHead = styled.div<{ $flush?: boolean }>`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-items: start;
  max-width: 44rem;
  margin-bottom: ${({ $flush, theme }) =>
    $flush ? '0' : theme.spacing.lg};
`

export const Rule = styled.span`
  display: block;
  width: 9rem;
  height: 4px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.brand.primary};
`

export const BlockTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(2rem, 3.2vw, 2.5rem);
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const BlockDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

/* ---------- Why Ordacy exists ---------- */

export const Why = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.9fr);
    gap: ${({ theme }) => theme.spacing['2xl']};
    align-items: start;
  }
`

export const WhyCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 60ch;

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }
`

/* ---------- Closing ---------- */
