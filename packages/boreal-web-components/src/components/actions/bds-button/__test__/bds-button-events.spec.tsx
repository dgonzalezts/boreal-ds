// We should call the mock before importing the component to avoid issues with the decorator during tests
import ValidateDecoratorMock from '@/utils/__test__/mocks/ValidateDecoratorMock';
ValidateDecoratorMock();

import { newSpecPage } from '@stencil/core/testing';
import ElementInternals from '@/utils/__test__/mocks/ElementInternals';
import { BdsButton } from '../bds-button';

declare global {
  interface Window {
    ElementInternals: any;
  }
}

describe('bds-button events', () => {
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

  it('should renders with aria-label', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button label="Button Label" name="TestButton">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Button Label');
    expect(button.getAttribute('name')).toBe('TestButton');
  });
});
