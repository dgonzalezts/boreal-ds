// We should call the mock before importing the component to avoid issues with the decorator during tests
import ValidateDecoratorMock from '@/utils/__test__/mocks/ValidateDecoratorMock';
ValidateDecoratorMock();

import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';

describe('bds-button slots', () => {
  it('should render default slot content', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton">Default Slot</bds-button>`,
    });
    expect(root.textContent.trim()).toBe('Default Slot');
  });

  it('should render icon slot content', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton"><i class="bds-icon-email" slot="icon"></i></bds-button>`,
    });
    const icon = root.querySelector('i[slot="icon"]');
    const iconContainer = root.querySelector('.bds-button__content-icon--start');

    expect(icon).not.toBeNull();
    expect(icon.classList.contains('bds-icon-email')).toBe(true);
    expect(iconContainer.contains(icon)).toBe(true);
  });

  it('should render badge slot content', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton"><span class="badge" slot="badge">1</span></bds-button>`,
    });
    const badge = root.querySelector('[slot="badge"]');
    const badgeContainer = root.querySelector('.bds-button__content-badge');

    expect(badge).not.toBeNull();
    expect(badge.textContent.trim()).toBe('1');
    expect(badgeContainer.contains(badge)).toBe(true);
  });
});
