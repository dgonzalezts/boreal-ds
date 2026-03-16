import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';
import { assertExists } from '@/utils/__test__/helpers';

describe('bds-button basics props', () => {
  it('should render with type reset', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" type="reset">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');

    expect(button.getAttribute('type')).toBe('reset');
  });

  it('should render with type submit', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" type="submit">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');

    expect(button.getAttribute('type')).toBe('submit');
  });

  it('should render with loading attribute', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" loading="true">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');

    assertExists(button, 'Button element not found');
    expect(button.classList.contains('bds-button--is-loading')).toBe(true);
  });

  it('should render with disclosure attribute', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" disclosure="true">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');

    const icon = button.querySelector('.bds-icon-chevron-down');
    assertExists(icon, 'Icon element not found');
    expect(icon).not.toBeNull();
  });
});
