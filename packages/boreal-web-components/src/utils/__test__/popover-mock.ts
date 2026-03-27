export function setupPopoverMocks() {
  const mockResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  beforeEach(() => {
    HTMLElement.prototype.showPopover = jest.fn();
    HTMLElement.prototype.hidePopover = jest.fn();
    HTMLElement.prototype.togglePopover = jest.fn();
  });

  beforeAll(() => {
    global.ResizeObserver = mockResizeObserver;
  });

  afterEach(() => {
    mockResizeObserver.mockClear();
    jest.restoreAllMocks();
  });
}
