import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';
import { assertExists } from '@/utils/__test__/helpers';

describe('bds-button slots', () => {
  it('should render default slot content', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton">Default Slot</bds-button>`,
    });
    const root = page.root as HTMLElement;
    expect(root.textContent.trim()).toBe('Default Slot');
  });

  it('should render icon slot content', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton"><i class="bds-icon-email" slot="icon"></i></bds-button>`,
    });

    const root = page.root as HTMLElement;
    const icon = root.querySelector('i[slot="icon"]') ?? null;
    const iconContainer = root.querySelector('.bds-button__content-icon--start');

    assertExists(icon, 'Icon element not found');
    assertExists(iconContainer, 'Icon container element not found');

    expect(icon).not.toBeNull();
    expect(icon.classList.contains('bds-icon-email')).toBe(true);
    expect(iconContainer.contains(icon)).toBe(true);
  });

  // TODO: This test should be reviewed when the bds-badge component is created
  it('should render badge slot content', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton"><span class="badge" slot="badge">1</span></bds-button>`,
    });

    const root = page.root as HTMLElement;
    const badge = root.querySelector('[slot="badge"]');
    const badgeContainer = root.querySelector('.bds-button__content-badge');

    assertExists(badge, 'Badge element not found');
    assertExists(badgeContainer, 'Badge container element not found');

    expect(badge).not.toBeNull();
    expect(badge.textContent.trim()).toBe('1');
    expect(badgeContainer.contains(badge)).toBe(true);
  });
});
