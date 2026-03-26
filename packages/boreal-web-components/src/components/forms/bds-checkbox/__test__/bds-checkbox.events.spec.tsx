import { newSpecPage } from '@stencil/core/testing';
import { attachInternals } from '@/utils/__test__/mocks/ElementInternals';
import { BdsCheckbox } from '../bds-checkbox';
import { assertExists } from '@/utils/__test__/helpers';

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
    const root = page.root as HTMLElement;
    assertExists(checkbox, 'Element not found');
    checkbox.click();
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(root.getAttribute('aria-checked')).toBe('true');
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
    assertExists(checkbox, 'Element not found');
    const ev = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    checkbox.dispatchEvent(ev);
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
    assertExists(checkbox, 'Element not found');
    checkbox.dispatchEvent(ev);
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should clear indeterminate on click', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox indeterminate></bds-checkbox>`,
    });

    const checkbox = page.body.querySelector('bds-checkbox');
    assertExists(checkbox, 'Element not found');
    checkbox.click();
    await page.waitForChanges();
    const root = page.root as HTMLElement;

    expect(root.classList.contains('bds-checkbox--indeterminate')).toBe(false);
    expect(root.getAttribute('aria-checked')).toBe('true');
  });
});
