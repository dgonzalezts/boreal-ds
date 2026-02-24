import { buildVariableName, capitalize, getVariableValue } from '@/utils';
import React from 'react';

export const Character = ({ name, values, prefix }: any) => {
  const [characValues, setCharacValues] = React.useState<any>({});
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const valueObj: any = {};
      values.forEach((colorName: string) => {
        valueObj[colorName] = getVariableValue(colorName, prefix);
      });
      setCharacValues(valueObj);
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [values, prefix]);

  const buildVariable = buildVariableName.bind(null, prefix);
  const parsePrefix = (key: string): string => {
    console.log(key.match(/typography-/g)?.length ? key.replace(/typography-/g, '') : key);

    return key.match(/typography-/g)?.length ? key.replace(/typography-/g, '') : key;
  };

  return (
    <div className="character-item">
      <h4 className="character-item__title">{capitalize(name)}</h4>
      <div className="character-item__container">
        {values.map((character: string) => {
          return (
            <div key={character} className="character-item__element">
              <p
                className="character-item__expression"
                style={{ [parsePrefix(prefix)]: `var(${buildVariable(character)})` }}
                key={character}
              >
                Aa
              </p>
              <div className="character-item__variable">
                <p className="item__variable-value">
                  {isLoaded ? characValues[character] : 'Loading...'}
                </p>
                <p className="item__variable-name">{buildVariable(character)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
