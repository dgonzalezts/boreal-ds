import { newSpecPage } from '@stencil/core/testing';
import { BdsBanner } from '../bds-banner';
import { assertExists } from '@/utils/__test__/helpers';

describe('bds-banner events', () => {
  it('should emit the close event after clicking close button', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner enable-close="true"></bds-banner>`,
    });

    const spy = jest.fn();
    page.doc.addEventListener('bdsClose', spy);

    const banner = page.body.querySelector('bds-banner');
    assertExists(banner, 'Banner element not found');

    const closeButton = banner.querySelector('button[role="close-button"]');
    expect(closeButton).not.toBeNull();

    (closeButton as HTMLButtonElement).click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit close event when closed', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner enable-close="true"></bds-banner>`,
    });

    const root = page.root as HTMLElement;

    const spy = jest.fn();
    page.doc.addEventListener('bdsClose', spy);

    const closeButton = root.querySelector('button[role="close-button"]');
    (closeButton as HTMLButtonElement).click();

    await page.waitForChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit the close event when the closeBanner method is called', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner enable-close="true"></bds-banner>`,
    });

    const spy = jest.fn();
    page.doc.addEventListener('bdsClose', spy);

    const banner = page.body.querySelector('bds-banner');
    assertExists(banner, 'Banner element not found');
    await banner.closeBanner();

    await page.waitForChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit the close event when Escape is pressed focusing the host', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner enable-close="true"></bds-banner>`,
    });

    const spy = jest.fn();
    page.doc.addEventListener('bdsClose', spy);

    const banner = page.body.querySelector('bds-banner');
    assertExists(banner, 'Banner element not found');
    banner.focus();

    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    assertExists(banner, 'Banner element not found');
    banner.dispatchEvent(ev);

    await page.waitForChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit the close event when the banner enable-close is false', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const spy = jest.fn();
    page.doc.addEventListener('bdsClose', spy);

    const banner = page.body.querySelector('bds-banner');
    assertExists(banner, 'Banner element not found');
    banner.focus();

    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    assertExists(banner, 'Banner element not found');
    banner.dispatchEvent(ev);

    await page.waitForChanges();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
