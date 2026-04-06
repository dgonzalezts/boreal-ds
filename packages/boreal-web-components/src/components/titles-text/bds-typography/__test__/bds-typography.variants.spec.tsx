import { newSpecPage } from '@stencil/core/testing';
import { BdsTypography } from '../bds-typography';
import { getInner } from '@/utils/__test__/helpers';

describe('bds-typography variant dependant prop rendering', () => {
  /**
   * SIZE
   */
  it('should render with specified size when variant supports it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="display" size="lg">Display text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.classList.contains('bds-typography--size-lg')).toBe(true);
  });

  it('should not render with specified size when variant does not support it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="label" size="md">Label text</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.classList.contains('bds-typography--size-md')).toBe(false);
  });

  it('should not render invalid size', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="display" size="invalid-size">Label text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.classList.contains('bds-typography--size-invalid-size')).toBe(false);
  });

  /**
   * Tooltip icon
   */
  it('should render the tooltip icon when the variant supports it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="label" variant="label" tooltip-text="This is a tooltip">Label text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.querySelector('.bds-typography__info-icon')).not.toBeNull();
    expect(inner.querySelector('.bds-icon-info-circle')).not.toBeNull();
  });

  it('should not render the tooltip icon when variant does not support it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="link" tooltip-text="This is a tooltip">Link text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.querySelector('.bds-typography__info-icon')).toBeNull();
    expect(inner.querySelector('.bds-icon-info-circle')).toBeNull();
  });

  it('should not render the tooltip icon when the tooltip text is empty', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="label" variant="label">Label text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.querySelector('.bds-typography__info-icon')).toBeNull();
    expect(inner.querySelector('.bds-icon-info-circle')).toBeNull();
  });

  /**
   * STATE
   */
  it('should render with specified state when variant supports it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="helper" state="error">This is an error helper text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.classList.contains('bds-typography--error')).toBe(true);
  });

  it('should not render with specified state when variant does not support it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="heading" state="error">Heading text</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.classList.contains('bds-typography--error')).toBe(false);
  });

  it('should not render invalid state', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="helper" state="invalid-state">Text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.classList.contains('bds-typography--invalid-state')).toBe(false);
  });

  /**
   * REQUIRED INDICATOR
   */
  it('should render the required indicator when variant supports it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="label" variant="label" is-required="true">Label text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.querySelector('.bds-typography__required-indicator')).not.toBeNull();
  });

  it('should not render with the required indicator when variant does not support it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="heading" is-required="true">Text</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.querySelector('.bds-typography__required-indicator')).toBeNull();
  });

  /**
   * REQUIRED INDICATOR COLOR DEPENDANT ON STATE DISABLED
   */
  it('should render with required indicator and disabled when variant supports state disabled and required indicators', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="label" variant="label" is-required="true" state="disabled">Text disabled and required.</bds-typography>',
    });

    const inner = getInner(root);
    expect(inner.classList.contains('bds-typography--required')).toBe(true);
    expect(inner.classList.contains('bds-typography--disabled')).toBe(true);
  });
});

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
