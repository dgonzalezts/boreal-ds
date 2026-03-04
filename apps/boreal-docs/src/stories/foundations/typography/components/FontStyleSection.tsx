import { useTokens } from '@/hooks/useTokens';
import { buildVariableName, capitalize } from '@/utils';

export const FontStyleSection = ({ name, values, prefix }: any) => {
  const { arrayValues, isLoaded } = useTokens(values, prefix);

  const buildVariable = buildVariableName.bind(null, prefix);
  const parsePrefix = (key: string): string => {
    const token = key.replace(/^typography-/, '');
    const [first, ...rest] = token.split('-');
    const camelCased = rest.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    return first + camelCased;
  };
  const toLowerCase = (str: string) => {
    return str.toLowerCase();
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
                  {isLoaded ? toLowerCase(arrayValues[character]) : 'Loading...'}
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
