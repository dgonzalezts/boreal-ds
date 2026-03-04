/**
 * Decorator to ensure a property value stays within a predefined set of allowed values.
 * If a value is assigned that does not exist in `validValues`, the property
 * will automatically revert to the provided `defaultValue`.
 *
 * @template T - The type of the values being validated.
 * @param {T[]} validValues - An array of permitted values.
 * @param {T} defaultValue - The fallback value applied when validation fails.
 *
 * @example
 * ```typescript
 * // Scenario 1: Valid assignment
 * // 'primary' is in the allowed list, so it is accepted.
 * @Validate(['default', 'primary', 'secondary'], 'default')
 * variant = 'primary'; // Result: 'primary'
 * ```
 *
 * @example
 * ```typescript
 * // Scenario 2: Invalid assignment (Fallback)
 * // 'danger' is not in the list, so it reverts to 'default'.
 * @Validate(['default', 'primary', 'secondary'], 'default')
 * variant = 'danger'; // Result: 'default'
 * ```
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
