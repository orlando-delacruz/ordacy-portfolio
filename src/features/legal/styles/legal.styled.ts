import styled from 'styled-components'

export const Doc = styled.div`
  padding-top: 2.5rem;
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};

  @media print {
    padding: 0;
  }
`

/* ---------- Document meta ---------- */

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};

  @media print {
    display: none !important;
  }
`

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};

  svg {
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const PrintButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 2.75rem;
  margin-left: auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    margin-left: 0;
  }
`

/* ---------- Layout ---------- */

export const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 14rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing['2xl']};
    align-items: start;
  }

  @media print {
    display: block;
    margin: 0;
  }
`

/* ---------- Table of contents ---------- */

export const Toc = styled.nav`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: 4rem;
  }

  @media print {
    display: none !important;
  }
`

export const TocTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const TocList = styled.ol`
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const TocLink = styled.a<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 2.75rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.brand.primary : 'transparent'};
  box-shadow: none;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.brand.navy : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ $active, theme }) =>
    $active
      ? theme.typography.fontWeights.bold
      : theme.typography.fontWeights.semibold};
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.brand.navy : theme.colors.text.accent};
    background: ${({ $active, theme }) =>
      $active ? theme.colors.brand.secondary : theme.colors.background.subtle};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const TocNumber = styled.span`
  flex: none;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
`

/* ---------- Document body ---------- */

export const Body = styled.article`
  display: grid;
  min-width: 0;
  max-width: 44rem;

  @media print {
    max-width: 44rem;
    margin-inline: auto;
  }
`

export const PrintHeader = styled.div`
  display: none;

  @media print {
    display: grid;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`

export const PrintTitle = styled.h1`
  margin: 0;
  color: #000;
  font-size: 20pt;
  line-height: 1.2;
`

export const PrintMeta = styled.p`
  margin: 0;
  color: #444;
  font-size: 10pt;
`

export const Lead = styled.p`
  max-width: 44rem;
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};

  @media print {
    margin-bottom: 16pt;
    color: #000;
    font-size: 11pt;
  }
`

export const Section = styled.section`
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  scroll-margin-top: ${({ theme }) => theme.spacing['3xl']};

  &:first-of-type {
    padding-top: 0;
    border-top: 0;
  }

  & + & {
    margin-top: ${({ theme }) => theme.spacing.xl};
  }

  @media print {
    padding-top: 16pt;
    border-color: #ccc;

    & + & {
      margin-top: 16pt;
    }
  }
`

export const HeadingRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

export const SectionNumber = styled.span`
  flex: none;
  padding-top: 4px;
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-variant-numeric: tabular-nums;
`

export const SectionTitle = styled.h2`
  flex: 1;
  min-width: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};

  @media print {
    color: #000;
    font-size: 16pt;
  }
`

export const AnchorLink = styled.a`
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.55;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    opacity ${({ theme }) => theme.transitions.fast};

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  @media print {
    display: none !important;
  }
`

export const SectionBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  p,
  li {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }

  p {
    margin: 0;
  }

  ul {
    display: grid;
    gap: ${({ theme }) => theme.spacing.xs};
    margin: 0;
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  a {
    color: ${({ theme }) => theme.colors.text.accent};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  @media print {
    p,
    li {
      color: #000;
      font-size: 11pt;
    }
  }
`

/* ---------- Print rules live inside each component below. ---------- */
