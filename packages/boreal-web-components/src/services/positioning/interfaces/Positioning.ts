import { MiddlewareData, Placement, Strategy } from '@floating-ui/dom';

/**
 * Add methods to the `onBeforeShow`, `onAfterShow`, `onBeforeHide`, and `onAfterHide` to add custom logic.
 * Pass the element to the method to get the reference to the floating element.
 */
export interface FloatingHooks {
  onAfterShow?: (el?: HTMLElement) => void;
  onBeforeHide?: (el?: HTMLElement) => void;
  onBeforeShow?: (el?: HTMLElement) => void;
  onAfterHide?: (el?: HTMLElement) => void;
  onPositionUpdate?: (result: PositioningResult) => void;
}

/**
 * Interface to define the possible options as props for the floating mixin.
 * Extends the `FloatingHooks` interface to able the developer to add custom logic.
 */
export interface FloatingProp extends FloatingHooks {
  disabled?: boolean;
  showOnClick?: boolean;
  hideOnClick?: boolean;
  placement?: Placement;
  offset?: number;
}
/**
 * Interface to define the possible options as props for the positioning engine.
 */
export interface PositioningOptions {
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  arrow?: HTMLElement | null;
  strategy?: Strategy;
}

/**
 * Interface to define the result of the positioning engine. Have the position and the placement.
 */
export interface PositioningResult {
  x: number;
  y: number;
  placement: Placement;
  middlewareData: MiddlewareData;
}
