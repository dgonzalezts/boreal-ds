export default function () {
  jest.mock('../../decorators/validate.decorate', () => ({
    Validate: () => () => {},
  }));
}
