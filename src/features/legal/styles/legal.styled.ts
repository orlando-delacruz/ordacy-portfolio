import styled from 'styled-components'

export const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing['3xl']};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 14rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing['2xl']};
    align-items: start;
  }
`

export const Toc = styled.nav`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: ${({ theme }) => theme.spacing['3xl']};
  }

  h2 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  ol {
    display: grid;
    gap: ${({ theme }) => theme.spacing.xs};
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs} 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.text.accent};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.border.focus};
      outline-offset: 2px;
    }
  }
`

export const Body = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 44rem;

  section {
    /* Leaves room for the fixed top bar when jumping to a section. */
    scroll-margin-top: ${({ theme }) => theme.spacing['3xl']};
  }

  h2 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }

  p,
  li {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
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
`
