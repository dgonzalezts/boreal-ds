import { newSpecPage } from '@stencil/core/testing';
import { assertExists, attachInternals } from '@/utils';
import { BdsTextField } from '../bds-text-field';
import { BdsTypography } from '../../../titles-text/bds-typography/bds-typography';

describe('bds-text-field form integration', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('registers value with internals when value prop is changed', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field name="fieldName"></bds-text-field>',
    });
    const internals = (page.rootInstance as any).internals;
    internals.setFormValue.mockClear();

    (page.root as any).value = 'hello';
    await page.waitForChanges();

    expect(internals.setFormValue).toHaveBeenCalledWith('hello');
  });

  it('renders inner input with disabled attribute when disabled prop changes to true', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field name="fieldName" value="hello"></bds-text-field>',
    });
    const root = page.root as HTMLElement;

    (page.root as any).disabled = true;
    await page.waitForChanges();

    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('reflects required as an attribute on the host', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    expect(root.hasAttribute('required')).toBe(true);
  });

  it('pre-populates inner input value from initial value prop', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field value="initial"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.value).toBe('initial');
  });

  it('resets value, touched and dirty via formResetCallback', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field value="filled"></bds-text-field>',
    });
    const instance = page.rootInstance as any;
    instance.touched = true;
    instance.dirty = true;

    instance.formResetCallback();
    await page.waitForChanges();

    expect((page.root as any).value).toBe('');
    expect(instance.touched).toBe(false);
    expect(instance.dirty).toBe(false);
  });

  it('resets currentCharCount to 0 via formResetCallback', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field counter="true" char-count="20" value="hello"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const instance = page.rootInstance as any;

    instance.formResetCallback();
    await page.waitForChanges();

    const charCount = root.querySelector('.bds-text-field__char-count');
    assertExists(charCount, '.bds-text-field__char-count not found');
    expect(charCount.textContent).toBe('0/20');
  });

  it('checkValidity returns true when internals reports valid', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field value="some text"></bds-text-field>',
    });
    const internals = (page.rootInstance as any).internals;
    internals.checkValidity.mockReturnValueOnce(true);
    const result = await (page.root as any).checkValidity();
    expect(result).toBe(true);
  });

  it('checkValidity returns false when internals reports invalid', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true"></bds-text-field>',
    });
    const internals = (page.rootInstance as any).internals;
    internals.checkValidity.mockReturnValueOnce(false);
    const result = await (page.root as any).checkValidity();
    expect(result).toBe(false);
  });

  it('reportValidity delegates to internals and returns boolean', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const internals = (page.rootInstance as any).internals;
    internals.reportValidity.mockReturnValueOnce(true);
    const result = await (page.root as any).reportValidity();
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  it('formStateRestoreCallback restores value', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const instance = page.rootInstance as any;

    instance.formStateRestoreCallback('restored value', 'restore');
    await page.waitForChanges();

    expect((page.root as any).value).toBe('restored value');
  });
});
