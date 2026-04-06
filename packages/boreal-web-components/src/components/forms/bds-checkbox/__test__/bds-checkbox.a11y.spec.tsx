import { newSpecPage } from '@stencil/core/testing';
import { attachInternals } from '@/utils/__test__/mocks/ElementInternals';
import { BdsCheckbox } from '../bds-checkbox';

describe('bds-checkbox a11y', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('should have aria-checked="false" by default', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox></bds-checkbox>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('aria-checked')).toBe('false');
  });

  it('should have aria-checked="true" when checked', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox checked></bds-checkbox>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('aria-checked')).toBe('true');
  });

  it('should have aria-checked="mixed" when indeterminate', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox indeterminate></bds-checkbox>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('aria-checked')).toBe('mixed');
  });

  it('should have aria-disabled and tabindex="-1" when disabled', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox disabled></bds-checkbox>`,
    });

    const checkbox = page.root as HTMLElement;
    expect(checkbox.getAttribute('aria-disabled')).toBe('true');
    expect(checkbox.getAttribute('tabindex')).toBe('-1');
  });

  it('should have tabindex="0" when not disabled', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox></bds-checkbox>`,
    });

    const root = page.root as HTMLElement;
    expect(root.getAttribute('tabindex')).toBe('0');
  });
});
