import { newSpecPage } from '@stencil/core/testing';
import { BdsBanner } from '../bds-banner';

describe('bds-banner slots', () => {
  it('should render a banner element with custom slots', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `
        <bds-banner>
          <span slot="title">Title</span>
          <p>Body</p>
          <div slot="actions">
            <button>Action</button>
          </div>
        </bds-banner>`,
    });

    const root = page.root as HTMLElement;

    const titleSlot = root.querySelector('span');
    expect(titleSlot).not.toBeNull();
    expect(root.textContent).toContain('Title');

    const bodySlot = root.querySelector('p');
    expect(bodySlot).not.toBeNull();
    expect(root.textContent).toContain('Body');

    const actionsSlot = root.querySelector('button');
    expect(actionsSlot).not.toBeNull();
    expect(root.textContent).toContain('Action');
  });

  it('should render a banner element with custom slot body and not slot title', async () => {
    const page = await newSpecPage({
      components: [BdsBanner],
      html: `
        <bds-banner>
          <p>Body</p>
          <div slot="actions">
            <button>Action</button>
          </div>
        </bds-banner>`,
    });

    const root = page.root as HTMLElement;

    const titleSlot = root.querySelector('span');
    expect(titleSlot).toBeNull();

    const bodySlot = root.querySelector('p');
    expect(bodySlot).not.toBeNull();
    expect(root.textContent).toContain('Body');

    const actionsSlot = root.querySelector('button');
    expect(actionsSlot).not.toBeNull();
    expect(root.textContent).toContain('Action');
  });
});
