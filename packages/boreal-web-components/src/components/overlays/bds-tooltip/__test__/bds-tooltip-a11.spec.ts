import { newSpecPage } from '@stencil/core/testing';
import { BdsTooltip } from '../bds-tooltip';
import { setupPopoverMocks } from '@/utils/__test__';

setupPopoverMocks();

describe('bds-tooltip accessibility testing role and aria attributes', () => {
  it('Should have role="tooltip" on content element', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();

    const content = root.querySelector('[part="tooltip-content"]');
    expect(content.getAttribute('role')).toBe('tooltip');
  });

  it('Should return null when trigger is not activated', async () => {
    const { root } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });

    const content = root.querySelector('[part="tooltip-content"]');
    expect(content.getAttribute('popover')).toBe('manual');
  });

  it('Should have "tooltip" class on host', async () => {
    const { root } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });

    expect(root.classList.contains('tooltip')).toBe(true);
  });
});
