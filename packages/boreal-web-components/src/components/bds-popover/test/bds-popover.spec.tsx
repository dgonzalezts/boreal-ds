import { newSpecPage } from '@stencil/core/testing';
import { BdsPopover } from '../bds-popover';

describe('bds-popover', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BdsPopover],
      html: `<bds-popover></bds-popover>`,
    });
    expect(page.root).toEqualHtml(`
      <bds-popover>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bds-popover>
    `);
  });
});
