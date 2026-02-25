import { buildVariableName, capitalize } from '../../../../utils';
import type { ColorSectionType } from '../types/Color.type';
import { useTokens } from '@/hooks/useTokens';

export const ColorSection = ({ name, description, values, prefix = '' }: ColorSectionType) => {
  const { arrayValues, isLoaded } = useTokens(values, prefix);

  const buildVariable = buildVariableName.bind(null, prefix);

  return (
    <div className="color-item">
      <h5 className="color-item__title">{capitalize(name)}</h5>
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
                    style={{ backgroundColor: `var(${buildVariable(colorName)})` }}
                  ></div>
                </div>
              ) : (
                <div
                  className="color-item__swatch"
                  style={{ backgroundColor: `var(${buildVariable(colorName)})` }}
                ></div>
              )}
              <p className="color-item__variable-name">{buildVariable(colorName)}</p>
              <p className="color-item__color-value">
                {isLoaded ? arrayValues[colorName] : 'Loading...'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
