import type { EventEmitter } from '@stencil/core/internal';

/**
 * Payload emitted by the `bdsChange` event when the user toggles the checkbox.
 *
 * Exported so consumers can type their event handlers:
 * ```typescript
 * import type { CheckboxChangeDetail } from '@telesign/boreal-web-components';
 *
 * checkbox.addEventListener('bdsChange', (e: CustomEvent<CheckboxChangeDetail>) => {
 *   console.log(e.detail.checked, e.detail.value);
 * });
 * ```
 */
export interface CheckboxChangeDetail {
  /** Whether the checkbox is now checked. */
  checked: boolean;
  /** The value associated with the checkbox. */
  value: string;
}

export interface ICheckbox {
  /** Current checked state. */
  checked: boolean;

  /** Indeterminate visual state (neither fully checked nor unchecked). */
  indeterminate: boolean;

  /** Shows error styling. */
  error: boolean;

  /** Value submitted with the form when checked. */
  value: string;

  /** Label text. If not provided, use the default slot. */
  label: string;

  /** Emitted on every checked change. */
  valueChange: EventEmitter<boolean>;

  /** Emitted when the user toggles the checkbox. */
  bdsChange: EventEmitter<CheckboxChangeDetail>;
}
