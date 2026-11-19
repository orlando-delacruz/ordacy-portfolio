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

  /*
   * Single source of truth for the sticky top bar's total height, safe-area
   * aware. The hero offset, anchor scroll margins and the bar itself all
   * derive from it, so the 40px rhythm holds whatever the bar measures.
   */
  :root {
    --top-bar-height: calc(env(safe-area-inset-top, 0px) + 3.5rem);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    :root {
      --top-bar-height: calc(env(safe-area-inset-top, 0px) + 4rem);
    }
  }

  /*
   * Scrollbars: slim, rounded, and theme-aware. Chromium/Safari get the
   * custom track and pill thumb; Firefox keeps the standard thin style.
   */
  @supports selector(::-webkit-scrollbar) {
    *::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    *::-webkit-scrollbar-track {
      background: transparent;
    }

    *::-webkit-scrollbar-thumb {
      border: 3px solid transparent;
      border-radius: ${({ theme }) => theme.radii.pill};
      background-color: color-mix(
        in srgb,
        ${({ theme }) => theme.colors.text.secondary} 42%,
        transparent
      );
      background-clip: content-box;
    }

    *::-webkit-scrollbar-thumb:hover {
      background-color: color-mix(
        in srgb,
        ${({ theme }) => theme.colors.text.secondary} 68%,
        transparent
      );
    }

    *::-webkit-scrollbar-corner {
      background: transparent;
    }
  }

  @supports not selector(::-webkit-scrollbar) {
    * {
      scrollbar-color: color-mix(
          in srgb,
          ${({ theme }) => theme.colors.text.secondary} 42%,
          transparent
        )
        transparent;
      scrollbar-width: thin;
    }
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

  /* Anchor targets clear the sticky top bar plus a little air. */
  [id] {
    scroll-margin-top: calc(var(--top-bar-height) + 1rem);
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

  /* Print: the document only. Shell, hero, CTA, and footer carry
     data-print-hide. */
  @media print {
    html,
    body {
      background: #fff;
      color: #000;
    }

    [data-print-hide] {
      display: none !important;
    }

    #main-content > div {
      max-width: none;
      padding: 0;
    }
  }
`
