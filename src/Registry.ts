interface EmittedEvent<EventTypes, PayLoadInterface, IssuerTypes> {
  type?: EventTypes;
  issuer?: IssuerTypes;
  createdAt: number;
  payload: PayLoadInterface | {};
}

export interface EventInterface<
  EventTypes extends string = string,
  PayLoadInterface extends any = {},
  IssuerTypes extends string = string
> {
  id: string;
  issuer?: IssuerTypes;
  payload?: PayLoadInterface;
  type?: EventTypes;
}

class Registry<
  EventTypes extends string,
  PayLoadInterface,
  IssuerTypes extends string
> {
  idsByType: Record<EventTypes, string[]>;

  events: {
    [id: string]: EmittedEvent<EventTypes, PayLoadInterface, IssuerTypes>;
  };

  constructor() {
    // @ts-expect-error - this is initialized in the constructor.
    this.idsByType = {};
    this.events = {};
  }

  init({
    id,
    type,
    issuer,
    payload,
  }: EventInterface<EventTypes, PayLoadInterface, IssuerTypes>) {
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

      if (issuer) {
        this.events[id].issuer = issuer;
      }
    }
  }

  setPayload(opts: EventInterface<EventTypes, PayLoadInterface, IssuerTypes>) {
    if (!this.events[opts.id]) {
      this.init(opts);

      return;
    }

    if (opts.payload) {
      this.events[opts.id].payload = {
        ...opts.payload,
        ...this.events[opts.id].payload,
      };
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

    const { type } = this.events[newID];

    if (type && Array.isArray(this.idsByType[type])) {
      const i = this.idsByType[type].findIndex((x) => x === id);

      if (i !== -1) {
        this.idsByType[type][i] = newID;
      }
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
