export type ValidationTiming = 'blur' | 'input' | 'submit';

export interface IFormValidator {
  key: keyof ValidityStateFlags;
  isValid: (el: HTMLElement) => boolean;
  message: string;
}
