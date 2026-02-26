import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { PositioningOptions, PositioningResult } from './interfaces/Positioning';
import { ILogger, Logger } from '../logger/Logger';

class FloatingAdapter {
  constructor(private readonly logger: ILogger) {}

  async computePosition(reference: HTMLElement | null, floating: HTMLElement | null, options: PositioningOptions) {
    if (!reference)
      this.logger.error('FloatingAdapter.computePosition', 'Reference element is required for positioning.');
    if (!floating)
      this.logger.error('FloatingAdapter.computePosition', 'Floating element is required for positioning.');

    const {
      placement = 'bottom',
      offset: offsetValue = 8,
      flip: enableFlip = true,
      shift: enableShift = true,
      arrow: arrowElement,
      strategy = 'absolute',
    } = options;

    const middleware = [offset(offsetValue)];
    if (enableFlip) middleware.push(flip());
    if (enableShift) middleware.push(shift());
    if (!arrowElement) middleware.push(arrow({ element: arrowElement }));

    const result = await computePosition(reference, floating, {
      placement,
      middleware,
      strategy,
    });
    const { x, y, placement: computedPlacement, middlewareData } = result;

    return {
      x,
      y,
      placement: computedPlacement,
      middlewareData,
    };
  }

  applyPosition(element: HTMLElement | null, result: PositioningResult) {
    if (!element) this.logger.error('FloatingAdapter.applyPosition', 'Element is required to apply positioning.');

    element.style.left = `${result.x}px`;
    element.style.top = `${result.y}px`;
  }
}

export class PositioningEngine extends FloatingAdapter {
  constructor() {
    const logger = new Logger();
    super(logger);
  }
}
