import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';

describe('bds-button', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button label="Button Label">Button</bds-button>`,
    });
    expect(root.querySelector('button').getAttribute('aria-label')).toBe('Button Label');
  });
});
