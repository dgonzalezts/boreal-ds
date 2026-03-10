import { AttachInternals, Component, Element, Event, EventEmitter, Host, Mixin, Prop, Watch, h } from '@stencil/core';

import type { ICheckbox } from './types/ICheckbox';
import { formAssociatedMixin, type IFormControl } from '@/mixins/form-associated.mixin';
import { setFormValue } from '@/utils/form';
import { Attributes, inheritAriaAttributes } from '@/utils/a11y/attributes';
import { getBaseAttributes } from '@/utils/helpers/common/BaseAttributes';

/**
 * Checkbox component for boolean selection with three visual states.
 *
 * @element bds-checkbox
 *
 * @summary A checkbox form control with default, selected, and indeterminate states.
 *
 * @slot - Default slot for label content when no `label` prop is provided.
 *
 * @property {boolean} checked - Whether the checkbox is selected. Defaults to `false`.
 * @property {boolean} indeterminate - Whether the checkbox shows an indeterminate ("mixed") visual state. Defaults to `false`.
 * @property {boolean} error - Shows error styling on the checkbox. Defaults to `false`.
 * @property {string}  value - Value submitted with the form data when checked. Defaults to `"on"`.
 * @property {string}  label - Label displayed next to the checkbox. If not provided, the default slot is used.
 * @property {string}  idComponent - Unique identifier for the checkbox element.
 *
 * @fires valueChange - Emitted when the checked state changes (for 2-way binding / v-model).
 * @fires bdsChange - Emitted when the user toggles the checkbox. Payload: `{ checked: boolean, value: string }`.
 */
@Component({
  tag: 'bds-checkbox',
  styleUrl: 'bds-checkbox.scss',
  formAssociated: true,
})
export class BdsCheckbox extends Mixin(formAssociatedMixin) implements ICheckbox, IFormControl<boolean> {
  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLBdsCheckboxElement;

  @AttachInternals() internals!: ElementInternals;

  // ---------------------------------------------------------------------------
  // Props (from formAssociatedMixin — redeclared here because Stencil's spec-
  // test compiler only sees @Prop decorators that are statically on the class)
  // ---------------------------------------------------------------------------

  /** Name of the form control, submitted as a key in the form data. */
  @Prop({ reflect: true }) readonly name!: string;

  /** Disables the control. */
  @Prop({ reflect: true, mutable: true }) disabled: boolean = false;

  /** Marks the control as required for form submission. */
  @Prop({ reflect: true }) readonly required: boolean = false;

  // ---------------------------------------------------------------------------
  // Props
  // ---------------------------------------------------------------------------

  /** Whether the checkbox is selected. */
  @Prop({ mutable: true, reflect: true }) checked: boolean = false;

  /** Whether the checkbox shows an indeterminate ("mixed") visual state. */
  @Prop({ mutable: true, reflect: true }) indeterminate: boolean = false;

  /** Shows error styling on the checkbox. */
  @Prop({ reflect: true }) readonly error: boolean = false;

  /** Value submitted with the form data when checked. */
  @Prop() readonly value: string = 'on';

  /** Label displayed next to the checkbox. If not provided, the default slot is used. */
  @Prop() readonly label: string = '';

  /** Unique identifier for the checkbox element. */
  @Prop() readonly idComponent: string = '';

  // ---------------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------------

  /** Emitted when the checked state changes (for 2-way binding / v-model). */
  @Event() valueChange!: EventEmitter<boolean>;

  /** Emitted when the user toggles the checkbox. */
  @Event() bdsChange!: EventEmitter<{ checked: boolean; value: string }>;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  componentWillLoad() {
    this.inheritedAttributes = {
      ...inheritAriaAttributes(this.el),
      ...getBaseAttributes(this),
    };
    this.syncFormValue();
  }

  // ---------------------------------------------------------------------------
  // Watchers
  // ---------------------------------------------------------------------------

  @Watch('checked')
  onCheckedChange() {
    this.syncFormValue();
  }

  // ---------------------------------------------------------------------------
  // Form-associated callbacks (IFormControl)
  // ---------------------------------------------------------------------------

  formAssociatedCallback(): void {
    this.syncFormValue();
  }

  formResetCallback(): void {
    this.checked = false;
    this.indeterminate = false;
    setFormValue(this.internals, null);
  }

  formStateRestoreCallback(state: unknown, _mode: string): void {
    this.checked = state === this.value;
    this.syncFormValue();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private syncFormValue() {
    setFormValue(this.internals, this.checked ? this.value : null);
  }

  private toggle() {
    if (this.disabled) return;

    this.indeterminate = false;
    this.checked = !this.checked;

    this.valueChange.emit(this.checked);
    this.bdsChange.emit({ checked: this.checked, value: this.value });
  }

  private handleClick = () => {
    this.toggle();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      this.toggle();
    }
  };

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  private getAriaChecked(): string {
    if (this.indeterminate) return 'mixed';
    return this.checked ? 'true' : 'false';
  }

  private renderCheckIcon() {
    if (this.indeterminate) {
      return (
        <svg class="bds-checkbox__icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 8h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      );
    }

    if (this.checked) {
      return (
        <svg class="bds-checkbox__icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render() {
    const classes = {
      'bds-checkbox': true,
      'bds-checkbox--checked': this.checked,
      'bds-checkbox--indeterminate': this.indeterminate,
      'bds-checkbox--error': this.error,
      'bds-checkbox--disabled': this.disabled,
    };

    return (
      <Host
        class={classes}
        {...this.inheritedAttributes}
        role="checkbox"
        aria-checked={this.getAriaChecked()}
        aria-disabled={this.disabled ? 'true' : null}
        tabindex={this.disabled ? -1 : 0}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        <span class="bds-checkbox__box">{this.renderCheckIcon()}</span>
        <span class="bds-checkbox__label">{this.label ? this.label : <slot />}</span>
      </Host>
    );
  }
}
