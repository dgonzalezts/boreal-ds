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

describe('bds-button basics props', () => {
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

  it('should renders basic button with aria-label, name', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button label="Button Label" name="TestButton">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Button Label');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('name')).toBe('TestButton');
  });

  it('should render with type reset', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" type="reset">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    expect(button.getAttribute('type')).toBe('reset');
  });

  it('should render with type submit', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" type="submit">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('should render with disabled attribute', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" disabled>Button</bds-button>`,
    });
    const button = root.querySelector('button');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.getAttribute('aria-disabled')).not.toBeNull();
  });

  it('should render with isLoading attribute', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" is-loading="true">Button</bds-button>`,
    });
    const clickSpy = jest.fn();
    root.addEventListener('click', clickSpy);

    const button = root.querySelector('button');
    button.click();
    expect(button.classList.contains('bds-button--is-loading')).toBe(true);
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should render with hasDisclosure attribute', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" has-disclosure="true">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    const icon = button.querySelector('.bds-icon-chevron-down');
    expect(icon).not.toBeNull();
  });
});
