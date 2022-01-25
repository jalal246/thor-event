class Emitter<EventTypes extends string> {
  private listeners: {
    [key: string]: Function[];
  } = {};

  constructor() {
    this.listeners = {};
  }

  on(evt: EventTypes, listener: Function) {
    if (!this.listeners[evt]) {
      this.listeners[evt] = [];
    }

    this.listeners[evt].push(listener);
  }

  off(evt: EventTypes, listener: Function) {
    if (!this.listeners[evt]) {
      return;
    }

    this.listeners[evt] = this.listeners[evt].filter((l) => l !== listener);
  }

  emit(evt: EventTypes, ...args: any[]) {
    if (!this.listeners[evt]) {
      return;
    }

    this.listeners[evt].forEach((listener) => {
      listener(...args);
    });
  }
}

export default Emitter;
