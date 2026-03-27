export interface IFormValidator {
  key: keyof ValidityStateFlags;
  isValid: (el: HTMLElement) => boolean;
  message: string;
}
