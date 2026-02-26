export interface ILogger {
  error(component: string, message: string): void;
  warn(component: string, message: string): void;
  log(component: string, message: string): void;
}

export class Logger implements ILogger {
  error(component: string, message: string) {
    throw new Error(`[${component}]: ${message}`);
  }
  warn(component: string, message: string) {
    console.warn(`[${component}]: ${message}`);
  }
  log(component: string, message: string) {
    console.log(`[${component}]: ${message}`);
  }
}
