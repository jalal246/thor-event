import Emitter from "./Emitter";
import Registry from "./Registry";

interface EmitOptions<EventTypes, PayLoadInterface, IssuerTypes> {
  id: string;
  type: EventTypes;
  issuer?: IssuerTypes;
  payload?: PayLoadInterface;
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

  emit(opts: EmitOptions<EventTypes, PayLoadInterface, IssuerTypes>) {
    this.setPayload(opts);

    this.emitter.emit(opts.type, this.events[opts.id]);
  }
}

export default Events;
