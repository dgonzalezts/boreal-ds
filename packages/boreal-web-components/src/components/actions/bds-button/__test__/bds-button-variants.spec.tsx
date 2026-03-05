// We should call the mock before importing the component to avoid issues with the decorator during tests
import ValidateDecoratorMock from '@/utils/__test__/mocks/ValidateDecoratorMock';
ValidateDecoratorMock();

import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';
import ElementInternals from '@/utils/__test__/mocks/ElementInternals';

declare global {
  interface Window {
    ElementInternals: any;
  }
}

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

  beforeAll(() => {
    const MockElementInternals = ElementInternals;

    if (typeof window.ElementInternals === 'undefined') {
      window.ElementInternals = MockElementInternals;
    }

    if (HTMLElement.prototype.attachInternals === undefined) {
      HTMLElement.prototype.attachInternals = function () {
        return new MockElementInternals() as any;
      };
    }
  });

  configurations.forEach(({ attr, value, expected }) => {
    it(`should render with ${attr}=${value}`, async () => {
      const { root } = await newSpecPage({
        components: [BdsButton],
        html: `<bds-button ${attr}="${value}">Button</bds-button>`,
      });
      const button = root.querySelector('button');
      expect(button.classList.contains(expected)).toBe(true);
    });
  });
});
