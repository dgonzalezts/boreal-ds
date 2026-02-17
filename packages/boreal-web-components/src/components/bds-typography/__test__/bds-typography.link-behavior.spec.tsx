import { newSpecPage } from '@stencil/core/testing';
import { BdsTypography } from '../bds-typography';
import { getInner } from '@/utils/__test__/helpers';

describe('bds-typography link functionality', () => {
  it('should render link variant with href', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="a" variant="link" href="#">Anchor text</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner).toBeTruthy();
    expect(inner.getAttribute('href')).not.toBeNull();
  });

  it('should render link variant with target attribute', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="a" variant="link" href="#" target="_blank">Anchor text</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.getAttribute('target')).toEqual('_blank');
    expect(inner.getAttribute('rel')).toEqual('noopener noreferrer');
  });

  it('should render a downloadable link', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="a" variant="link" is-downloadable="true">Anchor text</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.getAttribute('download')).toBeTruthy();
  });

  it('should render a downloadable link with custom filename', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="a" variant="link" is-downloadable="true" filename="custom_name.pdf">Anchor text</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.getAttribute('download')).toEqual('custom_name.pdf');
  });
});

// TODO poner todo con variables
// TODO probar Label
