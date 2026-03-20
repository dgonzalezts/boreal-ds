import { newSpecPage } from '@stencil/core/testing';
import { attachInternals } from '@/utils/__test__/mocks/ElementInternals';
import { BdsCheckbox } from '../bds-checkbox';

describe('bds-checkbox events', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('should toggle checked on click', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox></bds-checkbox>`,
    });

    const spy = jest.fn();
    page.doc.addEventListener('bdsChange', spy);

    const checkbox = page.body.querySelector('bds-checkbox');
    checkbox?.click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(page.root?.getAttribute('aria-checked')).toBe('true');
  });

  it('should not toggle when disabled', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox disabled></bds-checkbox>`,
    });

    const checkbox = page.root as HTMLElement;

    const spy = jest.fn();
    page.doc.addEventListener('bdsChange', spy);

    checkbox.click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(0);
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('should toggle on Space key', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox></bds-checkbox>`,
    });

    const spy = jest.fn();
    page.doc.addEventListener('bdsChange', spy);

    const checkbox = page.body.querySelector('bds-checkbox');
    const ev = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    checkbox?.dispatchEvent(ev);
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should NOT toggle on Enter key', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox></bds-checkbox>`,
    });

    const spy = jest.fn();
    page.doc.addEventListener('bdsChange', spy);

    const checkbox = page.body.querySelector('bds-checkbox');
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    checkbox?.dispatchEvent(ev);
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should clear indeterminate on click', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox indeterminate></bds-checkbox>`,
    });

    const checkbox = page.body.querySelector('bds-checkbox');
    checkbox?.click();
    await page.waitForChanges();

    expect(page.root?.classList.contains('bds-checkbox--indeterminate')).toBe(false);
    expect(page.root?.getAttribute('aria-checked')).toBe('true');
  });
});
