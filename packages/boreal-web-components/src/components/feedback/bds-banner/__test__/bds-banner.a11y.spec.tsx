import { newSpecPage } from '@stencil/core/testing';
import { BdsBanner } from '../bds-banner';

describe('bds-banner a11y', () => {
  it('should have role="alert" by default', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('role')).toBe('alert');
  });

  it('should have aria-live="polite"', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('aria-live')).toBe('polite');
  });

  it('should have aria-describedby pointing to content when open', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('aria-describedby')).toBe('bds-banner__content');
  });

  it('should have aria-hidden="false" when open', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('aria-hidden')).toBe('false');
  });

  it('should have tabIndex="0" when open', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('tabindex')).toBe('0');
  });

  it('should have aria-hidden="true" and tabIndex="-1" when closed', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const component = page.rootInstance as BdsBanner;
    component.isOpen = false;
    await page.waitForChanges();

    const root = page.root as HTMLElement;
    expect(root?.getAttribute('aria-hidden')).toBe('true');
    expect(root?.getAttribute('tabindex')).toBe('-1');
  });

  it('should have aria-describedby null when closed', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const component = page.rootInstance as BdsBanner;
    component.isOpen = false;
    await page.waitForChanges();

    const root = page.root as HTMLElement;
    expect(root.getAttribute('aria-describedby')).toBeNull();
  });

  it('should have status icon with role="status", aria-live="polite", and correct aria-label', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner variant="info"></bds-banner>`,
    });

    const statusIcon = page.root?.querySelector('[role="status"]');
    expect(statusIcon).toBeTruthy();
    expect(statusIcon?.getAttribute('role')).toBe('status');
    expect(statusIcon?.getAttribute('aria-live')).toBe('polite');
    expect(statusIcon?.getAttribute('aria-label')).toBe('status info');
  });

  it('should have status icon with correct aria-label for different variants', async () => {
    const variants = ['success', 'warning', 'danger'];
    for (const variant of variants) {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `<bds-banner variant="${variant}"></bds-banner>`,
      });

      const statusIcon = page.root?.querySelector('[role="status"]');
      expect(statusIcon?.getAttribute('aria-label')).toBe(`status ${variant}`);
    }
  });

  it('should have the icon inside status with aria-hidden="true"', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const icon = page.root?.querySelector('[role="status"] em');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have close button with role="close-button" and aria-label when enable-close is true', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner enable-close="true" close-button-label="Close banner"></bds-banner>`,
    });

    const closeButton = page.root?.querySelector('button[role="close-button"]');
    expect(closeButton).toBeTruthy();
    expect(closeButton?.getAttribute('role')).toBe('close-button');
    expect(closeButton?.getAttribute('aria-label')).toBe('Close banner');
  });

  it('should handle Escape key to close when enable-close is true', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner enable-close="true"></bds-banner>`,
    });

    const component = page.rootInstance as BdsBanner;
    const spy = jest.spyOn(component.bdsClose, 'emit');

    const root = page.root as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    root.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
  });

  it('should not handle Escape key when enable-close is false', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const component = page.rootInstance as BdsBanner;
    const spy = jest.spyOn(component.bdsClose, 'emit');

    const root = page.root as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    root.dispatchEvent(event);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should inherit aria attributes', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner aria-label="Custom label" aria-describedby="external-id"></bds-banner>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('aria-label')).toBe('Custom label');
    expect(root.getAttribute('aria-describedby')).toBe('bds-banner__content');
  });
});
