import type { IFormValidator } from '@/types/form';

/**
 * Registers the component's current value with the browser's form machinery.
 *
 * Wraps `ElementInternals.setFormValue()` so the value appears in `FormData`
 * under the component's `name` attribute when the form is submitted.
 * Pass `null` to remove the component's contribution from `FormData`
 * (e.g. an unchecked checkbox).
 *
 * @param internals - The component's `ElementInternals` instance (from `@AttachInternals()`).
 * @param value - The value to register, or `null` to deregister.
 *
 * @example
 * ```typescript
 * // Register a string value on every value change
 * @Watch('value')
 * onValueChange(next: string) {
 *   setFormValue(this.internals, next);
 * }
 *
 * // Deregister when unchecked
 * setFormValue(this.internals, null);
 * ```
 */
export function setFormValue(internals: ElementInternals, value: FormDataEntryValue | null): void {
  internals.setFormValue(value);
}

/**
 * Runs an array of validators against the host element and reports the combined
 * result to `ElementInternals.setValidity()`.
 *
 * All validators are evaluated regardless of order. The first failing validator's
 * message is used as the validation message, matching native browser behaviour
 * (one message surfaced at a time). When all validators pass, the component is
 * marked valid and any previous invalid state is cleared.
 *
 * @param internals - The component's `ElementInternals` instance (from `@AttachInternals()`).
 * @param validators - Array of `IFormValidator` objects to evaluate.
 * @param el - The host element passed to each validator's `isValid` function.
 * @returns `true` if all validators pass, `false` if any fail.
 *
 * @example
 * ```typescript
 * private get validators(): IFormValidator[] {
 *   return [
 *     {
 *       key: 'valueMissing',
 *       isValid: (el) => !(el as BdsInput).required || (el as BdsInput).value !== '',
 *       message: 'This field is required.',
 *     },
 *     {
 *       key: 'tooShort',
 *       isValid: (el) => {
 *         const { value, minLength } = el as BdsInput;
 *         return minLength === undefined || value.length >= minLength;
 *       },
 *       message: `Minimum length not reached.`,
 *     },
 *   ];
 * }
 *
 * private updateValidity() {
 *   runValidators(this.internals, this.validators, this.el);
 * }
 * ```
 */
export function runValidators(internals: ElementInternals, validators: IFormValidator[], el: HTMLElement): boolean {
  const flags: Partial<ValidityStateFlags> = {};
  let firstMessage = '';

  for (const { key, isValid, message } of validators) {
    if (!isValid(el)) {
      flags[key] = true;
      if (firstMessage === '') firstMessage = message;
    }
  }

  const valid = Object.keys(flags).length === 0;
  internals.setValidity(valid ? {} : flags, firstMessage);
  return valid;
}
