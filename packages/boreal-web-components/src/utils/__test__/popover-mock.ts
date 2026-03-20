export function setupPopoverMocks() {
  beforeEach(() => {
    HTMLElement.prototype.showPopover = jest.fn();
    HTMLElement.prototype.hidePopover = jest.fn();
    HTMLElement.prototype.togglePopover = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
}
