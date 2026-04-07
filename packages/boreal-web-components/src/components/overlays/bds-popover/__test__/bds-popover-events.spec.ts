import { newSpecPage } from '@stencil/core/testing';
import { BdsPopover } from '../bds-popover';
import { setupPopoverMocks } from '@/utils/__test__';
import { BdsButton } from '@/components/actions/bds-button/bds-button';

setupPopoverMocks();

describe('bds-popover events', () => {
  it('should call showPopover when trigger is clicked', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover width="auto">Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button') as HTMLElement;
    const spyShow = jest.spyOn(HTMLElement.prototype, 'showPopover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(spyShow).toHaveBeenCalledTimes(1);
  });

  it('should call hidePopover when trigger is clicked while open', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover width="auto">Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button') as HTMLElement;
    const spyHide = jest.spyOn(HTMLElement.prototype, 'hidePopover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(spyHide).toHaveBeenCalledTimes(1);
  });

  it('should call hidePopover when close button is clicked', async () => {
    const { root, doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover has-header="true" show-close="true">Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button') as HTMLElement;
    const spyHide = jest.spyOn(HTMLElement.prototype, 'hidePopover');
    const popover = doc.querySelector('.popover') as HTMLElement;

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    const closeBtn = root?.querySelector('.popover-header__close') as HTMLElement;
    closeBtn.dispatchEvent(new CustomEvent('bdsClick', { bubbles: true }));
    await waitForChanges();

    expect(spyHide).toHaveBeenCalled();
    expect(popover.getAttribute('aria-hidden')).toBe('true');
  });

  it('Should call hidePopover when footer button triggers closeOnClick', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button><bds-popover has-footer="true"><bds-button slot="footer-button" id="footer-btn">OK</bds-button></bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button') as HTMLElement;
    const popover = doc.querySelector('.popover') as HTMLElement;
    const popoverEl = doc.querySelector('bds-popover') as HTMLBdsPopoverElement;
    popoverEl.floatingOptions = { closeOnClick: true };
    await waitForChanges();

    const spyHide = jest.spyOn(HTMLElement.prototype, 'hidePopover');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    const footerBtn = doc.querySelector('#footer-btn') as HTMLElement;
    footerBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spyHide).toHaveBeenCalledTimes(0);
    await waitForChanges();

    expect(popover.getAttribute('aria-hidden')).toBe('false');
  });

  it('Should NOT call hidePopover when footer button triggers closeOnClick', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button><bds-popover has-footer="true"><button slot="footer-button" id="footer-btn">OK</button></bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button') as HTMLElement;
    const popover = doc.querySelector('.popover') as HTMLElement;
    const popoverEl = doc.querySelector('bds-popover') as HTMLBdsPopoverElement;
    popoverEl.floatingOptions = { closeOnClick: false };
    await waitForChanges();

    const spyHide = jest.spyOn(HTMLElement.prototype, 'hidePopover');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    const footerBtn = doc.querySelector('#footer-btn') as HTMLElement;
    footerBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(spyHide).toHaveBeenCalledTimes(0);
    await waitForChanges();

    expect(popover.getAttribute('aria-hidden')).toBe('false');
  });

  it('should call showPopover only once even if trigger is clicked rapidly', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button') as HTMLElement;
    const spyShow = jest.spyOn(HTMLElement.prototype, 'showPopover');
    const spyHide = jest.spyOn(HTMLElement.prototype, 'hidePopover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(spyShow).toHaveBeenCalledTimes(1);
    expect(spyHide).toHaveBeenCalledTimes(1);
  });
});
