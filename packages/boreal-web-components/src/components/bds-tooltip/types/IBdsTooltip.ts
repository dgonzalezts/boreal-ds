import { Placement } from '@floating-ui/dom';

/**
 * Interface for BdsTooltip props and states.
 */
export interface ITooltip {
  /** Tooltip position relative to the trigger element. */
  position: Placement;
  /** Width of the tooltip in pixels. */
  width: number;
  /** If true, allows multiline content in the tooltip. */
  multiline: boolean;
  /** If true, hides the tooltip arrow. */
  hideArrow: boolean;
  /** Distance in pixels between the tooltip and the trigger element. */
  distance: number;
  /** If true, disables the tooltip. */
  disabled: boolean;
  /** If true, tooltip is shown/hidden on click instead of hover/focus. */
  showOnClick: boolean;

  /** Whether the tooltip is currently visible. */
  isVisible: boolean;
}
