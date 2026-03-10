import { newSpecPage } from '@stencil/core/testing';
import { BdsCheckbox } from '../bds-checkbox';

beforeAll(() => {
  if (!HTMLElement.prototype.attachInternals) {
    HTMLElement.prototype.attachInternals = function () {
      return {
        setFormValue: () => {},
        setValidity: () => {},
        form: null,
        labels: [] as unknown as NodeList,
        validationMessage: '',
        validity: {} as ValidityState,
        willValidate: false,
        checkValidity: () => true,
        reportValidity: () => true,
      } as unknown as ElementInternals;
    };
  }
});

describe('bds-checkbox', () => {
  it('should render the checkbox element', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox></bds-checkbox>`,
    });

    const root = page.root as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute('role')).toBe('checkbox');
    expect(root.getAttribute('aria-checked')).toBe('false');
  });

  it('should render with label prop', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox label="Accept terms"></bds-checkbox>`,
    });

    const label = page.root?.querySelector('.bds-checkbox__label');
    expect(label?.textContent).toContain('Accept terms');
  });

  it('should render with slot when no label prop', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox><span>Slotted label</span></bds-checkbox>`,
    });

    const label = page.root?.querySelector('.bds-checkbox__label');
    expect(label).not.toBeNull();
  });

  describe('checked state', () => {
    it('should reflect checked prop in aria-checked', async () => {
      const page = await newSpecPage({
        components: [BdsCheckbox],
        html: `<bds-checkbox checked></bds-checkbox>`,
      });

      const root = page.root as HTMLElement;
      expect(root.getAttribute('aria-checked')).toBe('true');
      expect(root.classList.contains('bds-checkbox--checked')).toBe(true);
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
  });

  describe('indeterminate state', () => {
    it('should show mixed aria-checked when indeterminate', async () => {
      const page = await newSpecPage({
        components: [BdsCheckbox],
        html: `<bds-checkbox indeterminate></bds-checkbox>`,
      });

      const root = page.root as HTMLElement;
      expect(root.getAttribute('aria-checked')).toBe('mixed');
      expect(root.classList.contains('bds-checkbox--indeterminate')).toBe(true);
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

  describe('error state', () => {
    it('should apply error class', async () => {
      const page = await newSpecPage({
        components: [BdsCheckbox],
        html: `<bds-checkbox error></bds-checkbox>`,
      });

      expect(page.root?.classList.contains('bds-checkbox--error')).toBe(true);
    });
  });

  describe('disabled state', () => {
    it('should apply disabled class and aria attribute', async () => {
      const page = await newSpecPage({
        components: [BdsCheckbox],
        html: `<bds-checkbox></bds-checkbox>`,
      });

      const checkbox = page.root as HTMLBdsCheckboxElement;
      checkbox.disabled = true;
      await page.waitForChanges();

      expect(checkbox.classList.contains('bds-checkbox--disabled')).toBe(true);
      expect(checkbox.getAttribute('aria-disabled')).toBe('true');
      expect(checkbox.getAttribute('tabindex')).toBe('-1');
    });

    it('should not toggle when disabled', async () => {
      const page = await newSpecPage({
        components: [BdsCheckbox],
        html: `<bds-checkbox></bds-checkbox>`,
      });

      const checkbox = page.root as HTMLBdsCheckboxElement;
      checkbox.disabled = true;
      await page.waitForChanges();

      const spy = jest.fn();
      page.doc.addEventListener('bdsChange', spy);

      checkbox.click();
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledTimes(0);
      expect(checkbox.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('keyboard interaction', () => {
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
  });
});
