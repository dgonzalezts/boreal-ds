import { css } from 'lit';

export const FormDemoStyles = css`
  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: var(--boreal-typography-font-family-primary, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
    color: var(--boreal-colors-text-default, #424242);
    font-weight: 400;
  }

  h3 {
    font-size: var(--boreal-typography-text-heading-regular-3xl, 2rem);
    line-height: 40px;
  }

  .storybook-card {
    background: #f5f6fa;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(16, 30, 54, 0.04);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .storybook-flex {
    display: flex;
    gap: 2rem;
  }

  .storybook-col {
    flex: 1 1 0;
  }

  /* Apply layout to the top-level slotted form container */
  ::slotted(.form-container),
  ::slotted(form) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-output {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow-x: auto;
  }

  @media (max-width: 900px) {
    .storybook-flex {
      flex-direction: column;
      gap: 1.5rem;
    }
    .storybook-card {
      padding: 1rem;
    }
  }
`;
