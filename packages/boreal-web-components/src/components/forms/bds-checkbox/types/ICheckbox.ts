import type { EventEmitter } from '@stencil/core/internal';

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
  bdsChange: EventEmitter<{ checked: boolean; value: string }>;
}
