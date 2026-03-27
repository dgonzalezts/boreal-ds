import { newSpecPage } from '@stencil/core/testing';
import { BdsPopover } from '../bds-popover';
import { setupPopoverMocks } from '@/utils/__test__';
import { BdsButton } from '@/components/actions/bds-button/bds-button';

setupPopoverMocks();

describe('bds-popover behavior', () => {
  it('Should show popover on trigger click', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const spyShow = jest.spyOn(HTMLElement.prototype, 'showPopover');
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(spyShow).toHaveBeenCalled();
    expect(popover.getAttribute('aria-hidden')).toBe('false');
  });

  it('Should toggle popover on consecutive trigger clicks', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();
    expect(popover.getAttribute('aria-hidden')).toBe('false');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();
    expect(popover.getAttribute('aria-hidden')).toBe('true');
  });

  it('Should close popover when clicking outside', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div><div id="outside">Outside</div>`,
    });
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');
    const outside = doc.getElementById('outside');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();
    expect(popover.getAttribute('aria-hidden')).toBe('false');

    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(popover.getAttribute('aria-hidden')).toBe('true');
  });

  it('Should NOT close when closeOnClickOutside is false and clicking outside', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div><div id="outside">Outside</div>`,
    });
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');
    const popoverEl = doc.querySelector('bds-popover');
    popoverEl.floatingOptions = { closeOnClickOutside: false };
    await waitForChanges();

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();
    expect(popover.getAttribute('aria-hidden')).toBe('false');

    const outside = doc.getElementById('outside');

    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(popover.getAttribute('aria-hidden')).toBe('false');
  });

  it('Should close popover when closeOnClick is true and clicking inside content', async () => {
    const { root, doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover><p id="inner">Content</p></bds-popover></bds-button>`,
    });
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();
    const popoverEl = root.querySelector('bds-popover');
    popoverEl.floatingOptions = { closeOnClick: true };

    const content = root.querySelector('.popover-content');
    content.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(popover.getAttribute('aria-hidden')).toBe('true');
  });

  it('should NOT close popover when closeOnClick is false and clicking inside content', async () => {
    const { root, doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    const content = root.querySelector('.popover-content');
    content.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(popover.getAttribute('aria-hidden')).toBe('false');
  });

  it('should not propagate click from popover to trigger', async () => {
    const { root, doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();
    expect(root.querySelector('.popover').getAttribute('aria-hidden')).toBe('false');

    // Click inside popover should not re-trigger show via trigger
    popover.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    // Should still be visible, not toggled by the bubbled click
    expect(popover.getAttribute('aria-hidden')).toBe('false');
  });
});
