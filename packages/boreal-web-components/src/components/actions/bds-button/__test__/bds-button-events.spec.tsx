import { newSpecPage } from '@stencil/core/testing';
import { attachInternals } from '@/utils/__test__/mocks/ElementInternals';
import { BdsButton } from '../bds-button';
import { assertExists } from '@/utils/__test__/helpers';

describe('bds-button events', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('should click button', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const clickSpy = jest.fn();
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');
    root.addEventListener('bdsClick', clickSpy);
    button.click();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not click disabled button', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" disabled="true">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');
    const clickSpy = jest.fn();
    root.addEventListener('bdsClick', clickSpy);
    button.click();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should not click loading button', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" loading="true">Button</bds-button>`,
    });
    const root = page.root as HTMLElement;
    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');
    const clickSpy = jest.fn();
    root.addEventListener('bdsClick', clickSpy);
    button.click();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should submit form when type is submit', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<form id="testForm"><bds-button name="TestButton" type="submit">Submit</bds-button></form>`,
    });
    const root = page.root as HTMLElement;
    const doc = page.doc as Document;
    const form = doc.querySelector('#testForm');
    const submitSpy = jest.fn();

    assertExists(form, 'Form element not found');
    form.addEventListener('submit', submitSpy);

    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');

    button.click();
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should reset form when type is reset', async () => {
    const page = await newSpecPage({
      components: [BdsButton],
      html: `<form id="testForm"><bds-button name="TestButton" type="reset">Reset</bds-button></form>`,
    });
    const root = page.root as HTMLElement;
    const doc = page.doc as Document;
    const form = doc.querySelector('#testForm');
    const resetSpy = jest.fn();

    assertExists(form, 'Form element not found');
    form.addEventListener('reset', resetSpy);

    const button = root.querySelector('button');
    assertExists(button, 'Button element not found');

    button.click();
    expect(resetSpy).toHaveBeenCalled();
  });
});
