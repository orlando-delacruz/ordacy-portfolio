import styled from 'styled-components'

export const StatusList = styled.ul`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    align-items: start;
    padding-block: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  }

  svg {
    margin-top: 0.125rem;
    color: ${({ theme }) => theme.colors.text.accent};
  }

  strong {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }

  p {
    margin: 0.25rem 0 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }
`
