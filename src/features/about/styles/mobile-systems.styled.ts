import styled from 'styled-components'
import { PrimaryButton } from '@/components/ui/styles/buttons.styled'

export const Switcher = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin: 0 0 12px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const SwitchTab = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 4px 8px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.3;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &[aria-selected='false']:hover {
    background: ${({ theme }) => theme.colors.surface.subtle};
  }

  &[aria-selected='true'] {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.brand.navy};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  svg {
    flex: none;
  }
`

export const Panel = styled.div`
  min-width: 0;

  &[hidden] {
    display: none;
  }
`

export const List = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Row = styled.li`
  display: grid;
  gap: 8px;
`

export const RowButton = styled.button`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 24px;
  column-gap: 12px;
  align-items: center;
  width: 100%;
  min-height: 64px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  font: inherit;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`

export const IconTile = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.primary} 14%,
    ${({ theme }) => theme.colors.surface.default}
  );
  color: ${({ theme }) => theme.colors.text.accent};
`

export const RowBody = styled.span`
  display: block;
  min-width: 0;
`

export const RowTitle = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.3;
`

export const RowSummary = styled.span`
  display: block;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  line-height: 1.4;
`

export const ClampedSummary = styled(RowSummary)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

export const Region = styled.div`
  display: grid;
  gap: 12px;
  padding: 0 16px 16px;

  &[hidden] {
    display: none;
  }
`

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.6;
`

export const HelpLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const HelpList = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const ServiceButton = styled.button`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 24px;
  column-gap: 8px;
  align-items: center;
  width: 100%;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.3;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  svg {
    justify-self: center;
    flex: none;
  }

  svg:first-child {
    color: ${({ theme }) => theme.colors.text.accent};
  }

  svg:last-child {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`

export const Cta = styled(PrimaryButton)`
  width: 100%;
`
