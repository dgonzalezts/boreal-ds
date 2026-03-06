// We should call the mock before importing the component to avoid issues with the decorator during tests
import ValidateDecoratorMock from '@/utils/__test__/mocks/ValidateDecoratorMock';
ValidateDecoratorMock();

import { newSpecPage } from '@stencil/core/testing';
import { attachInternals } from '@/utils/__test__/mocks/ElementInternals';
import { BdsButton } from '../bds-button';

describe('bds-button events', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('should click button', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    const clickSpy = jest.fn();
    root.addEventListener('click', clickSpy);
    button.click();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not click disabled button', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" disabled="true">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    const clickSpy = jest.fn();
    root.addEventListener('click', clickSpy);
    button.click();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should not click loading button', async () => {
    const { root } = await newSpecPage({
      components: [BdsButton],
      html: `<bds-button name="TestButton" is-loading="true">Button</bds-button>`,
    });
    const button = root.querySelector('button');
    const clickSpy = jest.fn();
    root.addEventListener('click', clickSpy);
    button.click();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should submit form when type is submit', async () => {
    const { root, doc } = await newSpecPage({
      components: [BdsButton],
      html: `<form id="testForm"><bds-button name="TestButton" type="submit">Submit</bds-button></form>`,
    });
    const form = doc.querySelector('#testForm');
    const submitSpy = jest.fn();
    form.addEventListener('submit', submitSpy);
    const button = root.querySelector('button');
    button.click();
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should reset form when type is reset', async () => {
    const { root, doc } = await newSpecPage({
      components: [BdsButton],
      html: `<form id="testForm"><bds-button name="TestButton" type="reset">Reset</bds-button></form>`,
    });
    const form = doc.querySelector('#testForm');
    const resetSpy = jest.fn();
    form.addEventListener('reset', resetSpy);
    const button = root.querySelector('button');
    button.click();
    expect(resetSpy).toHaveBeenCalled();
  });
});
