import hljs, { type HighlightOptions } from 'highlight.js';

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

/**
 * Builds a CSS variable name based on the provided prefix and color name.
 *
 * @param prefix - An optional prefix to include in the variable name.
 * @param colorName - The name of the color to include in the variable name.
 * @returns The constructed CSS variable name in the format '--boreal[-prefix]-colorName'.
 *
 * @example
 * ```ts
 * buildVariableName('primary', '500'); // returns '--boreal-primary-500'
 * buildVariableName(undefined, 'background'); // returns '--boreal-background'
 * ```
 */
export const buildVariableName = (prefix: string | undefined, variant: string) => {
  return `--boreal${prefix ? `-${prefix}` : ''}-${variant}`;
};

/**
 * Highlights code using highlight.js with the given language and options.
 *
 * @param code - The code to highlight.
 * @param lang - The language to use for highlighting.
 * @param opts - Optional highlight options to pass to highlight.js.
 * @returns The highlighted HTML string.
 * @example
 * ```ts
 * const highlighted = highlightCode('const x = 10;', 'javascript');
 * // returns a highlighted HTML string for the JavaScript code
 * ```
 */
export const highlightCode = (code: string, lang: string, opts?: HighlightOptions): string => {
  return hljs.highlight(code, { language: lang, ...opts }).value;
};
