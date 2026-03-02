export const ALIGNMENT = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
  INHERIT: 'inherit',
} as const;

export type Alignment = (typeof ALIGNMENT)[keyof typeof ALIGNMENT];
