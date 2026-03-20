import { html, nothing } from 'lit';
import { formatHtmlSource } from '@/utils/formatters';
import type { BorealStory, BorealStoryMeta } from '@/types/stories';
import type { ComponentState, Size } from '@telesign/boreal-web-components/types';

type StoryArgs = {
  element: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div' | 'a' | 'label' | '';
  variant:
    | 'label'
    | 'display'
    | 'heading'
    | 'subheading'
    | 'helper'
    | 'link'
    | 'code'
    | 'caption'
    | '';
  align: 'start' | 'center' | 'end' | 'inherit' | '';
  ellipsis: boolean;
  maxLines: number;
  tooltipText: string;

  // Applies to some variants
  state: ComponentState | '';
  size: Size | '';

  // Label
  isRequired: boolean;
  htmlFor: string;

  // Link
  href: string;
  target: '_blank' | '_parent' | '_self' | '_top' | '';
  isDownloadable: boolean;
  filename: string;

  sanitizedHref: string;

  text: string;
};
type Story = BorealStory<StoryArgs>;

const meta = {
  title: 'Titles & Texts/Typography',
  component: 'bds-typography',
  parameters: {
    docs: {
      source: {
        excludeDecorators: true,
        transform: formatHtmlSource,
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      name: 'slot="default"',
      description: 'The text displayed in the typography.',
    },
    variant: {
      control: 'select',
      options: ['label', 'display', 'heading', 'subheading', 'helper', 'link', 'code', 'caption'],
      description: 'The variant of the typography for styling the text.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'display' },
        category: 'Core',
      },
      if: { arg: 'variant', neq: '' },
    },
    element: {
      control: 'select',
      options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'a', 'label'],
      description:
        'Defines the HTML element. For `heading` variant, the text size adjusts to the HTML heading level (`h1` through `h6`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'p' },
        category: 'Core',
      },
      if: { arg: 'element', neq: '' },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'inherit'],
      description: 'The text alignment.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'start' },
        category: 'Styling',
      },
      if: { arg: 'align', neq: '' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description:
        'The size of the typography. For `display` variant all options are available (`xl`, `lg`, `md`, `sm`), while for `link` variant only `md` and `sm` are available.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Core',
      },
      if: { arg: 'size', neq: '' },
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'disabled', 'hover', 'active', 'focus', 'visited'],
      description:
        'The state of the typography. Only available for the `helper` and `label` variants.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Styling',
      },
      if: { arg: 'state', neq: '' },
    },
    tooltipText: {
      control: 'text',
      description:
        'Text to display inside the tooltip when hovering the info icon. Only applicable for `heading`, `subheading`, and `label` variants.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Behavior',
      },
      if: { arg: 'tooltipText', neq: '' },
    },
    isRequired: {
      control: 'boolean',
      description: 'Shows a required indicator when used with `label` variant.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Behavior',
      },
      if: { arg: 'variant', eq: 'label' },
    },
    ellipsis: {
      control: 'boolean',
      description: 'Truncates text with an ellipsis when it overflows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Behavior',
      },
    },
    maxLines: {
      name: 'max-lines',
      control: 'number',
      description: 'Maximum number of lines to show before truncating with ellipsis.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'Behavior',
      },
    },
    href: {
      control: 'text',
      description: 'URL when the typography is an `a` element and a `link` variant.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Link',
      },
      if: { arg: 'variant', eq: 'link' },
    },
    target: {
      control: 'select',
      options: ['_self', '_blank', '_top', '_parent'],
      description: 'Specifies where to open the link.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Link',
      },
      if: { arg: 'variant', eq: 'link' },
    },
    isDownloadable: {
      control: 'boolean',
      description: 'Makes the `link` download a file.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Link',
      },
      if: { arg: 'variant', eq: 'link' },
    },
    filename: {
      control: 'text',
      description: 'Suggested filename when downloading a file from the `link`.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'download' },
        category: 'Link',
      },
      if: { arg: 'variant', eq: 'link' },
    },
  },
  args: {
    variant: '',
    element: '',
    size: '',
    text: '',
    state: '',
    align: '',
    isRequired: false,
    ellipsis: false,
    href: '',
    target: '',
    isDownloadable: false,
    filename: '',
    tooltipText: '',
    maxLines: 1,
  },
} satisfies BorealStoryMeta<StoryArgs>;

export default meta;

const styles = `
  @import url('https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css');
`;
/**
 * Reusable render function for the Typography component stories.
 * @param args - The story arguments containing component props
 * @returns An HTML template for the Typography component
 */
const renderTypography: Story['render'] = args => html`
  <style>
    ${styles}
  </style>
  <bds-typography
    variant=${args.variant}
    element=${args.element || nothing}
    align=${args.align || nothing}
    size=${args.size || nothing}
    state=${args.state || nothing}
    tooltip-text=${args.tooltipText || nothing}
    ?is-required=${args.isRequired || nothing}
    ?ellipsis=${args.ellipsis || nothing}
    href=${args.href || nothing}
    target=${args.target || nothing}
    ?is-downloadable=${args.isDownloadable || nothing}
    filename=${args.filename || nothing}
  >
    ${args.text}
  </bds-typography>
`;

