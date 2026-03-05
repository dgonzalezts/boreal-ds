import { Card } from '@/components';
import { Source } from '@storybook/addon-docs/blocks';

export const HelperStyle = ({ name, description }: any) => {
  const JSXContent = (
    <span className={name}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
  );
  const stringContent = `<span class="${name}">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>`;

  return (
    <div className="helper-style-container">
      <h4>{name}</h4>
      {description && <p>{description}</p>}
      <Card variant="elevated" className="typography-preview__card">
        {JSXContent}
      </Card>
      <Source code={stringContent} language="html" dark />
    </div>
  );
};
