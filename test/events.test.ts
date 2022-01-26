import Events from "../src";
import type { EventInterface } from "../src";

type EventTypes = "type-1" | "type-2";
type IssuerTypes = "tester";
interface PayLoadInterface {
  name: string;
  address: string;
}

type EventI = EventInterface<EventTypes, PayLoadInterface, IssuerTypes>;

describe("Events", () => {
  let event: Events<EventTypes, PayLoadInterface, IssuerTypes>;

  const mockCallback1 = jest.fn(() => "function-1 is called");
  const mockCallback2 = jest.fn(() => "function-2 is called");
  const mockCallback3 = jest.fn(() => "function-3 is called");

  const evt1: EventI = {
    id: "id-1",
    type: "type-1",
    issuer: "tester",
    payload: {
      name: "name-1",
      address: "address-1",
    },
  };

  const evt2: EventI = {
    id: "id-2",
    type: "type-1",
    issuer: "tester",
    payload: {
      name: "name-2",
      address: "address-2",
    },
  };

  const evt3: EventI = {
    id: "id-3",
    type: "type-2",
    issuer: "tester",
    payload: {
      name: "name-3",
      address: "address-3",
    },
  };

  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(1648764000000);

    event = new Events();
  });

  it("should be defined", () => {
    expect(event).toMatchSnapshot();
  });

  it("should initialize event with two different types", () => {
    event.init(evt1);
    event.init(evt2);
    event.init(evt3);

    expect(event).toMatchSnapshot();
  });

  it("should update event-3 payload", () => {
    event.setPayload({
      id: evt3.id,
      payload: {
        name: "name-updated-3",
        address: "address-updated-3",
      },
    });

    expect(event).toMatchSnapshot();
  });

  it("should update event-2 id", () => {
    event.updateID({
      id: evt3.id,
      newID: "id-3-updated",
    });

    expect(event.idsByType).toMatchObject({
      "type-1": ["id-1", "id-2"],
      "type-2": ["id-3-updated"],
    });
  });

  it("should return all registered events in the same type", () => {
    expect(event.getEventsByType("type-1")).toMatchObject(["id-1", "id-2"]);
    expect(event.getEventsByType("type-2")).toMatchObject(["id-3-updated"]);
  });

  it("should clear from registry", () => {
    event.clear("id-3-updated");
    expect(event.getEventsByType("type-2")).toMatchObject([]);
    expect(event.idsByType).toMatchObject({
      "type-1": ["id-1", "id-2"],
    });
  });

  it("should add functions emitter", () => {
    event.on("type-1", mockCallback1, mockCallback2, mockCallback3);
    expect(event).toMatchSnapshot();
  });

  it("should emit all registered function by type", () => {
    event.emit({
      type: "type-1",
    });

    expect(mockCallback1).toHaveBeenCalledTimes(2);
    expect(mockCallback2).toHaveBeenCalledTimes(2);
    expect(mockCallback3).toHaveBeenCalledTimes(2);
  });

  it("should emit all registered function by id", () => {
    event.emit({
      id: evt1.id,
    });

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
    expect(mockCallback3).toHaveBeenCalledTimes(1);
  });
});
