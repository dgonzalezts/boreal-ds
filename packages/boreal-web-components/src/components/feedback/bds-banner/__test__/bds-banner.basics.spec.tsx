import { newSpecPage } from '@stencil/core/testing';
import { BdsBanner } from '../bds-banner';
import { assertExists } from '@/utils/__test__/helpers';

describe('bds-banner basics', () => {
  it('should render the banner element', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const root = page.root as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.classList.contains('bds-banner')).toBe(true);
  });

  it('should render a banner element with default properties', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner>Banner body text.</bds-banner>`,
    });
    const root = page.root as HTMLElement;
    const banner = page.body.querySelector('bds-banner');

    expect(root.classList.contains('bds-banner--info')).toBe(true);

    const icon = root.querySelector('[role="status"]');
    expect(icon).not.toBeNull();

    assertExists(banner, 'Banner element not found');

    const closeButton = banner.querySelector('button[role="close-button"]');
    expect(closeButton).toBeNull();
  });
});
