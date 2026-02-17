import { newSpecPage } from '@stencil/core/testing';
import { BdsTypography } from '../bds-typography';
import { getInner } from '@/utils/__test__/helpers';

describe('bds-typography accessibility attributes', () => {
  it('should use htmlfor attribute when passing the prop htmlFor to a element="label"', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="label" variant="label" html-for="input-id-123">Hello world</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.getAttribute('htmlfor')).not.toBeNull();
  });

  it('should use for attribute when element="label"', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="label" variant="label" html-for="input-id-123">Hello world</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.getAttribute('htmlfor')).not.toBeNull();
  });
});
