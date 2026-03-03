import { Prop, type MixedInCtor } from '@stencil/core';

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
 * import { AttachInternals, Component, Mixin, Prop } from '@stencil/core';
 *
 * import { setFormValue } from '@/utils/form';
 * import { formAssociatedMixin, type IFormAssociatedCallbacks } from '@/mixins/form-associated.mixin';
 *
 * @Component({ tag: 'bds-text-field', formAssociated: true })
 * export class BdsTextField extends Mixin(formAssociatedMixin) implements IFormAssociatedCallbacks {
 *   @AttachInternals() internals!: ElementInternals;
 *
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
 * - `name`, `disabled`, and `required` form props
 * - `formDisabledCallback` with universal disabled sync behavior
 *
 * Each component must declare `@AttachInternals() internals!: ElementInternals`
 * directly on its class body — Stencil's compiler requires this decorator to be
 * statically visible on the component class, not inside a mixin factory.
 *
 * Components must also implement `IFormAssociatedCallbacks` for value
 * registration, reset, and state restoration.
 */

export const formAssociatedMixin = <B extends MixedInCtor>(Base: B) => {
  class FormAssociated extends Base {
    /** Name of the form control, submitted as a key in the form data. */
    @Prop({ reflect: true }) readonly name!: string;

    /** Disables the control. Synced automatically from a parent `<fieldset>` or `<form>` via `formDisabledCallback`. */
    @Prop({ reflect: true, mutable: true }) readonly disabled: boolean = false;

    /** Marks the control as required for form submission. */
    @Prop({ reflect: true }) readonly required: boolean = false;

    /**
     * Sync component disabled state with parent form disabled state.
     */
    formDisabledCallback(disabled: boolean) {
      (this as { disabled: boolean }).disabled = disabled;
    }
  }

  return FormAssociated;
};
