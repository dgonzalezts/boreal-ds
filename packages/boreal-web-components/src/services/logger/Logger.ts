/**
 * Define the methods to log errors, warnings and messages to the Developer.
 */
export interface ILogger {
  error(component: string, message: string): void;
  warn(component: string, message: string): void;
  log(component: string, message: string): void;
}

/**
 * Default implementation of the logger service.
 * This class is responsible for logging errors, warnings and messages to the DevTools console.
 */
export class Logger implements ILogger {
  /**
   * Throw a normalized error with the component name and the message.
   * @param component Is the name of the component that is throwing the error.
   * @param message Is the message of the error.
   * @throws Error with the component name and the message.
   * @example
   * const logger = new Logger();
   * logger.error('MyComponent', 'This is an error');
   * // Throws an error with the message "[MyComponent]: This is an error"
   */
  error(component: string, message: string) {
    throw new Error(`[${component}]: ${message}`);
  }

  /**
   * Log a warning with the component name and the message.
   * @param component Is the name of the component that is throwing the warning.
   * @param message Is the message of the warning.
   * @example
   * const logger = new Logger();
   * logger.warn('MyComponent', 'This is a warning');
   * // Logs a warning with the message "[MyComponent]: This is a warning"
   */
  warn(component: string, message: string) {
    console.warn(`[${component}]: ${message}`);
  }

  /**
   * Log a message with the component name and the message.
   * @param component Is the name of the component that is logging the message.
   * @param message Is the message of the message.
   * @example
   * const logger = new Logger();
   * logger.log('MyComponent', 'This is a message');
   * // Logs a message with the message "[MyComponent]: This is a message"
   * @example
   * const logger = new Logger();
   * logger.log('MyComponent', 'This is a message');
   * // Logs a message with the message "[MyComponent]: This is a message"
   */
  log(component: string, message: string) {
    console.log(`[${component}]: ${message}`);
  }
}
