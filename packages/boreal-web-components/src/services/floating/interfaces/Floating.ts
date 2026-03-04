import { Placement, Strategy } from '@floating-ui/dom';
import { PositioningResult } from './Positioning';

/**
 * Add methods to the `onBeforeShow`, `onAfterShow`, `onBeforeHide`, and `onAfterHide` to add custom logic.
 * Pass the element to the method to get the reference to the floating element.
 */
export interface FloatingHooks {
  onAfterShow?: (el?: HTMLElement) => void;
  onBeforeHide?: (el?: HTMLElement) => boolean;
  onBeforeShow?: (el?: HTMLElement) => boolean;
  onAfterHide?: (el?: HTMLElement) => void;
  mounted?: (el?: HTMLElement) => void;
  unmounted?: (el?: HTMLElement) => void;
  onPositionUpdate?: (result: PositioningResult) => void;
}
export interface FloatingMixinOptions {
  offset?: number;
  placement?: Placement;
  flip?: boolean;
  shift?: boolean;
  arrow?: HTMLElement;
  strategy?: Strategy;
}
