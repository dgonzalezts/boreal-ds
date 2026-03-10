import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';
import { assertExists } from '@/utils/__test__/helpers';

describe('bds-button a11y', () => {
  it('should renders basic button with aria-label, name', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button label="Button Label" name="TestButton">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');

    expect(button.getAttribute('aria-label')).toBe('Button Label');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('name')).toBe('TestButton');
  });

  it('should render with disabled attribute', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" disabled>Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');
    expect(button.getAttribute('aria-disabled')).not.toBeNull();
  });

  it('should click when space or enter is pressed', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');

    const clickSpy = jest.fn();
    root.addEventListener('click', clickSpy);

    button.focus();
    button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(clickSpy).toHaveBeenCalledTimes(1);

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });
});
