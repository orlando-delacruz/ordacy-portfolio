import styled, { css } from 'styled-components'

export const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & > [data-wide] {
      grid-column: 1 / -1;
    }
  }
`

export const Fieldset = styled.fieldset`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;

  legend {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }
`

export const Field = styled.div`
  display: grid;
  align-content: start;
  gap: 0.375rem;
  min-width: 0;
`

export const Label = styled.label`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

export const Optional = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
`

const control = css<{ $invalid?: boolean }>`
  width: 100%;
  min-height: 2.75rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $invalid, theme }) =>
      $invalid ? theme.colors.danger.text : theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.border.focus};
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 1px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const Input = styled.input<{ $invalid?: boolean }>`
  ${control}
`

export const Select = styled.select<{ $invalid?: boolean }>`
  ${control}
  cursor: pointer;
`

export const Textarea = styled.textarea<{ $invalid?: boolean }>`
  ${control}
  min-height: 7rem;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  resize: vertical;
`

export const Hint = styled.p`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`

export const ErrorText = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  color: ${({ theme }) => theme.colors.danger.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`

// Native checkbox styled as a switch; the label stays clickable.
export const Switch = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  cursor: pointer;

  input {
    position: relative;
    flex: none;
    width: 2.5rem;
    height: 1.5rem;
    margin: 0;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.background.subtle};
    cursor: pointer;
    appearance: none;
    transition:
      background ${({ theme }) => theme.transitions.fast},
      border-color ${({ theme }) => theme.transitions.fast};

    &::after {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 1.125rem;
      height: 1.125rem;
      border-radius: ${({ theme }) => theme.radii.round};
      background: ${({ theme }) => theme.colors.text.secondary};
      content: '';
      transition: transform ${({ theme }) => theme.transitions.fast};
    }

    &:checked {
      border-color: ${({ theme }) => theme.colors.text.accent};
      background: ${({ theme }) => theme.colors.text.accent};

      &::after {
        background: ${({ theme }) => theme.colors.background.default};
        transform: translateX(1rem);
      }
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.border.focus};
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Search = styled.div`
  position: relative;
  flex: 1 1 16rem;
  max-width: 24rem;

  svg {
    position: absolute;
    top: 50%;
    left: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    transform: translateY(-50%);
    pointer-events: none;
  }

  input {
    padding-left: 2.5rem;
  }
`
