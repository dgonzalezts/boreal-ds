import { validatePropValue } from '../../helpers/validateProps';

describe('validatePropValue', () => {
  let mockElement: HTMLElement & { [key: string]: unknown };
  const ACCEPTED_COLORS = ['primary', 'secondary', 'success'] as const;
  const FALLBACK = 'primary';
  const PROP_NAME = 'color';

  beforeEach(() => {
    mockElement = document.createElement('bds-button') as unknown as HTMLElement & { [key: string]: unknown };
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should not change the value or warn if the value is valid', () => {
    mockElement[PROP_NAME] = 'success';
    validatePropValue(ACCEPTED_COLORS, FALLBACK, mockElement, PROP_NAME);
    expect(mockElement[PROP_NAME]).toBe('success');
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should reset to fallback and warn if the value is invalid', () => {
    const invalidValue = 'ultra-red';
    mockElement[PROP_NAME] = invalidValue;
    validatePropValue(ACCEPTED_COLORS, FALLBACK, mockElement, PROP_NAME);

    expect(mockElement[PROP_NAME]).toBe(FALLBACK);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(`Invalid value "${invalidValue}" for prop "${PROP_NAME}"`),
    );
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Expected one of: primary, secondary, success'));
  });

  it('should work correctly with different property names', () => {
    const ACCEPTED_SIZES = ['sm', 'md', 'lg'] as const;
    const sizeProp = 'size';
    mockElement[sizeProp] = 'huge';
    validatePropValue(ACCEPTED_SIZES, 'md', mockElement, sizeProp);

    expect(mockElement[sizeProp]).toBe('md');
    expect(console.warn).toHaveBeenCalled();
  });
});
