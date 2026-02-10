import React from 'react';
import { capitalize, getVariableValue } from '../../../utils';

export const ColorSection = ({ name, description, values, prefix = '' }: any) => {
  const [colorValues, setColorValues] = React.useState<any>({});
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const valueObj: any = {};
      values.forEach((colorName: string) => {
        valueObj[colorName] = getVariableValue(colorName, prefix);
      });
      setColorValues(valueObj);
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [values, prefix]);

  const buildVariableName = (colorName: string) => {
    return `--boreal${prefix ? `-${prefix}` : ''}-${colorName}`;
  };

  return (
    <div className="color-item">
      <div className="color-item__title">{capitalize(name)}</div>
      {description && <div className="color-item__description">{description}</div>}
      <div className="color-item__container">
        {values.map((colorName: string) => {
          const isAlphaColor = typeof prefix === 'string' && prefix.includes('alpha');

          return (
            <div key={colorName} className="color-item__swatch-wrapper">
              {isAlphaColor ? (
                <div className="color-item__swatch checkerboard">
                  <div
                    className="color-item__swatch-overlay"
                    style={{ backgroundColor: `var(${buildVariableName(colorName)})` }}
                  ></div>
                </div>
              ) : (
                <div
                  className="color-item__swatch"
                  style={{ backgroundColor: `var(${buildVariableName(colorName)})` }}
                ></div>
              )}
              <p className="color-item__variable-name">{buildVariableName(colorName)}</p>
              <p className="color-item__color-value">
                {isLoaded ? colorValues[colorName] : 'Loading...'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
