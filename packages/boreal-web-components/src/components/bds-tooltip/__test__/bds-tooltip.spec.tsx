import { newSpecPage } from '@stencil/core/testing';
import { BdsTooltip } from '../bds-tooltip';

describe('bds-tooltip', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BdsTooltip],
      html: `<bds-tooltip></bds-tooltip>`,
    });
    expect(page.root).toEqualHtml(`
      <bds-tooltip>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bds-tooltip>
    `);
  });
});
