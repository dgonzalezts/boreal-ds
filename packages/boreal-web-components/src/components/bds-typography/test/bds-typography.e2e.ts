import { newE2EPage } from '@stencil/core/testing';

describe('bds-typography', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<bds-typography></bds-typography>');

    const element = await page.find('bds-typography');
    expect(element).toHaveClass('hydrated');
  });
});
