/**
 * Disables a specific argument in a Storybook controls object
 * @param args - Arguments object
 * @param arg - Argument name
 * @returns Arguments object with the specified argument disabled
 */
export const disableControls = (args: any, arg: string) => {
  const { ...obj } = args;
  obj[arg] = {
    control: false,
    table: {
      disable: true,
    },
  };
  return obj;
};

/**
 * Gets the computed value of a CSS variable
 * @param name - CSS variable name (without any prefix)
 * @param prefix - Optional prefix ('theme' or 'colors')
 * @param element - Element to get the CSS variable from
 * @param globalPrefix - Global prefix (default: 'col')
 * @returns Computed CSS value (e.g., "#FF0000")
 */
export function getVariableValue(
  name: string,
  prefix?: string,
  element: Element = document.body,
  globalPrefix: string = 'boreal'
): string {
  try {
    const themedElement = document.querySelector('[data-theme]') || element;

    const prefixPart = prefix ? `-${prefix}` : '';

    const fullName = name.startsWith('--') ? name : `--${globalPrefix}${prefixPart}-${name}`;

    const value = getComputedStyle(themedElement).getPropertyValue(fullName).trim();

    return value || 'Not set';
  } catch (error) {
    console.error('Error getting variable value:', error);
    return 'Error';
  }
}

/**
 * Capitalizes the first letter of a string
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
