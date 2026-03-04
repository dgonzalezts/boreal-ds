import { IFloatingMixin } from '@/mixins/floating.mixin';

/**
 * Interface for BdsTooltip props and states.
 */
export interface ITooltip extends IFloatingMixin {
  disabled?: boolean;
  multiline?: boolean;
}
