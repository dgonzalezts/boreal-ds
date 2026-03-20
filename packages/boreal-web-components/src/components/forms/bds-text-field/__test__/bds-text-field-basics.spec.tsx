import { newSpecPage } from '@stencil/core/testing';
import { BdsTextField } from '../bds-text-field';
import { BdsTypography } from '../../../titles-text/bds-typography/bds-typography';
import { assertExists } from '@/utils/__test__/helpers';
import { attachInternals } from '@/utils/__test__/mocks/ElementInternals';

describe('bds-text-field basics', () => {
  beforeAll(() => {
    attachInternals();
  });

  it('renders with no props', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    assertExists(root, 'root element not found');
    const input = root.querySelector('input.bds-text-field__control');
    assertExists(input, 'input.bds-text-field__control not found');
    expect(root.querySelector('bds-typography[variant="label"]')).toBeNull();
    expect(root.querySelector('.bds-text-field__footer')).toBeNull();
  });

  it('forwards placeholder to inner input', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field placeholder="Enter text"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('placeholder')).toBe('Enter text');
  });

  it('defaults to type="text"', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('type')).toBe('text');
  });

  it('renders password toggle button when type="password"', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field type="password"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('type')).toBe('password');
    const toggleBtn = root.querySelector('.bds-text-field__action--password');
    assertExists(toggleBtn, 'password toggle button not found');
  });

  it('renders label when label prop is set', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field label="My Label"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const labelEl = root.querySelector('bds-typography[variant="label"]');
    assertExists(labelEl, 'label bds-typography not found');
    expect(labelEl.textContent).toContain('My Label');
  });

  it('does not render label element when no label prop', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    expect(root.querySelector('bds-typography[variant="label"]')).toBeNull();
  });

  it('renders sublabel with icon when both are set', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field sublabel="Sub" icon="bds-icon-settings"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const sublabel = root.querySelector('.bds-text-field__sublabel');
    assertExists(sublabel, '.bds-text-field__sublabel not found');
    expect(sublabel.textContent).toContain('Sub');
    const icon = sublabel.querySelector('em.bds-icon-settings');
    assertExists(icon, 'icon em element not found');
  });

  it('renders sublabel without icon when only sublabel is set', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field sublabel="Only sublabel"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const sublabel = root.querySelector('.bds-text-field__sublabel');
    assertExists(sublabel, '.bds-text-field__sublabel not found');
    expect(sublabel.querySelector('em')).toBeNull();
  });

  it('renders helper text in footer', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field helper-text="Helpful hint"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const footer = root.querySelector('.bds-text-field__footer');
    assertExists(footer, '.bds-text-field__footer not found');
    const helperTypography = footer.querySelector('bds-typography[variant="helper"]');
    assertExists(helperTypography, 'helper bds-typography not found');
    expect(helperTypography.textContent).toContain('Helpful hint');
  });

  it('shows error message instead of helper text when error=true', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field error="true" error-message="Field is invalid"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const footer = root.querySelector('.bds-text-field__footer');
    assertExists(footer, '.bds-text-field__footer not found');
    const helperTypography = footer.querySelector('bds-typography[variant="helper"]');
    assertExists(helperTypography, 'helper bds-typography not found');
    expect(helperTypography.textContent).toContain('Field is invalid');
  });

  it('errorMessage shown and helperText hidden when error=true', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field error="true" error-message="Error!" helper-text="Help"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const helperTypography = root.querySelector('.bds-text-field__footer bds-typography[variant="helper"]');
    assertExists(helperTypography, 'helper typography not found');
    expect(helperTypography.textContent).toContain('Error!');
    expect(helperTypography.textContent).not.toContain('Help');
  });

  it('renders char counter with counter=true and charCount set', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field counter="true" char-count="20"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const charCount = root.querySelector('.bds-text-field__char-count');
    assertExists(charCount, '.bds-text-field__char-count not found');
    expect(charCount.textContent).toBe('0/20');
  });

  it('does not render char counter when counter=true but charCount is 0', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field counter="true"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    expect(root.querySelector('.bds-text-field__char-count')).toBeNull();
  });

  it('sets --bds-text-field-width custom property when customWidth is provided', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field custom-width="300px"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    expect(root.style.getPropertyValue('--bds-text-field-width')).toBe('300px');
  });

  it('auto-generates a non-empty id on the inner input', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('id')).toBeTruthy();
  });

  it('uses provided idComponent as the inner input id', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field id-component="my-field"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.getAttribute('id')).toBe('my-field');
  });

  it('adds bds-text-field--plain class when variant="plain"', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field variant="plain"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    expect(root.classList.contains('bds-text-field--plain')).toBe(true);
  });

  it('sets readonly attribute on inner input when readOnly=true', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field readonly="true"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const input = root.querySelector('input');
    assertExists(input, 'input not found');
    expect(input.hasAttribute('readonly')).toBe(true);
  });

  it('renders slotted prefix content before the input', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field><span slot="prefix" id="prefix-el">@</span></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const prefix = root.querySelector('#prefix-el');
    assertExists(prefix, 'prefix slot content not found');
  });

  it('shows clear button when clearable=true and value is non-empty', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field clearable="true" value="hello"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    const clearBtn = root.querySelector('.bds-text-field__action--clear');
    assertExists(clearBtn, 'clear button not found');
  });

  it('does not show clear button when clearable=true but value is empty', async () => {
    const page = await newSpecPage({
      components: [BdsTextField, BdsTypography],
      html: '<bds-text-field clearable="true"></bds-text-field>',
    });
    const root = page.root as HTMLElement;
    expect(root.querySelector('.bds-text-field__action--clear')).toBeNull();
  });
});
