import styled from 'styled-components'

export const Header = styled.div<{ $withAction?: boolean; $compact?: boolean }>`
  margin-bottom: ${({ $compact, theme }) =>
    $compact ? theme.spacing.md : theme.spacing['2xl']};

  ${({ $withAction, theme }) =>
    $withAction &&
    `
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing.md};
  `}
`

export const Text = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
  max-width: 44rem;
`

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(1.5rem, 4.5vw, 2rem);
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: -0.02em;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
