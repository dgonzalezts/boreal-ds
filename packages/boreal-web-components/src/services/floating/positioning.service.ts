import { arrow, computePosition, ComputePositionReturn, flip, offset, shift } from '@floating-ui/dom';
import { PositioningOptions, PositioningResult } from './interfaces/Positioning';
import { ILogger, Logger } from '../logger/Logger';

/**
 * Adapter class to handle the positioning logic.
 * This class is responsible for computing the position of the floating element and connect with the Floating UI library.
 *
 * All logic refered to the Floating UI library is encapsulated in this class.
 *
 * If you need add some Floating UI logic you can add a new methods to this class.
 */
export interface IFloatingAdapter {
  computePosition(
    reference: HTMLElement | null,
    floating: HTMLElement | null,
    options: PositioningOptions,
  ): Promise<PositioningResult>;
  applyPosition(element: HTMLElement, result: PositioningResult): void;
}

class FloatingAdapter implements IFloatingAdapter {
  /**
   * Constructor of the adapter.
   * @param logger Inject the logger service to normalize the error messages.
   */
  constructor(private readonly logger: ILogger) {}

  /**
   *  Compute the position of the floating element making it responsive to the reference element.
   * @param {HTMLElement} reference The reference element to position the floating element. Could be a trigger element or a container.
   * @param {HTMLElement} floating The floating element to position, Will be positioned relative to the reference element.
   * @param {PositioningOptions} options Manage the logic of the positioning and some props that are own of the Floating UI library.
   * @returns {Promise<PositioningResult>} The positioning result with the position and the placement.
   */
  async computePosition(
    reference: HTMLElement | null,
    floating: HTMLElement | null,
    options: PositioningOptions,
  ): Promise<PositioningResult> {
    if (reference === undefined || reference === null)
      this.logger.error('FloatingAdapter.computePosition', 'Reference element is required for positioning.');
    if (floating === undefined || floating === null)
      this.logger.error('FloatingAdapter.computePosition', 'Floating element is required for positioning.');

    const {
      placement,
      offset: offsetValue,
      flip: enableFlip,
      shift: enableShift,
      arrow: arrowElement,
      strategy,
    } = options;

    const middleware = [offset(offsetValue)];
    if (enableFlip) middleware.push(flip());
    if (enableShift) middleware.push(shift());
    if (arrowElement !== undefined || arrowElement !== null) middleware.push(arrow({ element: arrowElement }));

    const result = await computePosition(reference, floating, {
      placement,
      middleware,
      strategy,
    })
      .catch((err: Error) => {
        this.logger.error('FloatingAdapter.computePosition', err.message);
      })
      .then((res: ComputePositionReturn) => {
        return res;
      });
    const { x, y, placement: computedPlacement, middlewareData } = result;
    return {
      x,
      y,
      placement: computedPlacement,
      middlewareData,
    };
  }

  /**
   * Apply the position of the floating element to the element.
   * @param {HTMLElement} element Is the floating element to apply the position.
   * @param {PositioningResult} result Is the positioning result with the position and the placement.
   */
  applyPosition(element: HTMLElement, result: PositioningResult) {
    if (element === undefined || element === null)
      this.logger.error('FloatingAdapter.applyPosition', 'Element is required to apply positioning.');

    element.style.left = `${result.x}px`;
    element.style.top = `${result.y}px`;
  }
}

/**
 * Export a simple class to use the adapter.
 * This class is responsible for handling the positioning logic exported to the mixin or some other floating logic.
 */
export class PositioningEngine extends FloatingAdapter {
  constructor() {
    const logger = new Logger();
    super(logger);
  }
}
