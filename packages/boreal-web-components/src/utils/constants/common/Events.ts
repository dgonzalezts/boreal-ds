/**
 * Type to add events to the component.
 */
type Events = {
  [key: string]: string;
};

/**
 * Centralize list of events to add listeners to the component.
 * Add Native and Custom events to the `EVENTS` object.
 */
export const EVENTS: Events = {
  Focus: 'focus',
  Blur: 'blur',
  Click: 'click',
};
