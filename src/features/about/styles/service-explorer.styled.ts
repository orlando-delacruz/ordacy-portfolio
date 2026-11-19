import styled, { css } from 'styled-components'
import { PrimaryButton } from '@/components/ui/styles/buttons.styled'
import { fluidFont } from '@/styles/typography'

// Tinted teal surface shared by the selected tab and the problem box.
const mintSurface = css`
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.brand.primary} 14%,
    ${({ theme }) => theme.colors.surface.default}
  );
`

export const Explorer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};

  /* Mid-size desktops: the picker sits above the panel so the article keeps
     a comfortable measure instead of a narrow side column. */
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) and (max-width: 79.9375rem) {
    grid-template-columns: minmax(0, 1fr);
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: minmax(0, 3fr) minmax(0, 5fr);
    align-items: start;
  }
`

export const TabList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) and (max-width: 79.9375rem) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }
`

export const Tab = styled.button`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  align-items: center;
  column-gap: ${({ theme }) => theme.spacing.md};
  min-height: 3rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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

  &[aria-selected='true'] {
    border-color: ${({ theme }) => theme.colors.text.accent};
    ${mintSurface}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }

  svg {
    flex: none;
    justify-self: center;
  }
`

export const Panel = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface.default};
`

export const PanelHead = styled.div`
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  column-gap: ${({ theme }) => theme.spacing.md};
  align-items: start;

  & > div {
    min-width: 0;
  }
`

export const PanelIcon = styled.span`
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.accent};
  ${mintSurface}
`

export const PanelTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`

export const PanelDescription = styled.p`
  max-width: 46rem;
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${fluidFont(0.9375)};
  line-height: 1.6;
`

export const Label = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const Problem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  ${mintSurface}
`

export const ProblemLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.accent};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const ProblemText = styled.p`
  max-width: 46rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.6;
`

export const Columns = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    line-height: 1.6;
  }

  svg {
    flex: none;
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

export const Audience = styled.p`
  display: flex;
  align-items: flex-start;
  flex: 1 1 16rem;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.6;

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    flex: none;
    margin-top: 4px;
    color: ${({ theme }) => theme.colors.text.accent};
  }
`

export const Cta = styled(PrimaryButton)`
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: fit-content;
    margin-left: auto;
  }
`
