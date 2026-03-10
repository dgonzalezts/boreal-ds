/**
 * Dispatches a custom event from a host element, with an option to intercept and
 * stop an existing event.
 * This utility simplifies event bubbling and prevents the original event's
 * default behavior if provided.
 * Additionally can send data through detail param.
 *
 * @typeParam T - The type of the original event being intercepted.
 * @param {string} eventName - The name of the custom event to be dispatched.
 * @param {HTMLElement} hostElement - The DOM element that will trigger the event.
 * @param {Record<string, unknown>} [detail] - Optional data to pass inside the `event.detail` object.
 * @param {T} [event] - An optional existing event to be stopped (calls `stopPropagation` and `preventDefault`).
 * @param {CustomEventInit} [options] - Additional CustomEvent options to override defaults (bubbles, cancelable, etc.).
 *
 * @example
 * ```typescript
 * // Basic usage: Dispatching an event with data
 * emitEvent('my-change', this.element, { id: 123 });
 * ```
 * * @example
 * ```typescript
 * // Intercepting a click and emitting a custom "save" event instead
 * // This stops the original click from bubbling further.
 * const handleClick = (e: MouseEvent) => {
 * emitEvent('app-save', btnElement, { timestamp: Date.now() }, e);
 * };
 * ```
 */
export function emitEvent<T extends Event = Event>(
  eventName: string,
  hostElement: HTMLElement,
  detail?: Record<string, unknown>,
  event: T | undefined = undefined,
  options?: CustomEventInit,
) {
  if (event !== undefined) {
    event.stopPropagation();
    event.preventDefault();
  }

  const customEvent = new CustomEvent(eventName, {
    detail: { ...detail },
    bubbles: true,
    cancelable: false,
    composed: true,
    ...options,
  });

  hostElement.dispatchEvent(customEvent);
}
