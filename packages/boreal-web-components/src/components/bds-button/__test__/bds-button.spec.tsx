import { newSpecPage } from '@stencil/core/testing';
import { BdsButton } from '../bds-button';

describe('bds-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button></bds-button>`,
    });
    expect(page.root).toEqualHtml(`
      <bds-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bds-button>
    `);
  });
});
