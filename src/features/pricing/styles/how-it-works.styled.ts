import styled from 'styled-components'

export const List = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export const Item = styled.li`
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  column-gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 3rem minmax(0, 1fr);
    padding: ${({ theme }) => theme.spacing.lg};
  }

  /* Four-up cards are narrow; stack the icon so the copy keeps a readable
     measure instead of squeezing beside it. */
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: ${({ theme }) => theme.spacing.md};
    align-content: start;
  }
`

export const Tile = styled.span`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 3rem;
    height: 3rem;

    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`

export const Body = styled.div`
  min-width: 0;
`

export const Title = styled.h3`
  margin: 0;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
  }
`

export const Text = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
`
