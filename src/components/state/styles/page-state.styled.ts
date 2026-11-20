import styled from 'styled-components'

// Page-level state panel: public section rhythm with centered content and no
// closing CTA (the page hero sits above it).
export const PanelSection = styled.section`
  display: grid;
  justify-items: center;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  margin-inline: auto;
  padding-block: clamp(3.5rem, 8vw, 5.5rem);
  text-align: center;
`
