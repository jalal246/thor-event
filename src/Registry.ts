interface EmittedEvent<PayLoadInterface, EventTypes> {
  type?: EventTypes;
  createdAt: number;
  payload: PayLoadInterface | {};
}

interface EmitOptions<PayLoadInterface, EventTypes> {
  id: string;
  payload?: PayLoadInterface;
  type?: EventTypes;
}

class Registry<PayLoadInterface, EventTypes extends string> {
  idsByType: Record<EventTypes, string[]>;

  events: { [id: string]: EmittedEvent<PayLoadInterface, EventTypes> };

  constructor() {
    // @ts-expect-error - this is initialized in the constructor.
    this.idsByType = {};
    this.events = {};
  }

  init({ id, type, payload }: EmitOptions<PayLoadInterface, EventTypes>) {
    this.events[id] = {
      payload: payload || {},
      createdAt: new Date().getTime(),
    };

    if (type) {
      if (!this.idsByType[type]) {
        this.idsByType[type] = [];
      }

      this.idsByType[type].push(id);
      this.events[id].type = type;
    }
  }

  setPayload({ id, type, payload }: EmitOptions<PayLoadInterface, EventTypes>) {
    if (!this.events[id]) {
      this.init({ id, type, payload });

      return;
    }

    if (payload) {
      this.events[id].payload = { ...payload, ...this.events[id].payload };
    }
  }

  private internalUpdateID(id: string, newID: string, instance: "events") {
    const x = this[instance][id];
    delete this[instance][id];
    this[instance][newID] = x;
  }

  updateID({ id, newID }: { id: string; newID: string }) {
    if (!this.events[id]) {
      return;
    }

    this.internalUpdateID(id, newID, "events");

    const { type } = this.events[id];

    if (type && Array.isArray(this.idsByType[type])) {
      this.idsByType[type] = this.idsByType[type].filter((x) =>
        x === id ? newID : x
      );
    }
  }

  getEventsByType(type: EventTypes) {
    return type && Array.isArray(this.idsByType[type])
      ? this.idsByType[type]
      : [];
  }

  clear(id: string) {
    if (!this.events[id]) {
      return;
    }

    const { type } = this.events[id];

    delete this.events[id];

    if (type && Array.isArray(this.idsByType[type])) {
      this.idsByType[type] = this.idsByType[type].filter((x) => x !== id);

      if (this.idsByType[type].length === 0) {
        delete this.idsByType[type];
      }
    }
  }
}

export default Registry;
