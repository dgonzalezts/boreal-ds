import { AttachInternals, Prop, type MixedInCtor } from '@stencil/core';

/**
 * Lifecycle callbacks that each Form-Associated Custom Element must implement.
 *
 * These callbacks stay outside `formAssociatedMixin` because value semantics
 * differ per component (for example default value and restore behavior).
 *
 * Implement this interface on every component that extends `formAssociatedMixin`.
 *
 * @example
 * ```typescript
 * import { Component, Mixin, Prop } from '@stencil/core';
 *
 * import { setFormValue } from '@/utils/form';
 * import { formAssociatedMixin, type IFormAssociatedCallbacks } from '@/mixins/form-associated.mixin';
 *
 * @Component({ tag: 'bds-text-field', formAssociated: true })
 * export class BdsTextField extends Mixin(formAssociatedMixin) implements IFormAssociatedCallbacks {
 *   @Prop({ mutable: true, reflect: true }) value: string = '';
 *
 *   public formAssociatedCallback(): void {
 *     setFormValue(this.internals, this.value);
 *   }
 *
 *   public formResetCallback(): void {
 *     this.value = '';
 *     setFormValue(this.internals, null);
 *   }
 *
 *   public formStateRestoreCallback(state: unknown, _mode: string): void {
 *     this.value = typeof state === 'string' ? state : '';
 *     setFormValue(this.internals, this.value);
 *   }
 * }
 * ```
 */
export interface IFormAssociatedCallbacks {
  /**
   * Called when the component becomes associated with a form, or when its
   * `form` attribute changes.
   */
  formAssociatedCallback(): void;

  /**
   * Called when the parent form is reset via `form.reset()`.
   */
  formResetCallback(): void;

  /**
   * Called when the browser restores form state (e.g. back/forward navigation).
   *
   * @param state - The previously saved form value for this component.
   * @param mode - Either `'restore'` (autofill) or `'autocomplete'`.
   */
  formStateRestoreCallback(state: unknown, mode: string): void;
}

/**
 * Shared base mixin for Form-Associated Custom Elements in Boreal DS.
 *
 * Provides:
 * - `internals` for native form participation APIs
 * - `name`, `disabled`, and `required` form props
 * - `formDisabledCallback` with universal disabled sync behavior
 *
 * Components must still implement `IFormAssociatedCallbacks` for value
 * registration, reset, and state restoration.
 */

export const formAssociatedMixin = <B extends MixedInCtor>(Base: B) => {
  class FormAssociated extends Base {
    @AttachInternals() internals!: ElementInternals;

    @Prop({ reflect: true }) name!: string;

    @Prop({ reflect: true, mutable: true }) disabled: boolean = false;

    @Prop({ reflect: true }) required: boolean = false;

    /**
     * Sync component disabled state with parent form disabled state. */
    formDisabledCallback(disabled: boolean) {
      this.disabled = disabled;
    }
  }

  return FormAssociated;
};
