import type { BorealStory, BorealStoryMeta } from '@/types/stories';
import { css, html } from 'lit';
import { createIconData } from './icons/helpers/getIcons';
import { DEFAULT_VALUES } from './icons/constants/Values';
import { disableControls } from '@/utils/disableControls';
import { formatHtmlSource } from '@/utils';

type StoryArgs = {
  name: string;
  size?: string;
  color?: string;
  search?: string;
};

const meta: BorealStoryMeta<StoryArgs> = {
  title: 'imagesAndIcons/Icons',
  component: 'em',
  parameters: {
    docs: {
      source: {
        excludeDecorators: true,
        transform: formatHtmlSource,
      },
    },
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name of the icon to display.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULT_VALUES.name },
        category: 'Core',
      },
    },
    search: {
      control: 'text',
      description: 'Search icons by name.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Search/Filter',
      },
    },
    size: {
      control: 'text',
      description: 'The size of the icon. Can be specified in "px", "rem" or "rem ".',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULT_VALUES.size },
        category: 'Core',
      },
    },
    color: {
      control: 'color',
      description: 'The color of the icon. Can be any valid CSS value.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULT_VALUES.color },
        category: 'Core',
      },
    },
  },
  args: {
    ...DEFAULT_VALUES,
  },
};

export default meta;

type Story = BorealStory<StoryArgs> & { args: StoryArgs };

const styles = css`
  .icon-container {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-card {
    background-color: #fff;
    padding: 1rem;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    border: 1px solid #ccc;
    flex-direction: column;
    position: relative;
  }
  .icon-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 20px;
    gap: 10px;
    margin: 20px;
  }
  .icons-page {
    width: 100%;
    font-family:
      'Nunito Sans',
      -apple-system,
      '.SFNSText-Regular',
      'San Francisco',
      BlinkMacSystemFont,
      'Segoe UI',
      'Helvetica Neue',
      Helvetica,
      Arial,
      sans-serif;
  }

  .icons-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px 12px;
    border-left: 4px solid #007bff;
  }

  .icons-tip {
    color: #111827;
    font-size: 0.85rem;
    line-height: 1.2;
  }

  .icons-tip__icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: 1px solid #e5e7eb;
  }

  .icons-tip__text strong {
    font-weight: 700;
  }

  .icons-counter {
    display: block;
    align-items: center;
    gap: 6px;

    border-radius: 999px;
    margin-top: 1rem;

    font-size: 0.8rem;
  }
  .icon-name {
    align-self: flex-start;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }

  @media (max-width: 1100px) {
    .icon-row {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  @media (max-width: 900px) {
    .icon-row {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  @media (max-width: 650px) {
    .icon-row {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

const linkCss = html`<link
  rel="stylesheet"
  href="https://resources-borealds.s3.us-east-1.amazonaws.com/icons/current/boreal-styles.css"
/>`;

export const Default: Story = {
  argTypes: disableControls(meta.argTypes, 'search'),
  args: {
    ...DEFAULT_VALUES,
  },
  render: (args: StoryArgs) => html`
    ${linkCss}
    <style>
      ${styles}
    </style>
    <div class="icon-container icon-container--full">
      <div class="icon-card">
        <em
          class="${args.name}"
          style="
            color: ${args.color};
            font-size: ${args.size};
          "
        >
        </em>
      </div>
    </div>
  `,
};

const fetchIcons = async (): Promise<{ name: string }[]> => {
  return await createIconData();
};

export const AllIcons: Story = {
  argTypes: disableControls(meta.argTypes, 'name'),
  args: {
    ...DEFAULT_VALUES,
  },
  loaders: [
    async () => {
      const icons = await fetchIcons();
      return { icons };
    },
  ],
  render: (args: StoryArgs, context) => {
    const icons = context.loaded.icons ?? [];

    const searchTerm = args.search?.toLowerCase() || '';
    const filteredIcons = icons.filter(({ name }: any) => name.toLowerCase().includes(searchTerm));

    return html`
      ${linkCss}
      <style>
        ${styles}
      </style>
      <div class="icons-page">
        <div class="icons-header">
          <div class="icons-tip" role="status" aria-live="polite">
            <span class="icons-tip__icon" aria-hidden="true">💡</span>
            <span class="icons-tip__text">
              <strong>Tip:</strong> Use the search control in the
              <strong>search/filter</strong> section of the controls panel to find specific icons
            </span>
          </div>

          <div class="icons-counter">
            Showing <strong>${filteredIcons.length}</strong> of
            <strong>${icons.length}</strong> icons
          </div>
        </div>
        <div class="icon-row">
          ${filteredIcons.map(
            (icon: any) => html`
              <div class="icon-card">
                <span class="icon-name">
                  name:
                  <strong>${icon.name}</strong>
                </span>
                <em
                  class="${icon.name}"
                  style="
                  color: ${args.color};
                  font-size: ${args.size};
                "
                ></em>
              </div>
            `
          )}
        </div>
      </div>
    `;
  },
};
