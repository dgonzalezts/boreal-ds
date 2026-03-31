import { newSpecPage } from '@stencil/core/testing';
import { attachInternals } from '@/utils/__test__/mocks/ElementInternals';
import { BdsCheckbox } from '../bds-checkbox';

describe('bds-checkbox variants', () => {
  beforeAll(() => {
    attachInternals();
  });

  const configurations = [
    { attr: 'checked', value: 'true', expected: 'bds-checkbox--checked' },
    { attr: 'indeterminate', value: 'true', expected: 'bds-checkbox--indeterminate' },
    { attr: 'error', value: 'true', expected: 'bds-checkbox--error' },
    { attr: 'disabled', value: 'true', expected: 'bds-checkbox--disabled' },
  ];

  configurations.forEach(({ attr, value, expected }) => {
    it(`should apply class ${expected} when ${attr}="${value}"`, async () => {
      const page = await newSpecPage({
        components: [BdsCheckbox],
        html: `<bds-checkbox ${attr}="${value}"></bds-checkbox>`,
      });

      const root = page.root as HTMLElement;
      expect(root.classList.contains(expected)).toBe(true);
    });
  });
});
