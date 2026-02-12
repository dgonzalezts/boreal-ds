export const STATES = {
  DEFAULT: 'default',
  ERROR: 'error',
  DISABLED: 'disabled',
  HOVER: 'hover',
  ACTIVE: 'active',
  FOCUS: 'focus',
  VISITED: 'visited',
} as const;

export const STATUS_STATES = {
  NEUTRAL: 'neutral',
  PENDING: 'pending',
  INPROGRESS: 'inprogress',
  COMPLETE: 'complete',
  CANCEL: 'cancel',
} as const;
