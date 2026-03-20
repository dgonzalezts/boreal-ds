import { newSpecPage } from '@stencil/core/testing';
import { assertExists, attachInternals } from '@/utils';
import { BdsTextField } from '../bds-text-field';
import { BdsTypography } from '../../../titles-text/bds-typography/bds-typography';

describe('bds-text-field a11y', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('aria-labelledby on input points to the label element id', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field label="Field label" id-component="test-field"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    const labelEl = root.querySelector('bds-typography[variant="label"]');
    assertExists(labelEl, 'label element not found');
    expect(input.getAttribute('aria-labelledby')).toBe(labelEl.getAttribute('id'));
  });

  it('no aria-labelledby on input when no label is set', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('aria-labelledby')).toBeNull();
  });

  it('aria-describedby on input points to the helper text element id', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field helper-text="Helper" id-component="test-field"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    const helperEl = root.querySelector('bds-typography[variant="helper"]');
    assertExists(helperEl, 'helper element not found');
    expect(input.getAttribute('aria-describedby')).toBe(helperEl.getAttribute('id'));
  });

  it('no aria-describedby on input when no helperText or errorMessage', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  it('aria-invalid="true" when error=true', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field error="true" error-message="Error"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('aria-invalid absent when error=false', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('aria-required="true" when required=true', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('aria-required absent when required=false', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('aria-required')).toBeNull();
  });

  it('clear button has aria-label="Clear"', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field clearable="true" value="hello"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const clearBtn = root.querySelector('.bds-text-field__action--clear');
    assertExists(clearBtn, 'clear button not found');
    expect(clearBtn.getAttribute('aria-label')).toBe('Clear');
  });

  it('password toggle has aria-label="Show password" initially', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field type="password"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const toggleBtn = root.querySelector('.bds-text-field__action--password');
    assertExists(toggleBtn, 'password toggle button not found');
    expect(toggleBtn.getAttribute('aria-label')).toBe('Show password');
  });

  it('password toggle aria-label switches to "Hide password" after toggle', async () => {
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

  it('disabled input has disabled attribute on inner input when disabled prop changes', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;

    (page.root as any).disabled = true;
    await page.waitForChanges();

    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.hasAttribute('disabled')).toBe(true);
  });

  it('aria-invalid="true" when internal validationError is true after required field is blurred empty', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await page.waitForChanges();

    assertExists(input, 'input not found');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('aria-invalid absent after internal validation passes on blur', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field required="true" validation-timing="blur"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input') as HTMLInputElement;

    input.value = 'filled';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(input.getAttribute('aria-invalid')).toBeNull();
  });
});
