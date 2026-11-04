import styled from 'styled-components'

export const IconBadge = styled.span`
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const IconBadgeCompact = styled(IconBadge)`
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
`
