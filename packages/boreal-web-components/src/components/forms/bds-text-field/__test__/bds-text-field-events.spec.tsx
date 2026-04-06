import { newSpecPage } from '@stencil/core/testing';
import { assertExists, attachInternals } from '@/utils';
import { BdsTextField } from '../bds-text-field';
import { BdsTypography } from '../../../titles-text/bds-typography/bds-typography';

function typeInInput(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

describe('bds-text-field events', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('bdsInput fires on keystroke with detail.value equal to input value', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const inputSpy = jest.fn();
    root.addEventListener('bdsInput', inputSpy);

    typeInInput(input, 'hello');
    await page.waitForChanges();

    expect(inputSpy).toHaveBeenCalledTimes(1);
    const detail = (inputSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.value).toBe('hello');
  });

  it('bdsInput detail contains the originating Event', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const inputSpy = jest.fn();
    root.addEventListener('bdsInput', inputSpy);

    typeInInput(input, 'hi');
    await page.waitForChanges();

    const detail = (inputSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.event).toBeInstanceOf(Event);
  });

  it('bdsChange fires when native change event is dispatched', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const changeSpy = jest.fn();
    root.addEventListener('bdsChange', changeSpy);

    typeInInput(input, 'changed');
    await page.waitForChanges();
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    const detail = (changeSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.value).toBe('changed');
  });

  it('bdsChange NOT fired when blur occurs without a change event', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const changeSpy = jest.fn();
    root.addEventListener('bdsChange', changeSpy);

    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(changeSpy).not.toHaveBeenCalled();
  });

  it('bdsFocus fires when input gains focus', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const focusSpy = jest.fn();
    root.addEventListener('bdsFocus', focusSpy);

    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('bdsBlur fires when input loses focus', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const blurSpy = jest.fn();
    root.addEventListener('bdsBlur', blurSpy);

    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(blurSpy).toHaveBeenCalledTimes(1);
  });

  it('bdsClear fires when clear button is clicked', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field clearable="true" value="hello"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const clearBtn = root.querySelector('.bds-text-field__action--clear') as HTMLElement;
    assertExists(clearBtn, 'clear button not found');
    const clearSpy = jest.fn();
    root.addEventListener('bdsClear', clearSpy);

    clearBtn.click();
    await page.waitForChanges();

    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('clear button resets value to empty string', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field clearable="true" value="hello"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const clearBtn = root.querySelector('.bds-text-field__action--clear') as HTMLElement;
    assertExists(clearBtn, 'clear button not found');

    clearBtn.click();
    await page.waitForChanges();

    expect((page.root as any).value).toBe('');
  });

  it('clear button hides after value is cleared', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field clearable="true" value="hello"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const clearBtn = root.querySelector('.bds-text-field__action--clear') as HTMLElement;
    assertExists(clearBtn, 'clear button not found');

    clearBtn.click();
    await page.waitForChanges();

    expect(root.querySelector('.bds-text-field__action--clear')).toBeNull();
  });

  it('clearOnHover adds bds-text-field--clear-on-hover class to host', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field clear-on-hover="true" value="text"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    expect(root.classList.contains('bds-text-field--clear-on-hover')).toBe(true);
  });

  it('password toggle changes input type from "password" to "text"', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field type="password"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const toggleBtn = root.querySelector('.bds-text-field__action--password') as HTMLElement;
    assertExists(toggleBtn, 'password toggle button not found');

    expect(input.getAttribute('type')).toBe('password');
    toggleBtn.click();
    await page.waitForChanges();

    expect(input.getAttribute('type')).toBe('text');
  });

  it('second password toggle restores input type to "password"', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field type="password"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const toggleBtn = root.querySelector('.bds-text-field__action--password') as HTMLElement;
    assertExists(toggleBtn, 'password toggle button not found');

    toggleBtn.click();
    await page.waitForChanges();
    toggleBtn.click();
    await page.waitForChanges();

    expect(input.getAttribute('type')).toBe('password');
  });

  it('password toggle button initial aria-label is "Show password"', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field type="password"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const toggleBtn = root.querySelector('.bds-text-field__action--password') as HTMLElement;
    assertExists(toggleBtn, 'password toggle button not found');
    expect(toggleBtn.getAttribute('aria-label')).toBe('Show password');
  });

  it('password toggle button aria-label becomes "Hide password" after toggle', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field type="password"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const toggleBtn = root.querySelector('.bds-text-field__action--password') as HTMLElement;
    assertExists(toggleBtn, 'password toggle button not found');

    toggleBtn.click();
    await page.waitForChanges();

    expect(toggleBtn.getAttribute('aria-label')).toBe('Hide password');
  });

  it('valueChange fires on every input with the new string value', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;
    const valueChangeSpy = jest.fn();
    root.addEventListener('valueChange', valueChangeSpy);

    typeInInput(input, 'typed');
    await page.waitForChanges();

    expect(valueChangeSpy).toHaveBeenCalled();
    const detail = (valueChangeSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(detail).toBe('typed');
  });

  it('char counter text updates after each input', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field counter="true" char-count="20"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;

    typeInInput(input, 'hello');
    await page.waitForChanges();

    const charCount = root.querySelector('.bds-text-field__char-count');
    assertExists(charCount, '.bds-text-field__char-count not found');
    expect(charCount.textContent).toBe('5/20');
  });
});
