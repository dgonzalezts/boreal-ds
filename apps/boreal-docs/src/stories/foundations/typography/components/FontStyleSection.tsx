import { useTokens } from '@/hooks/useTokens';
import { buildVariableName, capitalize } from '@/utils';

export const FontStyleSection = ({ name, values, prefix }: any) => {
  const { arrayValues, isLoaded } = useTokens(values, prefix);

  const buildVariable = buildVariableName.bind(null, prefix);
  const parsePrefix = (key: string): string => {
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
                  {isLoaded ? arrayValues[character] : 'Loading...'}
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
