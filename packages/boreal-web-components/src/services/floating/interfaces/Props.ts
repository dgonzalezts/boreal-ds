import { ArrowPlacement } from '../types/Arrow';
import { FloatingHooks, FloatingMixinOptions } from './Floating';

/**
 * Interface to define the possible options as props for the floating mixin.
 * Extends the `FloatingHooks` interface to able the developer to add custom logic.
 */
export interface FloatingProp extends FloatingHooks, FloatingMixinOptions {}

interface Arrow {
  hideArrow?: boolean;
}
/**
 * Interface to define the possible options as props for the floating mixin.
 * Extends the `FloatingProp` interface to able the developer to add custom logic.
 * This interface is used for the anchored mixin.
 */

export interface FloatingAnchoredProp extends FloatingProp, Arrow {
  placement?: ArrowPlacement;
}

export interface FloatingTooltipProp extends FloatingAnchoredProp {
  stayOnHover?: boolean;
}
export interface FloatingPopoverProp extends FloatingAnchoredProp {
  closeOnClick?: boolean;
  clickOutside?: boolean;
}
