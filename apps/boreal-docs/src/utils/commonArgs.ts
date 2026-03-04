import type { ArgTypes } from '@storybook/web-components-vite';

export const commonArgs = {
  idComponent: '',
};

export const commonArgTypes: ArgTypes = {
  idComponent: {
    idComponent: {
      control: 'text',
      description: 'The id of the component HTML element.',
      table: {
        category: 'Common',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: 'random string' },
      },
    },
  },
};

export type CommonAttributes = {
  idComponent: string;
};
