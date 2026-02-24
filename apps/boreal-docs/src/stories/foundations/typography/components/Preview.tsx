import { buildVariableName } from '@/utils';
import type { PreviewType } from '../types/Typography.types';

export const Preview = ({ typography }: PreviewType) => {
  const buildVariable = buildVariableName.bind(null, 'typography-font-family');

  return (
    <>
      <div
        className="typography-preview"
        style={{ fontFamily: `var(${buildVariable(typography)})` }}
      >
        <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
        <p>abcdefghijklmnopqrstuvwxyz</p>
        <p>0123456789!@#$%^&*()</p>
      </div>
      <p className="item__variable-name">{buildVariable(typography)}</p>
    </>
  );
};
