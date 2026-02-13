export const SIZES = {
  XS: 'xs',
  S: 's',
  M: 'm',
  L: 'l',
  XL: 'xl',
} as const;

export type Size = (typeof SIZES)[keyof typeof SIZES];
