import { Placement, Strategy } from '@floating-ui/dom';
import { PositioningResult } from './Positioning';
import { FloatingProp } from './Props';

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

/**
 * Define the possible options for comunication with the Floating UI library.
 * Could define how the floating element and arrow will be positioned.
 */
export interface FloatingMixinOptions {
  offset?: number;
  placement?: Placement;
  flip?: boolean;
  shift?: boolean;
  arrow?: HTMLElement;
  strategy?: Strategy;
}

/**
 * Implements the hooks and expose the options and hooks to the mixin.
 * The mixin could provide a getter to able the developer override values.
 */
export interface IFloatingMixin extends FloatingHooks {
  floatingOptions?: FloatingProp;

  get options(): FloatingMixinOptions;
  get hooks(): FloatingHooks;
}
