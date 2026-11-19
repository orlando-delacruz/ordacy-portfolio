import { Link } from 'react-router-dom'
import styled from 'styled-components'

export { PrimaryButton } from '@/components/ui/styles/buttons.styled'

/* ---------- Shared page hero: navy teal-wave band with page art ---------- */

export const Hero = styled.header`
  margin-top: calc(-1 * ${({ theme }) => theme.spacing.xl});
`

export const HeroBand = styled.div<{ $image?: string }>`
  position: relative;
  isolation: isolate;
  margin-inline: calc(-1 * ${({ theme }) => theme.spacing.lg});
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  background-color: #00243e;
  background-image: ${({ $image }) =>
    `url('${$image ?? '/images/ordacy-hero-wave.png'}')`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 44% center;

  &::before {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: inherit;
    background: linear-gradient(
      to right,
      rgba(0, 36, 62, 0.9) 0%,
      rgba(0, 36, 62, 0.65) 48%,
      rgba(0, 36, 62, 0.45) 100%
    );
    content: '';
    pointer-events: none;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['2xl']}
      ${({ theme }) => theme.spacing.xl};
    border-bottom-left-radius: ${({ theme }) => theme.radii.md};
    border-bottom-right-radius: ${({ theme }) => theme.radii.md};
    background-position: right center;

    &::before {
      background: linear-gradient(
        to right,
        rgba(0, 36, 62, 0.9) 0%,
        rgba(0, 36, 62, 0.66) 42%,
        rgba(0, 36, 62, 0.22) 100%
      );
    }
  }
`

// Team pages pass their CSS cover art instead of a background image.
export const Art = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  & > * {
    width: 100%;
    height: 100%;
  }
`

export const HeroGrid = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  max-width: 70rem;
  margin-inline: auto;
`

export const HeroCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  justify-items: start;
  max-width: 36rem;
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
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.white};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['3xl']},
    5vw,
    ${({ theme }) => theme.typography.fontSizes['4xl']}
  );
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  text-wrap: balance;
`

export const Accent = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.brand.primary};
`

export const HeroLead = styled.p`
  max-width: 34rem;
  margin: 0;
  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.white} 78%,
    transparent
  );
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-self: stretch;
  width: 100%;
  max-width: 24rem;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};

  /* The action pair always shares one row. */
  & > * {
    flex: 1 1 0;
    min-width: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    & > a {
      padding-inline: ${({ theme }) => theme.spacing.sm};
    }
  }

  /* At the 320px floor, let a long label take two lines inside its button
     before the row can break. */
  @media (max-width: 24rem) {
    & > a {
      text-align: center;
      white-space: normal;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    & > * {
      flex: 0 0 auto;
    }
  }
`

// Ghost action for navy surfaces: transparent with a white outline.
export const GhostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  border: 1px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.white} 40%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.white};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  text-decoration: none;
  white-space: nowrap;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  svg {
    transition: transform ${({ theme }) => theme.transitions.base};
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover svg,
    &:focus-visible svg {
      transform: translate(2px, -2px);
    }
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand.white};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.white} 10%,
      transparent
    );
    color: ${({ theme }) => theme.colors.brand.white};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand.primary};
    outline-offset: 3px;
  }
`
