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
