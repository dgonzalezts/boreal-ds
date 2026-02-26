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
