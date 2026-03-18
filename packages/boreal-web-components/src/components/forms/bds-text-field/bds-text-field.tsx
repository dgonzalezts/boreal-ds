import {
  AttachInternals,
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Method,
  Mixin,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { formAssociatedMixin, type IFormControl } from '@/mixins';
import type { IFormValidator, StyleModifiers } from '@/types';
import { runValidators, setFormValue, validatePropValue } from '@/utils';
import { TEXT_FIELD_TYPES, TEXT_FIELD_VARIANTS, TEXT_FIELD_VALIDATION_TIMING } from './types/enum';
import type { ITextField } from './types/ITextField';
import type { TextFieldType, TextFieldVariant, TextFieldValidationTiming } from './types/types';

/**
 * Text field component for user input with validation and form integration.
 *
 * @summary Single-line text input with label, validation, password toggle, and clear action.
 *
 * @slot prefix - Content rendered before the input (e.g. icon or currency symbol).
 * @slot suffix - Content rendered after the input (e.g. icon or unit label).
 * @slot label - Rich label content. Overrides the `label` prop when provided.
 *
 * @attr {string} name - The name submitted with the form.
 * @attr {string} value - The current value of the input.
 * @attr {boolean} disabled - Disables the input.
 * @attr {boolean} required - Marks the input as required.
 * @attr {boolean} error - Applies the error visual state.
 * @attr {"text"|"password"} type - Input type.
 * @attr {"outline"|"plain"} variant - Visual style of the container.
 *
 * @property {string} label - Label text rendered above the input.
 * @property {string} placeholder - Native placeholder forwarded to the inner input.
 * @property {string} helperText - Assistive text shown below the input when there is no error.
 * @property {string} errorMessage - Error message shown below the input when `error` is `true`.
 * @property {boolean} clearable - Shows a clear button when the input has a value.
 * @property {boolean} disclosure - Shows a disclosure icon in the right-action area.
 * @property {"blur"|"input"|"submit"|"change"} validationTiming - When built-in validation runs.
 * @property {string} idComponent - Unique identifier for the component element.
 * @property {string} customWidth - Sets a custom width via the `--bds-text-field-width` CSS custom property.
 *
 * @fires valueChange - Emitted on every value change; used for framework 2-way binding.
 * @fires bdsInput - Emitted on every keystroke with `{ value, event }`.
 * @fires bdsChange - Emitted when focus leaves after the value changed, with `{ value, event }`.
 * @fires bdsFocus - Emitted when the input gains focus, with `{ event }`.
 * @fires bdsBlur - Emitted when the input loses focus, with `{ event }`.
 * @fires bdsClear - Emitted when the user activates the clear button.
 * @fires bdsDisclosure - Emitted when the user clicks the disclosure icon.
 * @fires bdsValidationChange - Emitted after each validation run with `{ valid, validity, value, touched, dirty }`.
 *
 * @cssprop --bds-text-field-width - Sets a custom width for the component.
 */
@Component({
  tag: 'bds-text-field',
  styleUrl: 'bds-text-field.scss',
  formAssociated: true,
  scoped: true,
})
export class BdsTextField extends Mixin(formAssociatedMixin) implements ITextField, IFormControl<string> {
  @Element() el!: HTMLBdsTextFieldElement;

  @AttachInternals() internals!: ElementInternals;

  /** The name submitted with the form. */
  @Prop({ reflect: true }) readonly name: string = '';

  /** Disables the input. Also toggled by `formDisabledCallback` via the mixin. */
  @Prop({ reflect: true }) readonly disabled: boolean = false;

  /** Marks the input as required for form validation. */
  @Prop({ reflect: true }) readonly required: boolean = false;

  /** Mirrors `disabled` and the FACE `formDisabledCallback` result. Drives all disabled UI. */
  @State() private isDisabled: boolean = false;

  /** The current value of the input. */
  @Prop({ mutable: true, reflect: true }) value: string = '';

  /** When `true`, applies the error visual state. */
  @Prop({ reflect: true }) readonly error: boolean = false;

  /** Message shown below the input when `error` is `true`. Replaces `helperText`. */
  @Prop() readonly errorMessage: string = '';

  /** Additional validators merged with the built-in ones. */
  @Prop() readonly customValidators: IFormValidator[] = [];

  /** Controls when built-in validation runs: `'blur'` | `'input'` | `'submit'` | `'change'`. */
  @Prop() readonly validationTiming: TextFieldValidationTiming = TEXT_FIELD_VALIDATION_TIMING.BLUR;

  /** The input type. Use `'password'` to enable the visibility toggle. */
  @Prop({ reflect: true }) readonly type: TextFieldType = TEXT_FIELD_TYPES.TEXT;

  /** Visual style of the input container. `'outline'` shows a border; `'plain'` hides it at rest. */
  @Prop({ reflect: true }) readonly variant: TextFieldVariant = TEXT_FIELD_VARIANTS.OUTLINE;

  /** Native `placeholder` attribute forwarded to the inner `<input>`. */
  @Prop() readonly placeholder: string = '';

  /** Makes the input read-only. The value is still submitted with the form. */
  @Prop() readonly readOnly: boolean = false;

  /** Native `autocomplete` attribute forwarded to the inner `<input>`. */
  @Prop() readonly autocomplete: string = 'off';

  /** Native `pattern` attribute forwarded to the inner `<input>`. */
  @Prop() readonly pattern: string = '';

  /** Minimum character count. `0` means no minimum. */
  @Prop() readonly minLength: number = 0;

  /** Maximum character count. `0` means no maximum. */
  @Prop() readonly maxLength: number = 0;

  /** Label text rendered above the input. */
  @Prop() readonly label: string = '';

  /** Sublabel rendered inside the input container, before the text area. */
  @Prop() readonly sublabel: string = '';

  /** Helper text shown below the input when there is no error. */
  @Prop() readonly helperText: string = '';

  /** Tooltip content attached to the label. Rendered via `bds-typography` `tooltipText` prop. */
  @Prop() readonly info: string = '';

  /** Shows a clear button when the input has a value. */
  @Prop() readonly clearable: boolean = false;

  /** Clear button is only visible on hover. Implies `clearable`. */
  @Prop() readonly clearOnHover: boolean = false;

  /** Shows a disclosure icon in the right-action area and emits `bdsDisclosure` on click. */
  @Prop() readonly disclosure: boolean = false;

  /** Maximum character count shown in the footer counter (e.g. `120` → `"45/120"`). Requires `counter`. */
  @Prop() readonly charCount: number = 0;

  /** Enables the character counter in the footer. Requires `charCount` to be set. */
  @Prop() readonly counter: boolean = false;

  /** Sets a custom width via the `--bds-text-field-width` CSS custom property. */
  @Prop() readonly customWidth: string = '';

  /** Unique element ID. Auto-generated in `componentWillLoad` if not provided. */
  @Prop() readonly idComponent: string = '';

  /** Tracks focus state to drive the `bds-text-field--focused` CSS modifier. */
  @State() private focused: boolean = false;

  /** Emitted whenever the value changes. Used by framework wrappers for 2-way binding. */
  @Event() valueChange!: EventEmitter<string>;

  /** Emitted on every keystroke with the current value and the originating event. */
  @Event() bdsInput!: EventEmitter<{ value: string; event: InputEvent }>;

  /** Emitted when the input loses focus after the value has changed. */
  @Event() bdsChange!: EventEmitter<{ value: string; event: Event }>;

  /** Emitted when the input gains focus. */
  @Event() bdsFocus!: EventEmitter<{ event: FocusEvent }>;

  /** Emitted when the input loses focus. */
  @Event() bdsBlur!: EventEmitter<{ event: FocusEvent }>;

  /** Emitted when the user activates the clear button. */
  @Event() bdsClear!: EventEmitter<void>;

  /** Emitted when the user clicks the disclosure icon. */
  @Event() bdsDisclosure!: EventEmitter<void>;

  /** Emitted after each validation run with the full validity snapshot. */
  @Event() bdsValidationChange!: EventEmitter<{
    valid: boolean;
    validity: ValidityState;
    value: string;
    touched: boolean;
    dirty: boolean;
  }>;

  @Watch('disabled')
  onDisabledChange(next: boolean): void {
    this.isDisabled = next;
  }

  @Watch('type')
  @Watch('variant')
  @Watch('validationTiming')
  checkPropValues(): void {
    validatePropValue(
      Object.values(TEXT_FIELD_TYPES) as TextFieldType[],
      TEXT_FIELD_TYPES.TEXT,
      this.el as HTMLElement,
      'type',
    );
    validatePropValue(
      Object.values(TEXT_FIELD_VARIANTS) as TextFieldVariant[],
      TEXT_FIELD_VARIANTS.OUTLINE,
      this.el as HTMLElement,
      'variant',
    );
    validatePropValue(
      Object.values(TEXT_FIELD_VALIDATION_TIMING),
      TEXT_FIELD_VALIDATION_TIMING.BLUR,
      this.el as HTMLElement,
      'validationTiming',
    );
  }

  componentWillLoad(): void {
    this.checkPropValues();
  }

  @Watch('customValidators')
  onCustomValidatorsChange(): void {
    this.updateValidity();
  }

  @Watch('value')
  onValueChange(next: string): void {
    setFormValue(this.internals, next);
    this.updateValidity();
    this.valueChange.emit(next);
  }

  formAssociatedCallback(): void {
    setFormValue(this.internals, this.value);
    this.updateValidity();
  }

  formResetCallback(): void {
    this.value = '';
    setFormValue(this.internals, null);
    this.updateValidity();
  }

  formStateRestoreCallback(state: unknown, _mode: string): void {
    this.value = typeof state === 'string' ? state : '';
    setFormValue(this.internals, this.value);
    this.updateValidity();
  }

  private get validators(): IFormValidator[] {
    return [
      {
        key: 'valueMissing',
        isValid: () => !this.required || this.value !== '',
        message: 'This field is required. Please fill it out.',
      },
    ];
  }

  private updateValidity(): void {
    runValidators(this.internals, this.validators, this.el as HTMLElement);
  }

  private getClassMap(): StyleModifiers {
    return {
      'bds-text-field': true,
      'bds-text-field--error': this.error,
      'bds-text-field--disabled': this.isDisabled,
      'bds-text-field--focused': this.focused,
    };
  }

  private getHostStyle(): Record<string, string> | undefined {
    return this.customWidth !== '' ? { '--bds-text-field-width': this.customWidth } : undefined;
  }

  /**
   * Returns `true` if the element's value passes all constraints; `false` otherwise.
   * Also fires an `invalid` event if constraints are violated.
   */
  @Method()
  async checkValidity(): Promise<boolean> {
    return this.internals.checkValidity();
  }

  /**
   * Returns `true` if the element's value passes all constraints; `false` otherwise.
   * Shows the browser's native validation UI when constraints are violated.
   */
  @Method()
  async reportValidity(): Promise<boolean> {
    return this.internals.reportValidity();
  }

  render() {
    return (
      <Host
        class={this.getClassMap()}
        style={this.getHostStyle()}
        tabIndex={this.isDisabled ? -1 : 0}
        onFocus={() => (this.el as HTMLElement).querySelector<HTMLInputElement>('input')?.focus()}
      >
        <input
          class="bds-text-field__control"
          value={this.value}
          disabled={this.isDisabled}
          onInput={(e: Event) => {
            this.value = (e.target as HTMLInputElement).value;
          }}
        />
      </Host>
    );
  }
}
