import { getVariableValue } from '@/utils';
import React from 'react';

/**
 * A custom React hook that resolves CSS/design token variable values for a given list of token names.
 *
 * This hook defers variable resolution to after the initial render using a `setTimeout(fn, 0)`,
 * ensuring that the DOM is ready before attempting to read CSS custom property values.
 *
 * @param values - An array of token/variable names to resolve (e.g. ['primary', 'secondary']).
 * @param prefix - A prefix string used to namespace the variable lookup (e.g. 'color', 'spacing').
 * @returns An object containing:
 *   - `arrayValues`: A record mapping each token name to its resolved string value.
 *   - `isLoaded`: A boolean indicating whether token resolution has completed.
 *
 * @example
 * const { arrayValues, isLoaded } = useTokens(['accent-darkness', 'accent-dark', 'accent', 'accent-light', 'accent-lighter'], 'ui');
 * return {
 *  "isLoaded": true,
 *  "arrayValues": {
      "accent-dark": "#0025e3",
      "accent-light": "#e7e8ff",
      "accent-base": "#1f5bff",
      "accent-lighter": "#f9f9ff",
      "accent-darker": "#0000bc"
    }
  }
 */
export const useTokens = (values: string[], prefix: string) => {
  const [arrayValues, setArrayValues] = React.useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const valueObj: Record<string, string> = {};
      values.forEach((colorName: string) => {
        valueObj[colorName] = getVariableValue(colorName, prefix);
      });
      setArrayValues(valueObj);
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [values, prefix]);

  return {
    arrayValues,
    isLoaded,
  };
};
