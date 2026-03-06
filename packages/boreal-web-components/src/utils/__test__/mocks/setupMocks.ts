/**
 * @description This file contains the setup for mocks used in tests.
 * It is used to mock global functions and decorators that are used in the components.
 * This is necessary to avoid issues during tests, such as errors caused by decorators
 * or global functions that are not available in the test environment.
 */

/**
 * Mock global to @Valitate decorator to avoid issues during tests
 * this avoid the use of @Validate decorator, and prevent the error that the prop
 * always is the default value, and the validation is not working during tests.
 *
 * This is necessary because the @Validate decorator is used in the components,
 * and it is not possible to use it during tests, because it causes issues with the
 * props and the validation.
 */
// eslint-disable-next-line stencil/ban-side-effects
jest.mock('../../decorators/validate.decorate', () => ({
  Validate: () => () => {},
}));
