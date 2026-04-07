import type { BorealStory, BorealStoryMeta } from '@/types/stories';
import { formatHtmlSource } from '@/utils';
import { type CommonAttributes } from '@/utils/commonArgs';
import type { FloatingPopoverProp } from '@telesign/boreal-web-components/dist/types/services/floating/interfaces/Props.js';
import { html } from 'lit';

type StoryArgs = {
  placement: FloatingPopoverProp['placement'];
  hideArrow: boolean;
  offset: number;
  closeOnClickOutside: boolean;
  closeOnClick: boolean;

  disabled: boolean;
  width: number | 'full' | 'auto';

  content: string;
  footerHelper: string;
  footerButton: string;
  headerIcon: string;
  headerTitle: string;

  hasHeader: boolean;
  hasFooter: boolean;
  showClose: boolean;
} & CommonAttributes;

type Story = BorealStory<StoryArgs>;

const meta = {
  title: 'Overlays/Popover',
  component: 'bds-popover',
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
    // --- Slots ---
    content: {
      control: { type: 'text' },
      name: 'slot="default"',
      description: 'Main content displayed inside the popover body.',
      table: {
        category: 'Slots',
        type: { summary: 'HTMLElement' },
        defaultValue: { summary: '' },
      },
    },

    // --- Core ---
    disabled: {
      control: 'boolean',
      description: 'When true, prevents the popover from being shown.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    width: {
      control: { type: 'text' },
      description:
        'Width of the popover content. Use a number for pixels, `"full"` to match trigger width, or `"auto"` to fit content.',
      table: {
        category: 'Core',
        type: { summary: 'number | "full" | "auto"' },
        defaultValue: { summary: '320' },
      },
    },
    hasHeader: {
      control: 'boolean',
      description:
        'When true, renders the header section with `header-icon` and `header-title` slots.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasFooter: {
      control: 'boolean',
      description:
        'When true, renders the footer section with `footer-helper` and `footer-button` slots.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showClose: {
      control: 'boolean',
      description:
        'When true, renders a close button inside the header. Requires `hasHeader` to be true.',
      table: {
        category: 'Core',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // --- Floating Options ---
    placement: {
      control: { type: 'select' },
      options: ['top-start', 'bottom-start', 'left', 'right'],
      description:
        'Defines the preferred placement of the popover relative to its trigger. (Set via `floatingOptions.placement`)',
      table: {
        category: 'Floating Options',
        type: { summary: 'Placement' },
        defaultValue: { summary: 'bottom' },
      },
    },
    hideArrow: {
      control: 'boolean',
      description:
        'When true, hides the arrow element pointing toward the trigger. (Set via `floatingOptions.hideArrow`)',
      table: {
        category: 'Floating Options',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    offset: {
      control: { type: 'number' },
      description:
        'Distance in pixels between the popover and its trigger. (Set via `floatingOptions.offset`)',
      table: {
        category: 'Floating Options',
        type: { summary: 'number' },
        defaultValue: { summary: '8' },
      },
    },
    closeOnClickOutside: {
      control: 'boolean',
      description:
        'When false, the popover will NOT close when clicking outside. (Set via `floatingOptions.closeOnClickOutside`)',
      table: {
        category: 'Floating Options',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    closeOnClick: {
      control: 'boolean',
      description:
        'When true, the popover closes when the user clicks inside its content. (Set via `floatingOptions.closeOnClick`)',
      table: {
        category: 'Floating Options',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    placement: 'bottom-start',
    disabled: false,
    width: 320,
    hasHeader: false,
    hasFooter: false,
    showClose: false,
    hideArrow: false,
    offset: 8,
    closeOnClickOutside: true,
    closeOnClick: false,
    content: 'Popover content',
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

// --- Renders ---

const renderDefault: Story['render'] = args => html`
  <style>
    ${style}
  </style>
  <div class="center">
    <bds-button color="default">
      Button
      <bds-popover
        width="${args.width}"
        ?disabled="${args.disabled}"
        .floatingOptions=${{
          placement: args.placement,
          offset: args.offset,
          hideArrow: args.hideArrow,
          closeOnClickOutside: args.closeOnClickOutside,
          closeOnClick: args.closeOnClick,
        }}
      >
        ${args.content}
      </bds-popover>
    </bds-button>
  </div>
`;

const renderWithHeader: Story['render'] = args => html`
  <style>
    ${style}
  </style>
  <div class="center">
    <bds-button color="default">
      Button
      <bds-popover
        width="${args.width}"
        ?has-header="${args.hasHeader}"
        ?show-close="${args.showClose}"
        .floatingOptions=${{
          placement: args.placement,
          offset: args.offset,
          hideArrow: args.hideArrow,
          closeOnClickOutside: args.closeOnClickOutside,
        }}
      >
        <em slot="header-icon" class="bds-icon-email"></em>
        <div slot="header-title"><span>Header title</span></div>
        ${args.content}
      </bds-popover>
    </bds-button>
  </div>
`;

const renderWithHeaderAndFooter: Story['render'] = args => html`
  <style>
    ${style}
  </style>
  <div class="center">
    <bds-button color="default">
      Button
      <bds-popover
        width="${args.width}"
        ?has-header="${args.hasHeader}"
        ?has-footer="${args.hasFooter}"
        ?show-close="${args.showClose}"
        .floatingOptions=${{
          placement: args.placement,
          offset: args.offset,
          hideArrow: args.hideArrow,
          closeOnClickOutside: args.closeOnClickOutside,
          closeOnClick: args.closeOnClick,
        }}
      >
        <em slot="header-icon" class="bds-icon-email"></em>
        <div slot="header-title"><span>Header title</span></div>
        ${args.content}
        <bds-typography slot="footer-helper" variant="helper">This is a helper text</bds-typography>
        <bds-button slot="footer-button" variant="outline" color="primary" size="small"
          >Action</bds-button
        >
      </bds-popover>
    </bds-button>
  </div>
`;

export const Default: Story = {
  args: {
    placement: 'bottom-start',
    width: 300,
    content: 'Popover content',
  },
  render: renderDefault,
};

export const Placement: Story = {
  args: {
    placement: 'top-start',
    width: 300,
    content: 'Popover content',
  },
  render: renderDefault,
};

export const HideArrow: Story = {
  args: {
    hideArrow: true,
    width: 300,
    content: 'Popover content',
  },
  render: renderDefault,
};

export const WithHeader: Story = {
  args: {
    hasHeader: true,
    showClose: true,
    width: 300,
    content: 'Popover with header and close button.',
  },
  render: renderWithHeader,
};

export const WithHeaderAndFooter: Story = {
  args: {
    hasHeader: true,
    hasFooter: true,
    showClose: true,
    width: 300,
    content: 'Popover with header, footer and close button.',
  },
  render: renderWithHeaderAndFooter,
};

export const CloseOnClickOutsideDisabled: Story = {
  name: 'Close on Click Outside',
  args: {
    hasHeader: true,
    hasFooter: true,
    showClose: true,
    placement: 'left',
    width: 300,
    closeOnClickOutside: false,
    content: 'This popover only closes via the close button.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `closeOnClickOutside` is `false`, clicking outside will not dismiss the popover. Use the close button to hide it.',
      },
    },
  },
  render: renderWithHeaderAndFooter,
};

export const CloseOnClick: Story = {
  name: 'Close on Click Inside',
  args: {
    hasHeader: true,
    hasFooter: true,
    placement: 'right',
    width: 300,
    closeOnClick: true,
    content: 'Click anywhere inside this popover to close it.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `closeOnClick` is `true`, clicking inside the popover content will dismiss it.',
      },
    },
  },
  render: renderWithHeaderAndFooter,
};

export const WidthFull: Story = {
  name: 'Width — Full',
  parameters: {
    docs: {
      description: {
        story:
          'The popover width is set to `full`, which means it will match the width of the trigger element.',
      },
    },
  },
  args: {
    width: 'full',
    content: 'This popover matches the trigger width.',
  },
  render: renderDefault,
};

export const WidthAuto: Story = {
  name: 'Width — Auto',
  parameters: {
    docs: {
      description: {
        story: 'The popover width is set to `auto`, which means it will fit its content.',
      },
    },
  },
  args: {
    width: 'auto',
    content: 'This popover fits its content.',
  },
  render: renderDefault,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    content: 'This popover will never show.',
  },
  render: renderDefault,
};
