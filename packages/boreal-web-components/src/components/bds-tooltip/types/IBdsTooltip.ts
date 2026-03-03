import { IFloatingMixin } from '@/mixins/floating.mixin';

/**
 * Interface for BdsTooltip props and states.
 */
export interface ITooltip extends IFloatingMixin {
  /** If true, hides the tooltip arrow. */
  hideArrow: boolean;
  /** Whether the tooltip is currently visible. */
  isVisible: boolean;
}
