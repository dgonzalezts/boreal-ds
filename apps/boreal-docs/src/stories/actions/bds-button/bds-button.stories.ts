import { html, css } from 'lit';
import { formatHtmlSource } from '@/utils/formatters';
import type { BorealStory, BorealStoryMeta } from '@/types/stories';
import type { CoreColors } from '@telesign/boreal-web-components/dist/types/types/coreColors.js';
import type {
  ButtonSizes,
  ButtonTypes,
  ButtonVariant,
} from '@telesign/boreal-web-components/dist/types/components/actions/bds-button/types/types.js';

type StoryArgs = {
  label: string;
  disabled: boolean;
  name: string;
  type: ButtonTypes;
  color: CoreColors;
  variant: ButtonVariant;
  size: ButtonSizes;
  loading: boolean;
  disclosure: boolean;

  slotDefault: string;
  slotIcon: boolean;
  slotBadge: boolean;
  onClick: () => void;
};
type Story = BorealStory<StoryArgs>;

const meta = {
  title: 'Actions/Button',
  component: 'bds-button',
  parameters: {
    docs: {
      source: {
        excludeDecorators: true,
        transform: formatHtmlSource,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description:
        'The accessible name for the button, used for screen readers. It should be provided by the user for accessibility purposes.',
      table: {
        category: 'a11y',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    name: {
      control: 'text',
      description: 'The name attribute for the button, useful for form submissions.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'The type of the button, which can be `button`, `submit`, or `reset`.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: 'button' },
      },
    },
    color: {
      control: { type: 'select' },
      options: ['default', 'primary', 'success', 'danger'],
      description:
        'The color theme of the button, which can be `default`, `primary`, `success`, or `danger`.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'plain'],
      description: 'The visual style of the button, which can be `default`, `outline`, or `plain`.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the button, which can be `small`, `medium`, or `large`.',
      table: {
        category: 'Core',
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'Disables the button when true, preventing user interaction and applying disabled styles.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description:
        'Indicates whether the button is in a loading state, which can be used to show a loading spinner and disable the button.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disclosure: {
      control: 'boolean',
      description: 'Indicates if the button should show a chevron down at the end of the content.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    slotDefault: {
      control: 'text',
      name: 'slot="default"',
      description: 'The content of the button, typically text or an icon.',
      table: {
        category: 'Slots',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: '' },
      },
    },
    slotIcon: {
      control: false,
      name: 'slot="icon"',
      description: 'Content to show an icon at the begining of the button.',
      table: {
        category: 'Slots',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: '' },
      },
    },
    slotBadge: {
      control: false,
      name: 'slot="badge"',
      description: 'Slot to place a badge component.',
      table: {
        category: 'Slots',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: '' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function that is called when the button is clicked.',
      table: {
        category: 'Events',
      },
    },
  },
  args: {
    label: 'button',
    name: 'button-name',
    type: 'button',
    color: 'default',
    variant: 'default',
    size: 'medium',
    disabled: false,
    loading: false,
    disclosure: false,

    slotDefault: 'Button',
  },
} satisfies BorealStoryMeta<StoryArgs>;

const styles = css`
  @import url('https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css');

  .custom-badge {
    background-color: #e3e3e6;
    border-radius: 4px;
    padding: 2px 4px;
    color: #272a2f;
    font-weight: 400;
  }
`;

export default meta;

/**
 * Reusable render function for the Button component stories.
 * @param args - The story arguments containing component props
 * @returns An HTML template for the Button component
 */
const renderButton: Story['render'] = args => html`
  <style>
    ${styles}
  </style>
  <bds-button
    label=${args.label}
    name=${args.name}
    type=${args.type}
    color=${args.color}
    variant=${args.variant}
    size=${args.size}
    ?disabled=${args.disabled}
    ?loading=${args.loading}
    ?disclosure=${args.disclosure}
    @click=${args.onClick}
  >
    ${args.slotIcon &&
    html`<span slot="icon">
      <em class="bds-icon-settings"></em>
    </span>`}
    ${args.slotBadge &&
    html`<div slot="badge">
      <span class="custom-badge"> # </span>
    </div>`}
    ${args.slotDefault}
  </bds-button>
`;
/**
 * Button `default` variant.
 */
export const Default: Story = {
  render: renderButton,
};

/**
 * Button `primary` color.
 */
export const PrimaryButton: Story = {
  args: {
    color: 'primary',
  },
  render: renderButton,
};

/**
 * Button with size `large`.
 */
export const LargeButton: Story = {
  args: {
    size: 'large',
    color: 'primary',
  },
  render: renderButton,
};

/**
 * Button with size `small`.
 */
export const SmallButton: Story = {
  args: {
    color: 'success',
    size: 'small',
  },
  render: renderButton,
};

/**
 * Button with `plain` variant.
 */
export const PlainButton: Story = {
  args: {
    color: 'primary',
    variant: 'plain',
  },
  render: renderButton,
};

/**
 * Button with `outline` variant.
 */
export const OutlineButton: Story = {
  args: {
    variant: 'outline',
  },
  render: renderButton,
};

/**
 * Button using the slot icon.
 */
export const ButtonWithIcon: Story = {
  args: {
    slotIcon: true,
  },
  render: renderButton,
};

/**
 * Button with `hasDisclosure` property.
 */
export const ButtonWithDisclosure: Story = {
  args: {
    disclosure: true,
  },
  render: renderButton,
};

/**
 * Button using the badge slot.
 */
export const ButtonWithBadge: Story = {
  args: {
    slotBadge: true,
  },
  render: renderButton,
};

/**
 * Button with `isLoading` property.
 */
export const ButtonLoading: Story = {
  args: {
    loading: true,
    color: 'primary',
  },
  render: renderButton,
};
