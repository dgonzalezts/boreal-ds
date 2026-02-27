export const CORE_COLORS = {
  DEFAULT: 'default',
  PRIMARY: 'primary',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type CoreColors = (typeof CORE_COLORS)[keyof typeof CORE_COLORS];
