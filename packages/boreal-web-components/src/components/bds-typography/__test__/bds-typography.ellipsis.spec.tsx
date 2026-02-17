import { newSpecPage } from '@stencil/core/testing';
import { BdsTypography } from '../bds-typography';
import { getInner } from '@/utils/__test__/helpers';

describe('bds-typography ellipsis functionality', () => {
  it('should render with ellipsis in a single line', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography ellipsis="true">This is a long text with ellipsis.</bds-typography>',
    });

    const inner = root.firstElementChild;
    expect(inner.classList.contains('bds-typography--ellipsis')).toBe(true);
    expect(inner.classList.contains('bds-typography--ellipsis-multiline')).toBe(false);
  });

  it('should render with ellipsis when max lines > 1', async () => {
    const lines = 2;
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: `<bds-typography ellipsis="true" max-lines="${lines}">This is a long text with ellipsis.</bds-typography>`,
    });

    const inner = getInner(root);

    expect(inner.classList.contains('bds-typography--ellipsis')).toBe(false);
    expect(inner.classList.contains('bds-typography--ellipsis-multiline')).toBe(true);
    expect(inner.style.webkitLineClamp).toBe(`${lines}`);
  });
});
