import { newSpecPage } from '@stencil/core/testing';
import { BdsTooltip } from '../bds-tooltip';
import { getInner } from '@/utils/__test__/helpers';
import { FloatingTooltipProp } from '@/components';
import { setupPopoverMocks } from '@/utils/__test__';

setupPopoverMocks();

describe('bds-tooltip variants placement, arrow, multiline and disabled', () => {
  it('Should apply floatingOptions with placement left', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const tooltip = root as HTMLBdsTooltipElement;

    tooltip.floatingOptions = { placement: 'left', offset: 64 };
    const options: FloatingTooltipProp = tooltip.floatingOptions;
    await waitForChanges();
    expect(options.placement).toBe('left');
    expect(options.offset).toBe(64);
  });

  it('Should apply floatingOptions with placement right', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const tooltip = root as HTMLBdsTooltipElement;

    tooltip.floatingOptions = { placement: 'right' };
    await waitForChanges();

    const options: FloatingTooltipProp = tooltip.floatingOptions;
    expect(options.placement).toBe('right');
  });

  it('Should render arrow by default', async () => {
    const { root } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });

    const inner = getInner(root);
    expect(inner.querySelector('[part="arrow"]')).not.toBeNull();
  });

  it('should NOT render arrow when hideArrow is true', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const tooltip = root as HTMLBdsTooltipElement;

    tooltip.floatingOptions = { hideArrow: true };
    await waitForChanges();

    const options: FloatingTooltipProp = tooltip.floatingOptions;
    expect(options.hideArrow).toBe(true);

    const inner = getInner(root);
    expect(inner.getAttribute('data-placement')).toBe('bottom');
    expect(inner.querySelector('[part="arrow"]')).toBeNull();
  });

  it('Should render with multiline prop the height should be greather than 32px', async () => {
    const { root } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip multiline="true">Lorem ipsum dolor sit amet</bds-tooltip></span>`,
    });
    expect(root.multiline).toBe('true');

    const content = root.querySelector('[part="tooltip-content"]');
    expect(content.getAttribute('data-multiline')).toBe('true');
  });
});
