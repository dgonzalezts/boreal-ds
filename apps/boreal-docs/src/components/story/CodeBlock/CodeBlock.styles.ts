import { css } from 'lit';

export const CodeBlockStyles = css`
  .code-block-container h3 {
    font-family: var(--boreal-typography-font-family-primary, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
    color: var(--boreal-colors-text-default, #424242);
    font-weight: 400;
    font-size: var(--boreal-typography-text-heading-regular-3xl, 2rem);
    line-height: 40px;
    margin-bottom: 1rem;
  }

  .storybook-code {
    background: #0e0e2c;
    color: #fff;
    border-radius: 8px;
    padding: 1rem;
    font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
    font-size: 0.95rem;
    font-weight: 400;
    margin-bottom: 1rem;
    white-space: pre-wrap;
    overflow-x: auto;
  }

  .storybook-code.light {
    background: #23272f;
  }

  .storybook-code pre {
    margin: 0;
  }

  .storybook-code code {
    font-family: inherit;
  }
`;
