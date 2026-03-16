/**
 * Validates a component prop against a list of accepted values.
 * If the current value is invalid, the prop is reset to the fallback and a warning is issued.
 *
 * @param acceptedValues - The list of valid values for the prop.
 * @param fallbackValue - The value to apply when the current value is invalid.
 * @param element - The host element whose property will be corrected.
 * @param propertyName - The name of the prop to validate.
 */
export function validatePropValue<T extends string>(
  acceptedValues: readonly T[],
  fallbackValue: T,
  element: HTMLElement,
  propertyName: string,
): void {
  const currentValue = (element as unknown as Record<string, T>)[propertyName];
  if (acceptedValues.includes(currentValue)) return;
  (element as unknown as Record<string, T>)[propertyName] = fallbackValue;
  console.warn(
    `[BorealDS] Invalid value "${currentValue}" for prop "${propertyName}" on <${element.tagName.toLowerCase()}>. Expected one of: ${acceptedValues.join(', ')}.`,
  );
}
