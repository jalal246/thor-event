/* eslint-disable no-nested-ternary */
import Emitter from "./Emitter";
import Registry from "./Registry";

interface optsWithID {
  id: string;
  type?: never;
}

interface optsWithType<T extends string> {
  id?: never;
  type: T;
}

interface optsWithBoth<T extends string> {
  id: string;
  type: T;
}

class Events<
  EventTypes extends string = string,
  PayLoadInterface extends any = {},
  IssuerTypes extends string = string
> extends Registry<EventTypes, PayLoadInterface, IssuerTypes> {
  private emitter: Emitter<EventTypes>;

  constructor() {
    super();

    this.emitter = new Emitter<EventTypes>();
  }

  on(type: EventTypes, ...listeners: Function[]) {
    this.emitter.on(type, ...listeners);
  }

  off(type: EventTypes, listener: Function) {
    this.emitter.off(type, listener);
  }

  emit(opts: optsWithID | optsWithType<EventTypes> | optsWithBoth<EventTypes>) {
    const ids = opts.id
      ? [opts.id]
      : opts.type
      ? this.idsByType[opts.type]
      : [];

    ids.forEach((id) => {
      this.setPayload({ id, ...opts });

      const { type } = this.events[id];

      if (!type) return;

      this.emitter.emit(type, this.events[id]);
    });
  }
}

export default Events;
