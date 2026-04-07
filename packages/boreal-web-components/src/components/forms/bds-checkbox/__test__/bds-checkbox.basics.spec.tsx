import { newSpecPage } from '@stencil/core/testing';
import { BdsCheckbox } from '../bds-checkbox';
import { assertExists } from '@/utils/__test__/helpers';

describe('bds-checkbox basics', () => {
  it('should render the checkbox element', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox></bds-checkbox>`,
    });

    const root = page.root as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute('role')).toBe('checkbox');
  });

  it('should render with label prop', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox label="Accept terms"></bds-checkbox>`,
    });

    const label = page.root?.querySelector('.bds-checkbox__label');
    assertExists(label, 'Label element not found');
    expect(label.textContent).toContain('Accept terms');
  });

  it('should render with slot when no label prop', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox><span>Slotted label</span></bds-checkbox>`,
    });

    const label = page.root?.querySelector('.bds-checkbox__label');
    assertExists(label, 'Label element not found');
  });

  it('should render checkbox box element', async () => {
    const page = await newSpecPage({
      components: [BdsCheckbox],
      html: `<bds-checkbox></bds-checkbox>`,
    });

    const box = page.root?.querySelector('.bds-checkbox__box');
    assertExists(box, 'Checkbox box element not found');
  });
});
