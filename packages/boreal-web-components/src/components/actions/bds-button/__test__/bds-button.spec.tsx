import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';

declare global {
  interface Window {
    ElementInternals: any;
  }
}

describe('bds-button', () => {
  beforeAll(() => {
    const MockElementInternals = class {
      form = null;
      setFormValue = jest.fn();
      setValidity = jest.fn();
      checkValidity = jest.fn(() => true);
      reportValidity = jest.fn(() => true);
    };

    if (typeof window.ElementInternals === 'undefined') {
      window.ElementInternals = MockElementInternals;
    }

    if (HTMLElement.prototype.attachInternals === undefined) {
      HTMLElement.prototype.attachInternals = function () {
        return new MockElementInternals() as any;
      };
    }
  });

  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button label="Button Label">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Button Label');
  });
});
