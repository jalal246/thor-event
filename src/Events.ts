import Emitter from "./Emitter";
import Registry from "./Registry";

class Events<PayLoadInterface, EventTypes extends string> extends Registry<
  PayLoadInterface,
  EventTypes
> {
  private emitter: Emitter<EventTypes>;

  // on(status: TransactionEventStatus, listener: Function) {
  //   this.emitter.on(status, listener);
  // }

  // off(status: TransactionEventStatus, listener: Function) {
  //   this.emitter.off(status, listener);
  // }

  // emit(obj: EmitOptions<PayLoadInterface, EventTypes>) {
  //   this.setPayload(obj);

  //   this.emitter.emit(status, key, this.events[key]);
  // }
}

export default Events;
