/**
 * Type to add keyboard keys to the component.
 */
type Key = {
  [key: string]: {
    key: string;
    code: number;
  };
};

/**
 * Default keyboard keys.
 * Add more keys to the `KEYBOARD` object to add more keyboard shortcuts.
 * Can use this page to find the keycodes: https://keycode.info/
 */
export const KEYBOARD: Key = {
  Enter: {
    key: 'Enter',
    code: 13,
  },
  Escape: {
    key: 'Escape',
    code: 32,
  },
};
