import type { BorealStory, BorealStoryMeta } from '@/types/stories';
import { formatHtmlSource } from '@/utils';
import { type CommonAttributes } from '@/utils/commonArgs';
import type { FloatingPopoverProp } from '@telesign/boreal-web-components/dist/types/services/floating/interfaces/Props.js';
import { html } from 'lit';
import { createRef } from 'react';

type StoryArgs = {
  placement: string;
  stayOnHover: boolean;
  multiline: boolean;
  hideArrow: boolean;
  disabled: boolean;
  offset: number;

  content: string;
} & CommonAttributes;

type Story = BorealStory<StoryArgs>;

const meta = {
  title: 'Overlays/Tooltip',
  component: 'bds-tooltip',
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
    content: {
      control: { type: 'text' },
      name: 'slot="default"',
      description: 'The main content displayed in the tooltip.',
      table: {
        category: 'Slots',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: '' },
      },
    },
    placement: {
      control: { type: 'select' },
      options: ['left', 'bottom', 'top', 'right'],
      description:
        'Define placement of the tooltip. (To modify it is necessary change ``floatingOptions.placement`` property)',
      table: {
        category: 'Floating Options',
        type: { summary: '"left" | "top" | "bottom" | "right"' },
        defaultValue: { summary: 'bottom' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Define if the tooltip can be shown or not.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    multiline: {
      control: 'boolean',
      description: 'Define if the tooltip can be multiline or not.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    stayOnHover: {
      control: 'boolean',
      description:
        'Define if the tooltip should stay on hover or not. To check it behavior, the offset property must be set to 0 (To modify it is necessary change ``floatingOptions.stayOnHover`` property)',
      table: {
        category: 'Floating Options',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    offset: {
      control: { type: 'number' },
      description:
        'Define the offset of the tooltip (To modify it is necessary change ``floatingOptions.offset`` property).',
      table: {
        category: 'Floating Options',
        type: { summary: 'number' },
        defaultValue: { summary: '8' },
      },
    },
    hideArrow: {
      control: 'boolean',
      description:
        'Define if the tooltip arrow should be hidden or not (To modify it is necessary change ``floatingOptions.hideArrow`` property).',
      table: {
        category: 'Floating Options',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    placement: 'bottom',
    disabled: false,
    multiline: false,
  },
} satisfies BorealStoryMeta<StoryArgs>;

export default meta;

const style = `
    @import url('https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css');

    .center {
        width: 100%;
        height: 100%;
        margin: var(--boreal-spacing-3xl) 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--boreal-typography-font-family-primary);
    }
`;

/**
 * Reusable render function for the Banner component stories.
 * @param args - The story arguments containing component props
 * @returns An HTML template for the Banner component
 */
const renderTooltip: Story['render'] = args => {
  const ref = createRef<HTMLBdsTooltipElement>();

  return html`
    <style>
      ${style}
    </style>
    <span>
      Trigger content
      <bds-tooltip
        ${ref}
        placement="${args.placement}"
        multiline="${args.multiline}"
        disabled="${args.disabled}"
        .floatingOptions=${{
          placement: args.placement as FloatingPopoverProp['placement'],
          offset: args.offset,
          hideArrow: args.hideArrow,
          stayOnHover: args.stayOnHover,
        }}
      >
        ${args.content}
      </bds-tooltip>
    </span>
  `;
};

const renderTooltipWithTypography: Story['render'] = args => {
  const ref = createRef<HTMLBdsTooltipElement>();

  return html`
    <style>
      ${style}
    </style>
    <div class="center">
      <span>
        <bds-typography variant="heading">Load from default slot</bds-typography>
        <bds-tooltip
          ${ref}
          placement="${args.placement}"
          multiline="${args.multiline}"
          disabled="${args.disabled}"
          .floatingOptions=${{
            placement: args.placement as FloatingPopoverProp['placement'],
            offset: args.offset,
            hideArrow: args.hideArrow,
            stayOnHover: args.stayOnHover,
          }}
        >
          ${args.content}
        </bds-tooltip>
      </span>
    </div>
  `;
};

const renderTooltipOnTooltip: Story['render'] = args => {
  return html`
    <style>
      ${style}
    </style>
    <div class="center">
      <bds-typography variant="label" tooltip-text="${args.content}">
        Some text here
      </bds-typography>
    </div>
  `;
};

export const Default: Story = {
  args: {
    placement: 'bottom',
    disabled: false,
    multiline: false,
    hideArrow: false,
    stayOnHover: false,
    offset: 8,
    content: 'Tooltip content',
  },
  render: renderTooltip,
};

export const Placement: Story = {
  args: {
    placement: 'left',
    content: 'Tooltip content',
  },
  render: renderTooltip,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    content: 'Tooltip content',
  },
  render: renderTooltip,
};

export const Multiline: Story = {
  args: {
    multiline: true,
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non, accusamus aliquam. Neque corrupti consequuntur, fuga, necessitatibus esse aliquam at eveniet odit deleniti itaque delectus optio alias expedita non aliquid! Rem?',
  },
  render: renderTooltip,
};

export const HideArrow: Story = {
  args: {
    hideArrow: true,
    content: 'Tooltip content',
  },
  render: renderTooltip,
};

export const StayOnHover: Story = {
  args: {
    stayOnHover: true,
    content: 'Tooltip content',
    hideArrow: true,
    offset: 0,
  },
  render: renderTooltip,
};

export const AsInfo: Story = {
  args: {
    content: 'Tooltip content',
  },
  parameters: {
    controls: {
      exclude: ['placement', 'disabled', 'multiline', 'hideArrow', 'stayOnHover', 'offset'],
    },
  },
  render: renderTooltipOnTooltip,
};

export const WithTypographyComponent: Story = {
  args: {
    content: 'Tooltip contents',
  },
  parameters: {
    controls: {
      exclude: ['placement', 'disabled', 'multiline', 'hideArrow', 'stayOnHover', 'offset'],
    },
  },
  render: renderTooltipWithTypography,
};
