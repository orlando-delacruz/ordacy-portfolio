import styled from 'styled-components'

/* ---------- Shared card pieces ---------- */

const Card = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const CardTile = styled.span`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.primary} 14%,
    ${({ theme }) => theme.colors.surface.default}
  );
  color: ${({ theme }) => theme.colors.text.accent};
`

export const CardTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.4;
`

export const CardText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.5;
`

/* ---------- Principles ---------- */

export const PrinciplesList = styled.ol`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
  }

  /* Five-up only on the widest screens so each card keeps a readable width. */
  @media (min-width: 90rem) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`

export const PrincipleCard = styled(Card)`
  position: relative;
`

export const PrincipleNumber = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.04em;
`

export const PrincipleTitle = styled(CardTitle)`
  padding-right: ${({ theme }) => theme.spacing.xl};
`

/* ---------- Process path ---------- */

export const ProcessList = styled.ol`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: ${({ theme }) => theme.spacing.md};
  row-gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.lg};
    row-gap: ${({ theme }) => theme.spacing.xl};
  }
`

export const ProcessStep = styled.li`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-content: start;
  min-width: 0;

  /* The connector only belongs to the four-across path. */
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    /* Connector reaches the next icon centre: 24px gap + 24px icon radius. */
    &::after {
      position: absolute;
      top: 24px;
      left: calc(1.5rem + 1px);
      right: -3rem;
      z-index: 0;
      height: 2px;
      background: color-mix(
        in srgb,
        ${({ theme }) => theme.colors.brand.primary} 30%,
        transparent
      );
      content: '';
    }

    &:last-child::after {
      display: none;
    }
  }
`

export const ProcessIcon = styled.span`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid
    color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 35%,
      transparent
    );
  border-radius: ${({ theme }) => theme.radii.round};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.accent};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 3rem;
    height: 3rem;
  }
`

export const ProcessTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.4;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }
`

export const ProcessText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.5;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    line-height: 1.6;
  }
`

/* ---------- Audience ---------- */

export const AudienceList = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export const AudienceCard = styled(Card)`
  grid-template-columns: 2.5rem minmax(0, 1fr);
  column-gap: 12px;
  align-items: start;
`

export const AudienceBody = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`

/* ---------- Expectations ---------- */

export const ExpectationsList = styled.ul`
  display: grid;
  /* Row-major order already pairs proposal/timelines, payment/ownership,
     warranty/maintenance across the rows as in the reference. */
  grid-template-columns: minmax(0, 1fr);
  column-gap: ${({ theme }) => theme.spacing.lg};
  row-gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* Three across uses the width of the side-column layout. */
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

export const Expectation = styled.li`
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr);
  column-gap: 0.75rem;
  align-items: start;
`

export const ExpectationIcon = styled.span`
  display: grid;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.accent};
`

export const ExpectationBody = styled.div`
  min-width: 0;
`

export const ExpectationTitle = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.4;
`

export const ExpectationText = styled.span`
  display: block;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.6;
`
