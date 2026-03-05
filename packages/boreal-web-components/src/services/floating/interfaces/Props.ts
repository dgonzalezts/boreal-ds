import { Position } from '@/types/position';
import { Arrow } from '../types/Arrow';
import { FloatingHooks, FloatingMixinOptions } from './Floating';

/**
 * Interface to define the possible options as props for the floating mixin.
 * Each floating component extends this interface to add custom logic.
 * Each of this attributes could be added in "floatingOptions" prop of each component.
 */
export interface FloatingProp extends FloatingHooks, FloatingMixinOptions {}

/**
 * Interface to define the possible options for the anchored components.
 * Extends the `FloatingProp` interface to able the developer to add custom logic.
 * Add placement prop to define the position of the anchored element.
 */
export interface FloatingAnchoredProp extends FloatingProp, Arrow {
  placement?: Position;
}

/**
 * Interface to define the possible options for the tooltip components.
 * Add stayOnHover prop to prevent the tooltip to hide when the mouse is not over the trigger element.
 */
export interface FloatingTooltipProp extends FloatingAnchoredProp {
  stayOnHover?: boolean;
}

/**
 * Interface to define the possible options for the popover components.
 * add closeOnClick prop to close the popover when the trigger element is clicked.
 * add clickOutside prop to close the popover when the user click outside the popover.
 */
export interface FloatingPopoverProp extends FloatingAnchoredProp {
  closeOnClick?: boolean;
  clickOutside?: boolean;
}
