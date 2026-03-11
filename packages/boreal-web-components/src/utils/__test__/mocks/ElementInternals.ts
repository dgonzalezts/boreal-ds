/**
 * @file Mock implementation of ElementInternals for testing purposes.
 * simulates the behavior of ElementInternals in a testing environment, allowing components
 * that rely on form association and validation to be tested without a real browser environment.
 */

declare global {
  interface Window {
    /** Mock global of ElementInternals Class */
    ElementInternals: typeof ElementInternals;
  }
  interface HTMLElement {
    /** Simulate native attachInternals method to associate forms */
    attachInternals(): ElementInternals;
  }
  interface HTMLFormElement {
    /** Simulate native requestSubmit method to trigger form submission */
    requestSubmit(): void;
    /** Simulate native reset method to trigger form reset */
    reset(): void;
  }
}

/**
 * Mock class that simulates the behavior of ElementInternals for Stencil components.
 * Allows handling validity states and form association in tests.
 */
export class ElementInternals {
  /** Reference to the associated form element */
  form: HTMLFormElement | null = null;
  setFormValue = jest.fn();
  setValidity = jest.fn();
  checkValidity = jest.fn(() => true);
  reportValidity = jest.fn(() => true);

  /**
   * Simulate form submission by dispatching a submit event on the associated form
   * This should be do it because in testing evironment doesn't exist requesSubmit method on form element,
   * so we need to simulate it to test the submit behavior of the button component.
   * */
  requestSubmit = jest.fn(function (this: ElementInternals) {
    if (this.form !== null) {
      this.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  });
}

/**
 * Initializes the necessary mocks in the global environment
 * to ensure that components relying on ElementInternals can function correctly during tests.
 * This includes defining the attachInternals method on HTMLElement and simulating form submission methods.
 */
export function attachInternals() {
  const window = globalThis.window as Window;
  const MockElementInternals = ElementInternals;

  /** Initialize global ElementInternals mock if not already defined */
  if (window.ElementInternals === undefined) {
    window.ElementInternals = MockElementInternals;
  }

  /** Define attachInternals on HTMLElement to return a new instance of the mock ElementInternals */
  if (typeof HTMLElement.prototype.attachInternals === 'undefined') {
    Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
      value: function (this: HTMLElement) {
        const internals = new MockElementInternals();
        internals.form = this.closest('form');
        return internals;
      },
      writable: true,
      configurable: true,
    });
  }

  /** Define requestSubmit on HTMLFormElement to simulate form submission */
  if (typeof HTMLFormElement !== 'undefined' && typeof HTMLFormElement.prototype.requestSubmit === 'undefined') {
    HTMLFormElement.prototype.requestSubmit = function (this: HTMLFormElement) {
      this.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    };
  }

  /** Define reset on HTMLFormElement to simulate form reset */
  if (typeof HTMLFormElement !== 'undefined' && typeof HTMLFormElement.prototype.reset === 'undefined') {
    HTMLFormElement.prototype.reset = function (this: HTMLFormElement) {
      this.dispatchEvent(new Event('reset', { cancelable: true, bubbles: true }));
    };
  }
}
