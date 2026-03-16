export const COMPONENT_STATES = {
  DEFAULT: 'default',
  ERROR: 'error',
  DISABLED: 'disabled',
  HOVER: 'hover',
  ACTIVE: 'active',
  FOCUS: 'focus',
  VISITED: 'visited',
} as const;

export type ComponentState = (typeof COMPONENT_STATES)[keyof typeof COMPONENT_STATES];

export const PROCESS_STATUS = {
  NEUTRAL: 'neutral',
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETE: 'complete',
  CANCEL: 'cancel',
} as const;

export type Status = (typeof PROCESS_STATUS)[keyof typeof PROCESS_STATUS];

export const STATUS_VARIANT = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
} as const;

export type StatusVariant = (typeof STATUS_VARIANT)[keyof typeof STATUS_VARIANT];
