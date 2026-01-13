/**
 * Converts a string to kebab-case format by replacing all uppercase letters
 * with a hyphen followed by the lowercase version of that letter.
 *
 * @param str - The string to convert to kebab-case
 * @returns The converted string in kebab-case format
 *
 * @example
 * ```ts
 * toKebabCase('myVariableName') // returns 'my-variable-name'
 * toKebabCase('HTMLElement') // returns '-h-t-m-l-element'
 * ```
 */
export const toKebabCase = (str: string): string =>
  str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
