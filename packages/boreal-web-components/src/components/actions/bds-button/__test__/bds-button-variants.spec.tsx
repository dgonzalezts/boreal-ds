import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';
import { assertExists } from '@/utils/__test__/helpers';

describe('bds-button variants', () => {
  const configurations = [
    { attr: 'color', value: 'primary', expected: 'bds-button--primary' },
    { attr: 'color', value: 'default', expected: 'bds-button--default' },
    { attr: 'color', value: 'error', expected: 'bds-button--error' },
    { attr: 'color', value: 'success', expected: 'bds-button--success' },
    { attr: 'variant', value: 'default', expected: 'bds-button--var-default' },
    { attr: 'variant', value: 'outline', expected: 'bds-button--var-outline' },
    { attr: 'variant', value: 'plain', expected: 'bds-button--var-plain' },
    { attr: 'size', value: 'small', expected: 'bds-button--size-small' },
    { attr: 'size', value: 'large', expected: 'bds-button--size-large' },
    { attr: 'size', value: 'medium', expected: 'bds-button--size-medium' },
  ];

  configurations.forEach(({ attr, value, expected }) => {
    it(`should render with ${attr}=${value}`, async () => {
      const page = await newSpecPage({
        components: [BdsButton],
        html: `<bds-button ${attr}="${value}">Button</bds-button>`,
      });
      const root = page.root as HTMLElement;
      const button = root.querySelector('button');
      assertExists(button, 'Button element should exist');

      expect(button.classList.contains(expected)).toBe(true);
    });
  });
});
