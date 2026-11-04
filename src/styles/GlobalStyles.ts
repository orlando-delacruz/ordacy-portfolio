import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
    background: ${({ theme }) => theme.colors.background.default};
    color-scheme: ${({ theme }) => theme.mode};
    scroll-behavior: smooth;
  }

  body {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    background: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  #root {
    min-height: 100vh;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  }

  a {
    color: ${({ theme }) => theme.colors.brand.deep};
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  img,
  svg,
  video,
  canvas {
    display: block;
    max-width: 100%;
  }

  img {
    height: auto;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 3px;
  }

  /*
   * Scroll reveal (see useScrollReveal): [data-reveal] blocks fade up as they
   * enter the viewport. Uses the "translate" property so it never overrides an
   * element's own transform animations. data-reveal="1".."3" staggers siblings.
   */
  @media (prefers-reduced-motion: no-preference) {
    [data-reveal] {
      opacity: 0;
      translate: 0 1.5rem;
      transition:
        opacity 700ms ease-out,
        translate 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
    }

    [data-reveal='1'] {
      transition-delay: 100ms;
    }

    [data-reveal='2'] {
      transition-delay: 200ms;
    }

    [data-reveal='3'] {
      transition-delay: 300ms;
    }

    /* "none", not "0 0", so revealed blocks don't keep a containing block
       for fixed/sticky descendants. */
    [data-reveal][data-revealed] {
      opacity: 1;
      translate: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`
