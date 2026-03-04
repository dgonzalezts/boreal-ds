import { ArrowPlacement } from '../types/Arrow';
import { FloatingHooks, FloatingMixinOptions } from './Floating';

/**
 * Interface to define the possible options as props for the floating mixin.
 * Extends the `FloatingHooks` interface to able the developer to add custom logic.
 */
export interface FloatingProp extends FloatingHooks, FloatingMixinOptions {
  showOnClick?: boolean;
}

/**
 * Interface to define the possible options as props for the floating mixin.
 * Extends the `FloatingProp` interface to able the developer to add custom logic.
 * This interface is used for the anchored mixin.
 */
export interface FloatingAnchoredProp extends FloatingProp {
  stayOnHover?: boolean;
  hideArrow?: boolean;
  placement?: ArrowPlacement;
}

export interface FloatingPopoverProp extends FloatingAnchoredProp {
  hideOnClick: boolean;
}
