export default class ElementInternals {
  form = null;
  setFormValue = jest.fn();
  setValidity = jest.fn();
  checkValidity = jest.fn(() => true);
  reportValidity = jest.fn(() => true);
}
