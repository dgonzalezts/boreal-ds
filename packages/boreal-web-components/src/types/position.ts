/**
 * Define the possible positions of the floating element.
 * This could be used to position the floating element relative to the trigger element.
 * Are blocked posittions like 'top-start', 'top-end', 'bottom-start', and 'bottom-end'.
 */
export const POSITION = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type Position = (typeof POSITION)[keyof typeof POSITION];
