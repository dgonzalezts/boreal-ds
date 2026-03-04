import { MiddlewareData, Placement, Strategy } from '@floating-ui/dom';

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