/**
 * Default story variant.
 */
export const Default: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'display',
    element: 'p',
    align: 'start',
    size: 'md',
    state: 'default',
    tooltipText: '',
    isRequired: false,
    ellipsis: false,
    href: '',
    maxLines: 1,
    target: '',
    isDownloadable: false,
    filename: '',
  },
  render: renderTypography,
};

/**
 * The Heading component is used to display a title or heading for a section of content. It can be used to create a main title, a section title, or for content organization.
 */
export const Heading: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'heading',
    align: 'start',
    element: 'h1',
  },
  render: renderTypography,
};

/**
 * Heading with tooltip icon for additional context.
 */
export const HeadingWithTooltip: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'heading',
    element: 'h1',
    align: 'start',
    tooltipText: 'This is a tooltip',
  },
  render: renderTypography,
  /**
   * ##Sizes
   */
};

/**
 * The Subheading component is used to display a subtitle for a section of content. It can be used to create a subtitle, a section subtitle, or for content organization.
 */
export const Subheading: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'subheading',
    align: 'start',
    element: 'h6',
  },
  render: renderTypography,
};

/**
 * Subheading with a tooltip icon for additional context.
 */
export const SubheadingWithTooltip: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'subheading',
    element: 'h6',
    align: 'start',
    tooltipText: 'This is a tooltip',
  },
  render: renderTypography,
};

/**
 * The Display variant is used for rendering general text content within the application interface. It's suitable for paragraphs, descriptions, and other standard textual elements where specific heading, subheading, or caption styling isn't required.
 */
export const Display: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'display',
    element: 'p',
    align: 'start',
    size: 'md',
  },
  render: renderTypography,
};

/**
 * The Label variant is specifically designed to accompany form controls, clearly identifying their purpose. It supports visual states like `required` and `disabled`, and can optionally include a tooltip icon for additional context.
 */
export const Label: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'label',
    element: 'label',
    align: 'start',
  },
  render: renderTypography,
};

/**
 * Label with tooltip.
 */
export const LabelWithTooltip: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'label',
    element: 'label',
    align: 'start',
    tooltipText: 'This is a tooltip',
  },
  render: renderTypography,
};

/**
 * Label with required indicator.
 */
export const LabelWithRequiredIndicator: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'label',
    element: 'label',
    align: 'start',
    state: 'default',
    isRequired: true,
  },
  render: renderTypography,
};

/**
 * Label with disabled state.
 */
export const LabelDisabled: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'label',
    element: 'label',
    align: 'start',
    state: 'disabled',
  },
  render: renderTypography,
};

/**
 * The Helper variant is used to provide additional context or assistance, including error messages.
 */
export const Helper: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'helper',
    element: 'p',
    align: 'start',
    state: 'default',
  },
  render: renderTypography,
};

/**
 * Helper with error state.
 */
export const HelperWithError: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'helper',
    element: 'p',
    align: 'start',
    state: 'error',
  },
  render: renderTypography,
};

/**
 * The Link variant is used to create interactive text elements that navigate to new content.\
 * For semantic HTML, the `element` attribute is always set to `a`.
 */
export const Link: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'link',
    element: 'a',
    align: 'start',
    size: 'md',
    state: 'default',
    href: '#',
    target: '',
    isDownloadable: false,
    filename: '',
  },
  render: renderTypography,
};

/**
 * Link with disabled state.
 */
export const LinkDisabled: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'link',
    element: 'a',
    align: 'start',
    size: 'md',
    state: 'disabled',
    href: '#',
    target: '',
    isDownloadable: false,
    filename: '',
  },
  render: renderTypography,
};

/**
 * Link with download file.
 */
export const LinkWithDownloadFile: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'link',
    element: 'a',
    align: 'start',
    size: 'md',
    state: 'default',
    href: '#',
    target: '',
    isDownloadable: true,
    filename: '',
  },
  render: renderTypography,
};

/**
 * The Caption variant is used to provide additional context or assistance.
 */
export const Caption: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'caption',
    element: 'p',
    align: 'start',
  },
  render: renderTypography,
};

/**
 * The Code variant is used to display inline code snippets or technical content.
 */
export const Code: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet',
    variant: 'code',
    element: 'p',
    align: 'start',
  },
  render: renderTypography,
};

/**
 * Text truncation limits how much text is displayed when the content exceeds the available space. When truncation is active, overflowing text is visually cut off and replaced by an ellipsis (…), signaling to users that more content exists beyond what is currently shown.
 */
export const TextTruncation: Story = {
  args: {
    text: 'This is a long text with Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    variant: 'display',
    element: 'p',
    align: 'start',
    size: 'md',
    state: 'default',
    ellipsis: true,
    maxLines: 1,
  },
  parameters: {
    __sb: {
      width: '500px',
      margin: '0 auto',
    },
  },
  render: renderTypography,
};
