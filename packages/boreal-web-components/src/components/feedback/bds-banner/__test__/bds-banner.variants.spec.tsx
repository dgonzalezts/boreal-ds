import { newSpecPage } from '@stencil/core/testing';
import { BdsBanner } from '../bds-banner';

describe('bds-banner variants', () => {
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
});
