/**
 * Type for icon font-class names used across components.
 */
type Icons = {
  [key: string]: string;
};

/**
 * Centralized list of icon font-class names used by design-system components.
 * Add new entries to the `ICONS` object to keep class names consistent
 * and prevent typos across the design system.
 */
export const ICONS: Icons = {
  Close: 'bds-icon-close',
  ChevronDown: 'bds-icon-chevron-down',
  InfoCircle: 'bds-icon-info-circle',
  InfoCircleFill: 'bds-icon-info-circle-fill',
  CheckCircleFill: 'bds-icon-check-circle-fill',
  WarningTriangleFill: 'bds-icon-info-major-triangle-up-fill',
  AlertCircleFill: 'bds-icon-alert-circle-fill',
  SightOn: 'bds-icon-sight-on',
  SightOff: 'bds-icon-sight-off',
};
