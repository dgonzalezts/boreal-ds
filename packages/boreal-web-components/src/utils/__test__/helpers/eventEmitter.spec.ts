import { emitEvent } from '../../helpers/eventEmitter';

describe('emitEvent utility', () => {
  let hostElement: HTMLElement;

  beforeEach(() => {
    hostElement = document.createElement('div');
  });

  it('should prevent default and stop propagation of the original event', () => {
    const stopPropagationMock = jest.fn();
    const preventDefaultMock = jest.fn();
    const originalEvent = {
      stopPropagation: stopPropagationMock,
      preventDefault: preventDefaultMock,
    } as unknown as Event;

    emitEvent('myEvent', hostElement, {}, originalEvent);

    expect(stopPropagationMock).toHaveBeenCalled();
    expect(preventDefaultMock).toHaveBeenCalled();
  });

  it('should dispatch a CustomEvent with correct detail and bubbles', done => {
    const eventName = 'test-event';
    const detailData = { userId: 42 };

    // Set up a listener on the host
    hostElement.addEventListener(eventName, (ev: Event) => {
      const customEvent = ev as CustomEvent<typeof detailData>;
      expect(customEvent.detail).toEqual(detailData);
      expect(customEvent.bubbles).toBe(true);
      expect(customEvent.composed).toBe(true);
      done(); // Signals Jest that the async event was caught
    });

    emitEvent(eventName, hostElement, detailData);
  });

  it('should allow overriding default options', done => {
    hostElement.addEventListener('custom-options', (ev: Event) => {
      expect((ev as CustomEvent).bubbles).toBe(false); // Overridden value
      done();
    });

    emitEvent('custom-options', hostElement, {}, undefined, { bubbles: false });
  });
});
