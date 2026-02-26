import { Validate } from '../../decorators/validate.decorate';

describe('Validate Decorator', () => {
  const VALID_COLORS = ['primary', 'secondary', 'default'];
  const DEFAULT_COLOR = 'default';

  /** example class (mock) */
  class TestComponent {
    @Validate(VALID_COLORS, DEFAULT_COLOR)
    public color: string = DEFAULT_COLOR;
  }

  let instance: TestComponent;

  beforeEach(() => {
    instance = new TestComponent();
  });

  it('should accept and store a valid value', () => {
    instance.color = 'primary';
    expect(instance.color).toBe('primary');
  });

  it('should revert to the default value if the value is invalid', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    instance.color = 'invalid-color';
    expect(instance.color).toBe(DEFAULT_COLOR);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should work with different data types', () => {
    class NumericComponent {
      @Validate([10, 20, 30], 10)
      public size: number = 10;
    }
    const numInstance = new NumericComponent();
    numInstance.size = 20;
    expect(numInstance.size).toBe(20);
    numInstance.size = 99; // Invalid value
    expect(numInstance.size).toBe(10);
  });
});
