import { html } from 'lit';
import { formatHtmlSource } from '@/utils/formatters';
import type { BorealStory, BorealStoryMeta } from '@/types/stories';
import type { StatusVariant } from '@telesign/boreal-web-components/types';
import { commonArgTypes, type CommonAttributes } from '@/utils/commonArgs';

type StoryArgs = {
  variant: StatusVariant;
  enableClose: boolean;

  close: CustomEvent<void>;

  title: string;
  body: string;
  actions: string;
  showActions: boolean;
} & CommonAttributes;

type Story = BorealStory<StoryArgs>;

const meta = {
  title: 'Feedback/Banner',
  component: 'bds-banner',
  parameters: {
    controls: {
      exclude: ['showActions'],
    },
    docs: {
      source: {
        excludeDecorators: true,
        transform: formatHtmlSource,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      name: 'slot="title"',
      description: 'The title displayed in the banner.',
      table: {
        category: 'Slots',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: '' },
      },
    },
    body: {
      control: 'text',
      name: 'slot="default"',
      description: 'The main body content displayed in the banner.',
      table: {
        category: 'Slots',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: '' },
      },
    },
    actions: {
      control: false,
      name: 'slot="actions"',
      description: 'The actions slot displayed at the end of the banner.',
      table: {
        category: 'Slots',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: '' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'danger'],
      description: 'Visual style variant: info, success, warning, or danger.',
      table: {
        category: 'Core',
        type: { summary: '"info" | "success" | "warning" | "danger"' },
        defaultValue: { summary: 'info' },
      },
    },
    enableClose: {
      control: 'boolean',
      description: 'Shows a close button that allows users to dismiss the banner.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    ...commonArgTypes['idComponent'],
  },
  args: {
    variant: 'info',
    enableClose: false,
    idComponent: '',
  },
} satisfies BorealStoryMeta<StoryArgs>;

const styles = `
  @import url('https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css');

  .bds-banner__action-button {
    font-weight: 600;
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 4px;

    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: white;
    }
    &:active {
      background-color: #eeeeee;
    }
  }
`;

export default meta;

/**
 * Reusable render function for the Banner component stories.
 * @param args - The story arguments containing component props
 * @returns An HTML template for the Banner component
 */
const renderBanner: Story['render'] = args => html`
  <style>
    ${styles}
  </style>
  <bds-banner
    variant="${args.variant}"
    ?enable-close="${args.enableClose}"
    ${args?.idComponent ? `idComponent=${args.idComponent}` : null}
  >
    <div slot="title">${args.title}</div>
    <div>${args.body}</div>
    ${args.showActions &&
    html` <div slot="actions">
      <button class="bds-banner__action-button">Button 1</button>
      <button class="bds-banner__action-button">Button 2</button>
    </div>`}
  </bds-banner>
`;

/**
 * Default story variant
 */
export const Default: Story = {
  args: {
    title: 'Title',
    body: 'This is the default banner body content.',
    showActions: true,
  },
  render: renderBanner,
};

/**
 * SlotContent story variant
 */
export const OnlyContent: Story = {
  args: {
    body: 'This is the default banner body content.',
  },
  render: renderBanner,
};

/**
 * SlotActions story variant
 */
export const WithContentActions: Story = {
  args: {
    showActions: true,
    body: 'This banner includes action buttons.',
  },
  render: renderBanner,
};

/**
 * SlotTitle story variant
 */
export const WithContentTitle: Story = {
  args: {
    title: 'Banner with Title',
    body: 'This banner includes a title and action buttons.',
  },
  render: renderBanner,
};

/**
 * SlotTitle story variant
 */
export const EnableClose: Story = {
  args: {
    title: 'Title',
    body: 'This banner can be closed using the close button or keyboard navigation. It will emit a close event.',
    enableClose: true,
  },
  render: renderBanner,
};
