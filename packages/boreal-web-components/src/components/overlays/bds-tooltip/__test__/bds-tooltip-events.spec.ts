import { newSpecPage } from '@stencil/core/testing';
import { BdsTooltip } from '../bds-tooltip';
import { setupPopoverMocks } from '@/utils/__test__';

setupPopoverMocks();

describe('bds-tooltip floating hooks', () => {
  it('Should call mocked showPopover when show is shown', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const spyShow = jest.spyOn(HTMLElement.prototype, 'showPopover');

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    expect(spyShow).toHaveBeenCalled();
  });
  it('Should call mocked hidePopover when show is hidden', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const spyHide = jest.spyOn(HTMLElement.prototype, 'hidePopover');

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    root.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await waitForChanges();

    expect(spyHide).toHaveBeenCalled();
  });
  it('Should call custom afterShow Hook when tooltip if shown', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const options = { onAfterShow: jest.fn() };
    const spy = options.onAfterShow;
    root.floatingOptions = options;
    await waitForChanges();

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    expect(spy).toHaveBeenCalled();
  });
  it('Should call custom beforeShow Hook when tooltip if shown', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const options = { onBeforeShow: jest.fn() };
    const spy = options.onBeforeShow;
    root.floatingOptions = options;
    await waitForChanges();

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    expect(spy).toHaveBeenCalled();
  });
  it('Should call custom afterHide Hook when tooltip if hidden', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const options = { onAfterHide: jest.fn() };
    const spy = options.onAfterHide;
    root.floatingOptions = options;
    await waitForChanges();

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    root.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await waitForChanges();
    expect(spy).toHaveBeenCalled();
  });
  it('Should call custom beforeHide Hook when tooltip if hidden', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const options = { onBeforeHide: jest.fn() };
    const spy = options.onBeforeHide;
    root.floatingOptions = options;
    await waitForChanges();

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    root.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await waitForChanges();
    expect(spy).toHaveBeenCalled();
  });
  it('Should call custom mount Hook when tooltip if hidden', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const options = { mounted: jest.fn() };
    const spy = options.mounted;
    root.floatingOptions = options;
    await waitForChanges();

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    expect(spy).not.toHaveBeenCalled();
  });
  it('Should call custom mount Hook when tooltip if hidden', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });
    const options = { unmounted: jest.fn() };
    const spy = options.unmounted;
    root.floatingOptions = options;
    await waitForChanges();

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    root.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await waitForChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should call mocked hooks in order', async () => {
    const { root, waitForChanges } = await newSpecPage({
      components: [BdsTooltip],
      html: `<span>Some text<bds-tooltip>Text content</bds-tooltip></span>`,
    });

    const callOrder: string[] = [];

    const options = {
      onBeforeShow: jest.fn().mockImplementation(() => callOrder.push('onBeforeShow')),
      onAfterShow: jest.fn().mockImplementation(() => callOrder.push('onAfterShow')),
      onBeforeHide: jest.fn().mockImplementation(() => callOrder.push('onBeforeHide')),
      onAfterHide: jest.fn().mockImplementation(() => callOrder.push('onAfterHide')),
    };

    root.floatingOptions = options;
    await waitForChanges();

    root.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();
    expect(callOrder).toEqual(['onBeforeShow', 'onAfterShow']);

    root.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await waitForChanges();
    expect(callOrder).toEqual(['onBeforeShow', 'onAfterShow', 'onBeforeHide', 'onAfterHide']);
  });
});
