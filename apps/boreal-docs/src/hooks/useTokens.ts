import { getVariableValue } from '@/utils';
import React from 'react';

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
