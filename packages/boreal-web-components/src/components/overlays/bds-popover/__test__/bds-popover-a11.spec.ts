import { newSpecPage } from '@stencil/core/testing';
import { BdsPopover } from '../bds-popover';
import { setupPopoverMocks } from '@/utils/__test__';
import { BdsButton } from '@/components/actions/bds-button/bds-button';

setupPopoverMocks();

describe('bds-popover accessibility', () => {
  it('should have aria-hidden true when not visible', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const popover = root.querySelector('.popover');
    expect(popover.getAttribute('aria-hidden')).toBe('true');
  });

  it('should have aria-hidden false when visible', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(popover.getAttribute('aria-hidden')).toBe('false');
  });

  it('should have role tooltip on floating content', async () => {
    const { doc } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const popover = doc.querySelector('.popover');
    expect(popover.getAttribute('role')).toBe('tooltip');
  });

  it('should set ariaDescribedBy on trigger element', async () => {
    const { doc } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const segment = doc.querySelector('[part="popover-trigger"]');
    expect(segment.getAttribute('ariaDescribedBy')).toBe('popover-content');
  });

  it('should have popover-trigger part on the trigger element', async () => {
    const { doc } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button');
    expect(trigger).not.toBeNull();
  });

  it('should not show popover when disabled', async () => {
    const { doc, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover disabled="true">Content</bds-popover></bds-button></div>`,
    });
    const trigger = doc.querySelector('button');
    const popover = doc.querySelector('.popover');
    const spyShow = jest.spyOn(HTMLElement.prototype, 'showPopover');

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await waitForChanges();

    expect(spyShow).not.toHaveBeenCalled();
    expect(popover.getAttribute('aria-hidden')).toBe('true');
  });
});
