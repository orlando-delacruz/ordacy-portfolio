import styled from 'styled-components'
import { PrimaryButton } from '@/components/ui/styles/buttons.styled'

export const Explorer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr);
    gap: ${({ theme }) => theme.spacing.xl};
    align-items: start;
  }
`

export const TabList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
`

export const Tab = styled.button`
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) auto;
  column-gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  min-height: 4rem;
  padding: 0.75rem ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  text-align: left;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  &[aria-selected='true'] {
    border-color: ${({ theme }) => theme.colors.text.accent};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.brand.primary} 14%,
      ${({ theme }) => theme.colors.surface.default}
    );
  }

  & > svg {
    flex: none;
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const TabIcon = styled.span`
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.accent};
`

export const TabBody = styled.span`
  min-width: 0;
`

export const TabTitle = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.3;
`

export const TabSummary = styled.span`
  display: block;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  line-height: 1.4;
`

export const Panel = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const Intro = styled.div`
  display: grid;
  justify-items: start;
`

export const Rule = styled.span`
  display: block;
  width: 3rem;
  height: 0.25rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.brand.primary};
`

export const PanelHeading = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const PanelHead = styled.div`
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;
`

export const PanelIcon = styled.span`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.primary} 14%,
    ${({ theme }) => theme.colors.surface.default}
  );
  color: ${({ theme }) => theme.colors.text.accent};
`

export const PanelTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  line-height: 1.3;
`

export const PanelText = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  /* 15px: the mock's body copy sits between the sm and md type steps. */
  font-size: 0.9375rem;
  line-height: 1.6;
`

export const Divider = styled.hr`
  height: 0;
  margin: 0;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Help = styled.div`
  display: grid;
  gap: 0.75rem;
`

export const HelpTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const HelpList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;
`

export const HelpLink = styled.button`
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm} 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font: inherit;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  text-align: left;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  & > svg:first-child {
    color: ${({ theme }) => theme.colors.text.accent};
  }

  & > svg:last-child {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`

export const Cta = styled(PrimaryButton)`
  width: 100%;
  justify-self: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: fit-content;
  }
`
