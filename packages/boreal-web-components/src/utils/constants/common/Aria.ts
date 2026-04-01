/**
 * Type for aria-label values used across components.
 */
type AriaLabels = {
  [key: string]: string;
};

/**
 * Centralized list of `aria-label` values used by interactive elements.
 * Add new entries to the `ARIA_LABELS` object to keep labels consistent
 * and prevent typos across the design system.
 */
export const ARIA_LABELS: AriaLabels = {
  Clear: 'Clear',
  ShowPassword: 'Show password',
  HidePassword: 'Hide password',
};
