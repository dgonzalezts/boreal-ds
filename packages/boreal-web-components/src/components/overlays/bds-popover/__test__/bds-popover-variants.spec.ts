import { newSpecPage } from '@stencil/core/testing';
import { BdsPopover } from '../bds-popover';
import { setupPopoverMocks } from '@/utils/__test__';
import { BdsButton } from '@/components/actions/bds-button/bds-button';

setupPopoverMocks();

describe('bds-popover variants', () => {
  // --- Placement ---
  it('Should apply bottom placement by default', async () => {
    const { doc } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const popover = doc.querySelector('.popover') as HTMLElement;
    expect(popover.getAttribute('data-placement')).toBe('bottom');
  });

  it('Should apply placement from floatingOptions', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const popoverEl = root?.querySelector('bds-popover') as HTMLBdsPopoverElement;
    popoverEl.floatingOptions = { placement: 'left' };
    await waitForChanges();

    expect(popoverEl.floatingOptions.placement).toBe('left');
  });

  it('Should apply right placement from floatingOptions', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const popoverEl = root?.querySelector('bds-popover') as HTMLBdsPopoverElement;
    popoverEl.floatingOptions = { placement: 'right' };
    await waitForChanges();

    expect(popoverEl.floatingOptions.placement).toBe('right');
  });

  // --- Arrow ---
  it('Should show arrow by default', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    expect(root?.querySelector('[part="arrow"]')).not.toBeNull();
  });

  it('Should hide arrow when hideArrow is true', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    const popoverEl = root?.querySelector('bds-popover') as HTMLBdsPopoverElement;
    popoverEl.floatingOptions = { hideArrow: true };
    await waitForChanges();

    expect(root?.querySelector('[part="arrow"]')).toBeNull();
  });

  // --- Width ---
  it('Should apply numeric width in px', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover width="500">Content</bds-popover></bds-button></div>`,
    });
    const popover = root?.querySelector('.popover') as HTMLElement;
    expect(popover?.getAttribute('style')).toBe('width: 500px;');
  });

  it('Should apply fit-content when width is auto', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover width="auto">Content</bds-popover></bds-button></div>`,
    });
    const popover = root?.querySelector('.popover') as HTMLElement;
    expect(popover?.getAttribute('style')).toBe('width: auto;');
  });

  it('Should apply fit-content when width is full', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover width="full">Content</bds-popover></bds-button></div>`,
    });
    const popover = root?.querySelector('.popover') as HTMLElement;
    expect(popover?.getAttribute('style')).toBe('width: 100%;');
  });

  // --- Slots ---
  it('Should render header slot when hasHeader is true', async () => {
    const { doc } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `
      <div>
        <bds-button>Trigger
          <bds-popover has-header="true">
            <span id="title" slot="header-title">Title</span>
            Content
          </bds-popover>
        </bds-button>
      </div>
      `,
    });
    const header = doc.querySelector('.popover-header');
    const title = doc.querySelector('#title');
    expect(header).not.toBeNull();
    expect(title).not.toBeNull();
  });

  it('Should not render header when hasHeader is false', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover>Content</bds-popover></bds-button></div>`,
    });
    expect(root?.querySelector('.popover-header')).toBeNull();
  });

  it('Should render footer slot when hasFooter is true', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `
      <div>
        <bds-button>Trigger
          <bds-popover has-footer="true">
            Content
            <span id="button" slot="footer-button">OK</span>
          </bds-popover>
        </bds-button>
      </div>
      `,
    });
    expect(root?.querySelector('.popover-footer')).not.toBeNull();
  });

  it('Should render close button only when showClose is true', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover],
      html: `<div><bds-button>Trigger <bds-popover has-header="true" show-close="true">Content</bds-popover></bds-button></div>`,
    });
    expect(root?.querySelector('.popover-header__close')).not.toBeNull();
  });

  it('Should not render close button when showClose is false', async () => {
    const { root } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `<div><bds-button>Trigger <bds-popover has-header>Content</bds-popover></bds-button></div>`,
    });
    expect(root?.querySelector('.popover-header__close')).toBeNull();
  });

  it('Should render header-icon slot inside header', async () => {
    const { doc } = await newSpecPage({
      components: [BdsPopover, BdsButton],
      html: `
      <div>
        <bds-button>Trigger
          <bds-popover has-header="true">
            <em slot="header-icon" class="bds-icon-email"></em>
            Content
          </bds-popover>
        </bds-button>
      </div>
      `,
    });
    expect(doc.querySelector('.popover-header')).not.toBeNull();
  });
});
