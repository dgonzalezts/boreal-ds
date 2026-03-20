import { newSpecPage } from '@stencil/core/testing';
import { attachInternals } from '@/utils';
import { BdsTextField } from '../bds-text-field';
import { BdsTypography } from '../../../titles-text/bds-typography/bds-typography';

function typeInInput(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function blurInput(input: HTMLInputElement) {
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

function focusInput(input: HTMLInputElement) {
  input.dispatchEvent(new Event('focus'));
}

describe('bds-text-field validation', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('validationTiming=blur: bdsValidationChange NOT fired on input, only on blur', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    typeInInput(input, '');
    await page.waitForChanges();
    expect(validationSpy).not.toHaveBeenCalled();

    blurInput(input);
    await page.waitForChanges();
    expect(validationSpy).toHaveBeenCalledTimes(1);
  });

  it('validationTiming=blur: emits bdsValidationChange with valid=false and touched=true on blur when required and empty', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    blurInput(input);
    await page.waitForChanges();

    expect(validationSpy).toHaveBeenCalledTimes(1);
    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.valid).toBe(false);
    expect(detail.touched).toBe(true);
  });

  it('validationTiming=input: fires bdsValidationChange with valid=false when minLength=5 and 3 chars typed', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field min-length="5" validation-timing="input"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    typeInInput(input, 'abc');
    await page.waitForChanges();

    expect(validationSpy).toHaveBeenCalled();
    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.valid).toBe(false);
  });

  it('validationTiming=input: fires bdsValidationChange with valid=true when minLength=5 and 5 chars typed', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field min-length="5" validation-timing="input"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    typeInInput(input, 'abcde');
    await page.waitForChanges();

    expect(validationSpy).toHaveBeenCalled();
    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.valid).toBe(true);
  });

  it('validationTiming=change: bdsValidationChange NOT fired on keystroke alone', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="change"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    typeInInput(input, 'abc');
    await page.waitForChanges();

    expect(validationSpy).not.toHaveBeenCalled();
  });

  it('validationTiming=change: fires bdsValidationChange on blur after value was changed from focus value', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="change"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    focusInput(input);
    typeInInput(input, 'abc');
    blurInput(input);
    await page.waitForChanges();

    expect(validationSpy).toHaveBeenCalledTimes(1);
  });

  it('validationTiming=change: bdsValidationChange NOT fired when blur occurs without typing', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="change"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    focusInput(input);
    blurInput(input);
    await page.waitForChanges();

    expect(validationSpy).not.toHaveBeenCalled();
  });

  it('validationTiming=submit: bdsValidationChange NOT fired on input and blur', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="submit"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    typeInInput(input, 'abc');
    blurInput(input);
    await page.waitForChanges();

    expect(validationSpy).not.toHaveBeenCalled();
  });

  it('validationTiming=submit: checkValidity delegates to internals and returns boolean', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="submit"></bds-text-field>',
    });
    const internals = (page.rootInstance as any).internals;
    internals.checkValidity.mockReturnValueOnce(false);
    const result = await (page.root as any).checkValidity();
    expect(typeof result).toBe('boolean');
    expect(result).toBe(false);
  });

  it('required=true + empty value: setValidity called with valueMissing flag', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const internals = (page.rootInstance as any).internals;
    internals.setValidity.mockClear();

    const input = root.querySelector('input') as HTMLInputElement;
    blurInput(input);
    await page.waitForChanges();

    expect(internals.setValidity).toHaveBeenCalledWith({ valueMissing: true }, expect.any(String));
  });

  it('required=true + non-empty value: setValidity called with empty flags', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" value="filled" validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const internals = (page.rootInstance as any).internals;
    internals.setValidity.mockClear();

    const input = root.querySelector('input') as HTMLInputElement;
    blurInput(input);
    await page.waitForChanges();

    expect(internals.setValidity).toHaveBeenCalledWith({}, '');
  });

  it('minLength=5 + 3-char value: setValidity called with tooShort flag', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field min-length="5" validation-timing="input"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const internals = (page.rootInstance as any).internals;
    internals.setValidity.mockClear();

    const input = root.querySelector('input') as HTMLInputElement;
    typeInInput(input, 'abc');
    await page.waitForChanges();

    expect(internals.setValidity).toHaveBeenCalledWith({ tooShort: true }, expect.any(String));
  });

  it('minLength=5 + 5-char value: setValidity called with empty flags (valid)', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field min-length="5" validation-timing="input"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const internals = (page.rootInstance as any).internals;
    internals.setValidity.mockClear();

    const input = root.querySelector('input') as HTMLInputElement;
    typeInInput(input, 'abcde');
    await page.waitForChanges();

    expect(internals.setValidity).toHaveBeenCalledWith({}, '');
  });

  it('failing customValidator: bdsValidationChange.detail.valid is false with custom error message', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field validation-timing="input"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    (root as any).customValidators = [
      {
        key: 'customError',
        isValid: () => false,
        message: 'Custom error message',
      },
    ];
    await page.waitForChanges();

    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);
    const internals = (page.rootInstance as any).internals;
    internals.setValidity.mockClear();

    const input = root.querySelector('input') as HTMLInputElement;
    typeInInput(input, 'abc');
    await page.waitForChanges();

    expect(internals.setValidity).toHaveBeenCalledWith({ customError: true }, 'Custom error message');
    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.valid).toBe(false);
  });

  it('passing customValidator: bdsValidationChange.detail.valid is true', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field validation-timing="input"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    (root as any).customValidators = [
      {
        key: 'alwaysValid',
        isValid: () => true,
        message: 'never shown',
      },
    ];
    await page.waitForChanges();

    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    const input = root.querySelector('input') as HTMLInputElement;
    typeInInput(input, 'abc');
    await page.waitForChanges();

    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.valid).toBe(true);
  });

  it('bdsValidationChange payload contains all required keys with correct types', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    const input = root.querySelector('input') as HTMLInputElement;
    blurInput(input);
    await page.waitForChanges();

    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toHaveProperty('valid');
    expect(detail).toHaveProperty('validity');
    expect(detail).toHaveProperty('value');
    expect(detail).toHaveProperty('touched');
    expect(detail).toHaveProperty('dirty');
    expect(typeof detail.valid).toBe('boolean');
    expect(typeof detail.value).toBe('string');
    expect(typeof detail.touched).toBe('boolean');
    expect(typeof detail.dirty).toBe('boolean');
  });

  it('touched is false in payload before any blur', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field validation-timing="input"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    const input = root.querySelector('input') as HTMLInputElement;
    typeInInput(input, 'a');
    await page.waitForChanges();

    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.touched).toBe(false);
  });

  it('touched becomes true after first blur', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    const input = root.querySelector('input') as HTMLInputElement;
    blurInput(input);
    await page.waitForChanges();

    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.touched).toBe(true);
  });

  it('dirty is false in payload before any input', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    const input = root.querySelector('input') as HTMLInputElement;
    blurInput(input);
    await page.waitForChanges();

    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.dirty).toBe(false);
  });

  it('dirty becomes true after first keystroke', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field validation-timing="input"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const validationSpy = jest.fn();
    root.addEventListener('bdsValidationChange', validationSpy);

    const input = root.querySelector('input') as HTMLInputElement;
    typeInInput(input, 'x');
    await page.waitForChanges();

    const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.dirty).toBe(true);
  });

  describe('patternMismatch validator', () => {
    it('value matching pattern: setValidity called with empty flags', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field pattern="^[a-z]+$" validation-timing="input"></bds-text-field>',
      });
      const internals = (page.rootInstance as any).internals;
      internals.setValidity.mockClear();
      const input = (page.root as HTMLElement).querySelector('input') as HTMLInputElement;

      typeInInput(input, 'abc');
      await page.waitForChanges();

      expect(internals.setValidity).toHaveBeenLastCalledWith({}, '');
    });

    it('value not matching pattern: setValidity called with patternMismatch flag', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field pattern="^[0-9]+$" validation-timing="input"></bds-text-field>',
      });
      const internals = (page.rootInstance as any).internals;
      internals.setValidity.mockClear();
      const input = (page.root as HTMLElement).querySelector('input') as HTMLInputElement;

      typeInInput(input, 'abc');
      await page.waitForChanges();

      expect(internals.setValidity).toHaveBeenLastCalledWith({ patternMismatch: true }, expect.any(String));
    });

    it('empty value is always valid regardless of pattern', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field pattern="^[0-9]+$" validation-timing="blur"></bds-text-field>',
      });
      const internals = (page.rootInstance as any).internals;
      internals.setValidity.mockClear();
      const input = (page.root as HTMLElement).querySelector('input') as HTMLInputElement;

      blurInput(input);
      await page.waitForChanges();

      expect(internals.setValidity).toHaveBeenLastCalledWith({}, '');
    });

    it('empty pattern string always passes patternMismatch validation', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field validation-timing="input"></bds-text-field>',
      });
      const internals = (page.rootInstance as any).internals;
      internals.setValidity.mockClear();
      const input = (page.root as HTMLElement).querySelector('input') as HTMLInputElement;

      typeInInput(input, 'anything goes');
      await page.waitForChanges();

      expect(internals.setValidity).not.toHaveBeenCalledWith(
        expect.objectContaining({ patternMismatch: true }),
        expect.any(String),
      );
    });

    it('malformed regex pattern does not throw and is treated as valid', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field pattern="[invalid" validation-timing="input"></bds-text-field>',
      });
      const internals = (page.rootInstance as any).internals;
      internals.setValidity.mockClear();
      const input = (page.root as HTMLElement).querySelector('input') as HTMLInputElement;

      expect(() => typeInInput(input, 'abc')).not.toThrow();
      await page.waitForChanges();

      expect(internals.setValidity).not.toHaveBeenCalledWith(
        expect.objectContaining({ patternMismatch: true }),
        expect.any(String),
      );
    });

    it('bdsValidationChange emits valid=false when value does not match pattern on blur', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field pattern="^[0-9]+$" validation-timing="blur"></bds-text-field>',
      });
      const root = page.root as HTMLElement;
      const input = root.querySelector('input') as HTMLInputElement;
      const validationSpy = jest.fn();
      root.addEventListener('bdsValidationChange', validationSpy);

      focusInput(input);
      typeInInput(input, 'abc');
      blurInput(input);
      await page.waitForChanges();

      expect(validationSpy).toHaveBeenCalledTimes(1);
      const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
      expect(detail.valid).toBe(false);
    });

    it('bdsValidationChange emits valid=true when value matches pattern on blur', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field pattern="^[0-9]+$" validation-timing="blur"></bds-text-field>',
      });
      const root = page.root as HTMLElement;
      const input = root.querySelector('input') as HTMLInputElement;
      const validationSpy = jest.fn();
      root.addEventListener('bdsValidationChange', validationSpy);

      focusInput(input);
      typeInInput(input, '123');
      blurInput(input);
      await page.waitForChanges();

      const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
      expect(detail.valid).toBe(true);
    });
  });

  describe('internal validation visual state', () => {
    it('bds-text-field--error class applied after failed validation on blur', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field required="true" validation-timing="blur"></bds-text-field>',
      });
      const root = page.root as HTMLElement;
      const input = root.querySelector('input') as HTMLInputElement;

      blurInput(input);
      await page.waitForChanges();

      expect(root.classList.contains('bds-text-field--error')).toBe(true);
    });

    it('internal validationMessage rendered in footer when validationError state is true', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field></bds-text-field>',
      });
      const root = page.root as HTMLElement;
      const instance = page.rootInstance as any;

      instance.validationError = true;
      instance.validationMessage = 'Custom validation error text';
      await page.waitForChanges();

      const helperEl = root.querySelector('.bds-text-field__footer bds-typography[variant="helper"]');
      expect(helperEl).not.toBeNull();
      expect(helperEl!.textContent).toContain('Custom validation error text');
    });

    it('bds-text-field--error class cleared after formResetCallback', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field required="true" validation-timing="blur"></bds-text-field>',
      });
      const root = page.root as HTMLElement;
      const input = root.querySelector('input') as HTMLInputElement;

      blurInput(input);
      await page.waitForChanges();
      expect(root.classList.contains('bds-text-field--error')).toBe(true);

      (page.rootInstance as any).formResetCallback();
      await page.waitForChanges();

      expect(root.classList.contains('bds-text-field--error')).toBe(false);
    });

    it('handleClear clears validationError state removing the error visual', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field pattern="^[0-9]+$" clearable="true" validation-timing="blur"></bds-text-field>',
      });
      const root = page.root as HTMLElement;
      const input = root.querySelector('input') as HTMLInputElement;

      focusInput(input);
      typeInInput(input, 'abc');
      blurInput(input);
      await page.waitForChanges();
      expect(root.classList.contains('bds-text-field--error')).toBe(true);

      const clearBtn = root.querySelector('.bds-text-field__action--clear') as HTMLElement;
      clearBtn.click();
      await page.waitForChanges();

      expect(root.classList.contains('bds-text-field--error')).toBe(false);
    });

    it('invalid event on host: defaultPrevented, validationError set, bdsValidationChange emitted', async () => {
      const page = await newSpecPage({
        components: [BdsTextField, BdsTypography],
        html: '<bds-text-field required="true"></bds-text-field>',
      });
      const root = page.root as HTMLElement;
      const instance = page.rootInstance as any;
      const validationSpy = jest.fn();
      root.addEventListener('bdsValidationChange', validationSpy);
      instance.internals.validationMessage = 'This field is required. Please fill it out.';

      const invalidEvent = new Event('invalid', { cancelable: true, bubbles: false });
      root.dispatchEvent(invalidEvent);
      await page.waitForChanges();

      expect(invalidEvent.defaultPrevented).toBe(true);
      expect(instance.validationError).toBe(true);
      expect(validationSpy).toHaveBeenCalledTimes(1);
      const detail = (validationSpy.mock.calls[0][0] as CustomEvent).detail;
      expect(detail.valid).toBe(false);
    });
  });
});
