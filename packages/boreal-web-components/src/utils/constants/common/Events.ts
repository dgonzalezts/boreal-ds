/**
 * Type to add events to the component.
 */
type Events = {
  [key: string]: string;
};

/**
 * Centralize list of events to add listeners to the component.
 * Add Native or Custom events to the `EVENTS` object.
 * This prevent typing errors when using the event name in the component, creating listeners, etc.
 */
export const EVENTS: Events = {
  Focus: 'focus',
  Blur: 'blur',
  Click: 'click',
  BdsClick: 'bdsClick',
};
