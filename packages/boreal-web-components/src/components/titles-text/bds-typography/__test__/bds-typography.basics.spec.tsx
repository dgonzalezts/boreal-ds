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

    const inner = getInner(root);
    expect(inner.textContent.trim()).toBe('Hello world');
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

    const inner = getInner(root);

    expect(inner.classList.contains('bds-typography--heading')).toBe(true);
    expect(inner.textContent.trim()).toContain('Heading H1');
  });

  it('should render with specific element tag', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography element="h1">This is a H1 tag</bds-typography>',
    });

    const h1 = root ? root.querySelector('h1') : null;

    expect(h1).not.toBeNull();

    if (!h1) return;

    expect(h1.classList.contains('bds-typography--display')).toBe(true);
    expect(h1.textContent.trim()).toBe('This is a H1 tag');
  });

  it('should render with specific alignment', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography align="center">This is a paragraph</bds-typography>',
    });

    const inner = getInner(root);

    expect(inner.classList.contains('bds-typography--align-center')).toBe(true);
  });
});

describe('bds-typography ellipsis functionality', () => {
  it('should render with ellipsis in a single line', async () => {
    const { root } = await newSpecPage({
      components: [BdsTypography],
      html: '<bds-typography ellipsis="true">This is a long text with ellipsis.</bds-typography>',
    });

    const inner = getInner(root);
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

describe('bds-typography tag attributes', () => {
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
