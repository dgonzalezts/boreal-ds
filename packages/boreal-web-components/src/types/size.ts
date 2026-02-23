export const SIZES = {
  XS: 'xs',
  S: 'sm',
  M: 'md',
  L: 'lg',
  XL: 'xl',
} as const;

export type Size = (typeof SIZES)[keyof typeof SIZES];
