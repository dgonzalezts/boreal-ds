import { MiddlewareData, Placement, Strategy } from '@floating-ui/dom';

/**
 * Define the possible options to communicate with Floating UI library.
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
 * Define the result of the positioning engine. Have the position and the placemen and additional data to define it behavior.
 */
export interface PositioningResult {
  x: number;
  y: number;
  placement: Placement;
  middlewareData: MiddlewareData;
}
