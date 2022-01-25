import Emitter from "./Emitter";
import Registry from "./Registry";
import type { EmitOptions } from "./Registry";

class Events<EventTypes extends string, PayLoadInterface> extends Registry<
  EventTypes,
  PayLoadInterface
> {
  private emitter: Emitter<EventTypes>;

  constructor() {
    super();

    this.emitter = new Emitter<EventTypes>();
  }

  on(type: EventTypes, listener: Function) {
    this.emitter.on(type, listener);
  }

  off(type: EventTypes, listener: Function) {
    this.emitter.off(type, listener);
  }

  emit(obj: EmitOptions<EventTypes, PayLoadInterface>) {
    this.setPayload(obj);

    if (obj.type) {
      this.emitter.emit(obj.type, this.events[obj.id]);
    }
  }
}

export default Events;
