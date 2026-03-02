/**
 * Decorator to validate that a property is within a set of valid values.
 *
 * @param validValues Array of allowed values (T)
 * @param defaultValue Fallback value if validation fails
 */
export function Validate<T>(validValues: T[], defaultValue: T) {
  const instanceValues = new WeakMap<object, T>();

  return function (target: object, propertyKey: string) {
    const getter = function (this: object) {
      return instanceValues.get(this) ?? defaultValue;
    };

    const setter = function (this: object, newValue: T) {
      if (!validValues.includes(newValue)) {
        console.warn(
          `[BorealDS Validation] Invalid value "${String(newValue)}" for prop "${propertyKey}". ` +
            `Changed to default value: "${String(defaultValue)}".`,
        );
        instanceValues.set(this, defaultValue);
      } else {
        instanceValues.set(this, newValue);
      }
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
