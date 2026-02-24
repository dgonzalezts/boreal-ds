import { Card } from '@/components';
import hljs from 'highlight.js';

export const HelperStyle = ({ name, description }: any) => {
  const content = (code: boolean = false) => {
    if (code) {
      return hljs.highlightAuto(
        `<span class=${name}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>`
      ).value;
    }
    return <span className={name}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>;
  };

  return (
    <div className="helper-style-container">
      <h4>{name}</h4>
      {description && <p>{description}</p>}
      <Card variant="elevated" className="typography-preview__card">
        {content()}
      </Card>
      <code-block language="html" code={`${content(true)}`} />
    </div>
  );
};
