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

/**
 * Removes <style> tags and their content from the provided code string.
 * @param code - The code string to transform.
 * @returns The transformed code string.
 */
export function removeStyleTags(code: string): string {
  return code.replace(/<style>[\s\S]*?<\/style>\s*/, '');
}

/**
 * Formats code for Storybook source display using Prettier.
 * Removes style blocks and cleans empty attribute values.
 *
 * @param source - The HTML source code to format
 * @returns The formatted HTML string
 *
 * @example
 * ```ts
 * const formatted = await formatHtmlSource('<button disabled="">Click</button>');
 * // returns '<button disabled>Click</button>'
 * ```
 */
export const formatHtmlSource = async (source: string): Promise<string> => {
  const code = removeStyleTags(source);
  const prettier = await import('prettier/standalone');
  const prettierPluginHtml = await import('prettier/plugins/html');

  const formatted = await prettier.format(code, {
    parser: 'html',
    plugins: [prettierPluginHtml],
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    htmlWhitespaceSensitivity: 'ignore',
    bracketSameLine: false,
    singleAttributePerLine: true,
  });

  return formatted.replace(/(\s[?.@]?\w+)=""/g, '$1');
};
