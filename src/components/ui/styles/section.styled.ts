import styled from 'styled-components'

export const Wrapper = styled.section`
  padding-block: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-block: ${({ theme }) => theme.spacing.xl};
  }
`

export const Header = styled.div<{ $withAction?: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  ${({ $withAction, theme }) =>
    $withAction &&
    `
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${theme.spacing.md};
  `}
`

export const HeaderText = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  min-width: 0;
  max-width: 44rem;
`

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: clamp(
    ${({ theme }) => theme.typography.fontSizes['2xl']},
    4.5vw,
    ${({ theme }) => theme.typography.fontSizes['3xl']}
  );
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
