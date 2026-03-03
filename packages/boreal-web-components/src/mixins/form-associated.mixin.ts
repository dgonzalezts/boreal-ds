import { Prop, type EventEmitter, type MixedInCtor } from '@stencil/core';

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
 * import { AttachInternals, Component, Event, EventEmitter, Mixin, Prop } from '@stencil/core';
 *
 * import { setFormValue } from '@/utils/form';
 * import { formAssociatedMixin, type IFormControl } from '@/mixins/form-associated.mixin';
 *
 * @Component({ tag: 'bds-text-field', formAssociated: true })
 * export class BdsTextField extends Mixin(formAssociatedMixin) implements ITextField, IFormControl<string> {
 *   @AttachInternals() internals!: ElementInternals;
 *
 *   @Prop({ mutable: true, reflect: true }) value: string = '';
 *
 *   @Event() valueChange!: EventEmitter<string>;
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
 * Contract for form controls that support 2-way binding.
 *
 * Implement this interface on every component that extends `formAssociatedMixin`
 * and owns a `value` prop. The `valueChange` event name is the convention picked
 * up by `@stencil/vue-output-target`'s `componentModels` config to generate
 * `v-model` support automatically.
 *
 * @typeParam T - The type of the value emitted (e.g. `string`, `boolean`, `string[]`).
 *
 * @example
 * ```typescript
 * export class BdsTextField extends Mixin(formAssociatedMixin) implements IFormControl<string> {
 *   @Event() valueChange!: EventEmitter<string>;
 * }
 * ```
 */
export interface IFormValueEmitter<T> {
  /**
   * Emitted whenever the component's value changes.
   * Used by framework output targets to wire up 2-way binding (e.g. `v-model` in Vue).
   */
  valueChange: EventEmitter<T>;
}

/**
 * Composite contract for a fully-featured Boreal DS form control.
 *
 * Extends both `IFormAssociatedCallbacks` (lifecycle hooks) and
 * `IFormValueEmitter<T>` (2-way binding event) into a single interface
 * so component class declarations stay concise.
 *
 * @typeParam T - The type of the value this control works with.
 *
 * @example
 * ```typescript
 * export class BdsTextField extends Mixin(formAssociatedMixin) implements ITextField, IFormControl<string> {
 * ```
 */
export interface IFormControl<T> extends IFormAssociatedCallbacks, IFormValueEmitter<T> {}

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
 * Components must also implement `IFormControl<T>` for value registration,
 * reset, state restoration, and 2-way binding event emission.
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
