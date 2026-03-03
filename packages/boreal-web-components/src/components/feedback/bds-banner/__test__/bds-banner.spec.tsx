import { newSpecPage } from '@stencil/core/testing';
import { BdsBanner } from '../bds-banner';

describe('bds-banner', () => {
  it('should render the banner element', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `<bds-banner></bds-banner>`,
    });

    const root = page.root as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.classList.contains('bds-banner')).toBe(true);
  });

  describe('basic rendering', () => {
    it('Should render a banner element with default properties', async () => {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `<bds-banner>Banner body text.</bds-banner>`,
      });
      const root = page.root as HTMLElement;

      expect(root.classList.contains('bds-banner--info')).toBe(true);

      const icon = root.querySelector('[role="status"]');
      expect(icon).not.toBeNull();

      const closeBtn = root.querySelector('button');

      expect(closeBtn).toBeNull();
    });

    it('Should render a banner element with danger variant', async () => {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `<bds-banner variant="danger"></bds-banner>`,
      });

      const root = page.root as HTMLElement;

      expect(root.classList.contains('bds-banner--danger')).toBe(true);
    });

    it('Should render a banner element with warning variant', async () => {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `<bds-banner variant="warning"></bds-banner>`,
      });

      const root = page.root as HTMLElement;

      expect(root.classList.contains('bds-banner--warning')).toBe(true);
    });

    it('Should render a banner element with success variant', async () => {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `<bds-banner variant="success"></bds-banner>`,
      });

      const root = page.root as HTMLElement;

      expect(root.classList.contains('bds-banner--success')).toBe(true);
    });

    it('Should render a banner element with custom slots', async () => {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `
        <bds-banner>
          <span slot="title">Title</span>
          <p>Body</p>
          <div slot="actions">
            <button>Action</button>
          </div>
        </bds-banner>`,
      });

      const root = page.root as HTMLElement;

      const titleSlot = root.querySelector('span');
      expect(titleSlot).not.toBeNull();
      expect(root.textContent).toContain('Title');

      const bodySlot = root.querySelector('p');
      expect(bodySlot).not.toBeNull();
      expect(root.textContent).toContain('Body');

      const actionsSlot = root.querySelector('button');
      expect(actionsSlot).not.toBeNull();
      expect(root.textContent).toContain('Action');
    });
  });

  describe('closing behavior', () => {
    it('should close after clicking close button', async () => {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `<bds-banner enable-close="true"></bds-banner>`,
      });

      const spy = jest.fn();
      page.doc.addEventListener('close', spy);

      const banner = page.body.querySelector('bds-banner');

      const closeButton = banner?.querySelector('button[role="close-button"]');
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
      page.doc.addEventListener('close', spy);

      const closeButton = root.querySelector('button[role="close-button"]');
      (closeButton as HTMLButtonElement).click();

      await page.waitForChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should close the banner when closeBanner is called', async () => {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `<bds-banner enable-close="true"></bds-banner>`,
      });

      const spy = jest.fn();
      page.doc.addEventListener('close', spy);

      const banner = page.body.querySelector('bds-banner');
      await banner?.closeBanner();

      await page.waitForChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should close when Escape is pressed on the host', async () => {
      const page = await newSpecPage({
        components: [BdsBanner],
        html: `<bds-banner enable-close="true"></bds-banner>`,
      });

      const spy = jest.fn();
      page.doc.addEventListener('close', spy);

      const banner = page.body.querySelector('bds-banner');
      banner?.focus();

      const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      banner?.dispatchEvent(ev);

      await page.waitForChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
