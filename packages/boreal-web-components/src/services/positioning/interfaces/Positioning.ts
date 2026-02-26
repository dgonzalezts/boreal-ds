import { Placement } from '@floating-ui/dom';

type Strategy = 'absolute' | 'fixed';

export interface PositioningOptions {
  placement?: Placement;
  offset?: number;
  flip?: boolean;
  shift?: boolean;
  arrow?: HTMLElement | null;
  strategy?: Strategy;
}

export interface PositioningResult {
  x: number;
  y: number;
  placement: Placement;
  middlewareData: {
    arrow?: {
      x: number;
      y: number;
      centerOffset: number;
    };
  };
}
