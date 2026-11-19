import styled from 'styled-components'

export const Field = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const Control = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const SearchIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`

export const Input = styled.input`
  width: 100%;
  min-height: 2.75rem;
  padding: 0 3rem 0 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  &::-webkit-search-cancel-button {
    appearance: none;
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.border.focus};
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 1px;
  }
`

export const Clear = styled.button`
  position: absolute;
  right: 0;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background.subtle};
    color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: -2px;
  }
`
