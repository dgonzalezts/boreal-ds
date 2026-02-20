import { newSpecPage } from '@stencil/core/testing';
import { BdsTypography } from '../bds-typography';
import { getInner } from '@/utils/__test__/helpers';

describe('bds-typography component', () => {
  it('should render', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography>Hello world</bds-typography>',
    });

    expect(root).toBeTruthy();
    expect(root.textContent.trim()).toBe('Hello world');
  });
});

describe('bds-typography basic prop rendering', () => {
  it('should render with default props', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography>Hello world</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner).not.toBeNull();
    expect(inner.classList.contains('bds-typography--display')).toBe(true);
    expect(inner.classList.contains('bds-typography--align-start')).toBe(true);
    expect(inner.textContent.trim()).toBe('Hello world');
  });

  it('should render with specific variant', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="heading">Heading H1</bds-typography>',
    });

    const inner = root.firstElementChild;

    expect(inner.classList.contains('bds-typography--heading')).toBe(true);
    expect(inner.textContent.trim()).toContain('Heading H1');
  });

  it('should render with specific element tag', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="h1">This is a H1 tag</bds-typography>',
    });

    const h1 = root.querySelector('h1');

    expect(h1).not.toBeNull();
    expect(h1.classList.contains('bds-typography--display')).toBe(true);
    expect(h1.textContent.trim()).toBe('This is a H1 tag');
  });

  it('should render with specific alignment', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography align="center">This is a paragraph</bds-typography>',
    });

    const inner = root.firstElementChild;

    expect(inner.classList.contains('bds-typography--align-center')).toBe(true);
  });
});

describe('bds-typography variant dependant prop rendering', () => {
  /**
   * SIZE
   */
  it('should render with specified size when variant supports it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="display" size="l">Display text</bds-typography>',
    });

    const inner = root.firstElementChild;
    expect(inner.classList.contains('bds-typography--size-l')).toBe(true);
  });

  it('should not render with specified size when variant does not support it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="label" size="m">Label text</bds-typography>',
    });

    const inner = root.firstElementChild;
    expect(inner.classList.contains('bds-typography--size-m')).toBe(false);
  });

  it('should not render invalid size', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="display" size="invalid-size">Label text</bds-typography>',
    });

    const inner = root.firstElementChild;
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

    const inner = root.firstElementChild;
    expect(inner.classList.contains('bds-typography--error')).toBe(true);
  });

  it('should not render with specified state when variant does not support it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="heading" state="error">Heading text</bds-typography>',
    });

    const inner = root.firstElementChild;

    expect(inner.classList.contains('bds-typography--error')).toBe(false);
  });

  it('should not render invalid state', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="helper" state="invalid-state">Text</bds-typography>',
    });

    const inner = root.firstElementChild;
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

    const inner = root.firstElementChild;
    expect(inner.querySelector('.bds-typography__required-indicator')).not.toBeNull();
  });

  it('should not render with the required indicator when variant does not support it', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography variant="heading" is-required="true">Text</bds-typography>',
    });

    const inner = root.firstElementChild;
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

    const inner = root.firstElementChild;
    expect(inner.classList.contains('bds-typography--required')).toBe(true);
    expect(inner.classList.contains('bds-typography--disabled')).toBe(true);
  });
});

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

describe('bds-typography dynamic tag attributes', () => {
  it('should set href, target and filename attributes only when element="a"', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="a" href="#" target="_blank" is-downloadable="true">Anchor text</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.getAttribute('href')).not.toBeNull();
    expect(inner.getAttribute('target')).not.toBeNull();
    expect(inner.getAttribute('download')).not.toBeNull();
  });

  it('should not set href, target and filename attributes on elements different to a', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="span" href="#" target="_blank" is-downloadable="true">Anchor text</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.getAttribute('href')).toBeNull();
    expect(inner.getAttribute('target')).toBeNull();
    expect(inner.getAttribute('download')).toBeNull();
  });
});

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
