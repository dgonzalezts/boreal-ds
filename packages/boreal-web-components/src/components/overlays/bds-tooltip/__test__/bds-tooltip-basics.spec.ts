import { newSpecPage } from '@stencil/core/testing';
import { BdsTooltip } from '../bds-tooltip';
import { getInner } from '@/utils/__test__/helpers';
import { setupPopoverMocks } from './utils/popover-mock';
import { FloatingTooltipProp } from '@/components';

setupPopoverMocks();

describe('bds-tooltip core testing', () => {
  it('Basic render whitout any floating modification', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const inner = getInner(root);
    expect(root.isConnected).toBeTruthy();
    expect(inner.getAttribute('aria-hidden')).toBe('true');

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();

    expect(inner.getAttribute('aria-hidden')).toBe('false');
    expect(inner.getAttribute('data-placement')).toBe('bottom');
    expect(inner.getAttribute('data-hidearrow')).toBeFalsy();
    expect(inner.getAttribute('data-multiline')).toBeNull();
    expect(inner.classList.contains('tooltip-content')).toBeTruthy();
    expect(inner.textContent.trim()).toBe('Text content');

    root.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await waitForChanges();
    expect(inner.getAttribute('aria-hidden')).toBe('true');
  });

  it('Should render with disabled prop and hide the tooltip on hover', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip disabled="true">Text content</bds-tooltip></span>`,
    });
    const inner = getInner(root);
    const spyShow = jest.spyOn(HTMLElement.prototype, 'showPopover');
    const spyHide = jest.spyOn(HTMLElement.prototype, 'hidePopover');

    expect(root.isConnected).toBeTruthy();
    expect(inner.getAttribute('aria-hidden')).toBe('true');
    expect(root.disabled).toBe('true');

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();

    expect(inner.getAttribute('aria-hidden')).toBe('true');
    expect(spyShow).not.toHaveBeenCalled();

    root.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await waitForChanges();

    expect(spyShow).not.toHaveBeenCalled();
    expect(inner.getAttribute('aria-hidden')).toBe('true');
    expect(spyHide).not.toHaveBeenCalled();
  });

  it('Should apply floatingOptions with placement top and hideArrow', async () => {
    const { root, doc, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });

    const tooltip = doc.querySelector('bds-tooltip');
    tooltip.floatingOptions = { placement: 'top', hideArrow: true };
    await waitForChanges();

    expect(tooltip.floatingOptions.placement).toBe('top');
    expect(tooltip.floatingOptions.hideArrow).toBe(true);
    const content = tooltip.querySelector('[part="tooltip-content"]');
    expect(content.getAttribute('data-hidearrow')).toBeNull();
    expect(root.querySelector('[part="arrow"]')).toBeNull();
  });

  it('should apply floatingOptions with placement bottom and stayOnHover', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip id="bottom">Text content</bds-tooltip></span>`,
    });
    const inner = getInner(root);
    const tooltip = root as HTMLBdsTooltipElement;
    root.floatingOptions = { placement: 'bottom', offset: 0, stayOnHover: true };
    await waitForChanges();

    const options: FloatingTooltipProp = tooltip.floatingOptions;
    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    expect(inner.getAttribute('aria-hidden')).toBe('false');

    const content = root.querySelector('[part="tooltip-content"]');
    content.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(inner.getAttribute('aria-hidden')).toBe('false');
    expect(options.placement).toBe('bottom');
    expect(options.offset).toBe(0);
    expect(options.stayOnHover).toBe(true);
  });

  it('Should return correct options from getter when floatingOptions overridden', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const tooltip = root as HTMLBdsTooltipElement;
    tooltip.floatingOptions = { placement: 'left', offset: 64, hideArrow: true };
    await waitForChanges();

    const options: FloatingTooltipProp = tooltip.floatingOptions;
    expect(options.placement).toBe('left');
    expect(options.offset).toBe(64);
    expect(options.arrow).toBeUndefined();
  });
});
