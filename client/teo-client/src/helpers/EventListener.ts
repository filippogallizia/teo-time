/* eslint-disable @typescript-eslint/strict-boolean-expressions */
type EventListenerType = 'errorHandling';
type EventListenerValues = boolean;

export type EventListenerCb = (value: EventListenerValues) => void;

export type EventListenerSubscription = {
  removeEventListener: () => void;
};

class EventListener {
  private events: { [eventName: string]: EventListenerCb[] } = {};

  public addListener(
    eventName: 'errorHandling',
    cb: (errorHandling: boolean) => void
  ): EventListenerSubscription;

  public addListener(
    eventName: EventListenerType,
    cb: EventListenerCb
  ): EventListenerSubscription {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(cb);

    return {
      removeEventListener: () => {
        const index: number = this.events[eventName].findIndex(
          (fn: EventListenerCb) => fn === cb
        );

        if (index > -1) {
          this.events[eventName].splice(index, 1);
        }
      },
    };
  }

  public emit(eventName: 'errorHandling', errorHandling: any): void;
  public emit(eventName: EventListenerType, values: EventListenerValues): void {
    if (this.events[eventName] && this.events[eventName].length > 0) {
      this.events[eventName].forEach((cb: EventListenerCb) => {
        /* istanbul ignore next */
        if (cb) {
          cb(values);
        }
      });
    }
  }
}
export default new EventListener();
