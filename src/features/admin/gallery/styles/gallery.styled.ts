import styled from 'styled-components'

export const UploadPlaceholder = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.subtle};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  svg {
    flex: none;
    color: ${({ theme }) => theme.colors.text.accent};
  }

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  p {
    margin: 0.25rem 0 0;
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }
`

export const Grid = styled.ol`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Item = styled.li<{ $hidden: boolean }>`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $hidden, theme }) =>
    $hidden ? theme.colors.surface.subtle : theme.colors.surface.default};

  & > :last-child {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`

export const Thumb = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const Meta = styled.div`
  display: grid;
  gap: 0.25rem;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  span {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`
